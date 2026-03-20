import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useYouTube } from '../hooks/useYouTube'
import { useAppStore } from '../store/useAppStore'
import { viralProbability, fmt, fmtP } from '../lib/formulas'

export default function ViralPredictor() {
    const { fetchAndEnrich } = useYouTube()
    const { toast, setLoading } = useAppStore()
    const location = useLocation()
    const [input, setInput] = useState('')
    const [results, setResults] = useState([])
    const [busy, setBusy] = useState(false)

    useEffect(() => {
        if (location.state?.results) setResults(location.state.results)
    }, [location.state])

    const PRESET = 'AI tools for students, dark history facts, psychology facts, stoicism explained, weird science facts, minecraft documentaries, personal finance basics'

    async function run() {
        const topics = input.split(',').map(s => s.trim()).filter(Boolean)
        if (!topics.length) { toast('Enter topics', 'e'); return }
        setBusy(true); setLoading(true)
        const out = []
        for (const t of topics) {
            try { out.push(await fetchAndEnrich(t)) } catch (e) { }
        }
        setResults(out.sort((a, b) => viralProbability(b) - viralProbability(a)))
        setBusy(false); setLoading(false)
        toast('Prediction complete', 'ok')
    }

    function probLabel(p) {
        if (p >= .8) return { label: 'VIRAL ALERT', color: 'var(--hot)', alert: true }
        if (p >= .65) return { label: 'HIGH', color: 'var(--accent)', alert: false }
        if (p >= .45) return { label: 'MODERATE', color: 'var(--yellow)', alert: false }
        return { label: 'LOW', color: 'var(--muted)', alert: false }
    }

    const alerts = results.filter(r => viralProbability(r) >= .8)

    return (
        <div className="page fade-in">
            {/* Hero */}
            <div style={{ background: 'linear-gradient(135deg,rgba(181,122,255,.08),rgba(0,229,204,.05))', border: '1px solid rgba(181,122,255,.25)', borderRadius: 'var(--r3)', padding: 'var(--s6)', marginBottom: 'var(--s6)' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--s2)', background: 'rgba(181,122,255,.12)', border: '1px solid rgba(181,122,255,.25)', borderRadius: 100, padding: '4px 14px', fontFamily: 'var(--fm)', fontSize: 10, color: 'var(--purple)', marginBottom: 'var(--s3)', fontWeight: 700 }}>
                    <span style={{ width: 6, height: 6, background: 'var(--purple)', borderRadius: '50%', boxShadow: '0 0 6px var(--purple)', animation: 'blink 1.5s infinite', display: 'inline-block' }} />
                    🤖 AI VIRAL PREDICTOR
                </div>
                <div style={{ fontFamily: 'var(--fd)', fontSize: 22, fontWeight: 800, marginBottom: 'var(--s2)' }}>Predict the Next Big Hit</div>
                <div style={{ fontSize: 13, color: '#7aadc8', lineHeight: 1.6, maxWidth: 640 }}>
                    Analyzes engagement velocity, saturation, and trend momentum to predict viral potential of any niche.
                </div>
            </div>

            {/* Input */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 18, flexWrap: 'wrap' }}>
                <input className="inp" value={input} onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && run()} style={{ maxWidth: 520 }}
                    placeholder="Topics comma-separated… AI tools, dark history, stoicism" />
                <button className="btn ai" onClick={run} disabled={busy}>
                    {busy ? '⏳ Predicting…' : '🤖 Run Prediction'}
                </button>
                <button className="btn s" onClick={() => setInput(PRESET)}>📋 Load Preset</button>
            </div>

            {/* Empty */}
            {results.length === 0 && !busy && (
                <div className="empty">
                    <div className="ei">🤖</div>
                    <h3>Viral Predictor Ready</h3>
                    <p>Enter comma-separated topics to generate viral probability scores.</p>
                </div>
            )}

            {/* Results */}
            {results.length > 0 && (
                <>
                    {/* Alert banner */}
                    {alerts.length > 0 && (
                        <div style={{ background: 'rgba(255,92,53,.06)', border: '1px solid rgba(255,92,53,.25)', borderRadius: 'var(--rl)', padding: '13px 17px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 11 }}>
                            <span style={{ fontSize: 20 }}>🚨</span>
                            <div>
                                <div style={{ fontFamily: 'var(--fd)', fontWeight: 700, fontSize: 13.5, color: 'var(--hot)' }}>
                                    {alerts.length} VIRAL ALERT{alerts.length > 1 ? 'S' : ''}
                                </div>
                                <div style={{ fontSize: 11.5, color: 'var(--muted)', fontFamily: 'var(--fm)' }}>
                                    {alerts.map(r => r.kw).join(' · ')}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(256px,1fr))', gap: 12, marginBottom: 20 }}>
                        {results.map(r => {
                            const prob = viralProbability(r)
                            const pct = Math.round(prob * 100)
                            const pl = probLabel(prob)
                            return (
                                <div key={r.kw} style={{ background: 'var(--surface)', border: `1px solid ${pl.alert ? 'var(--hot)' : 'var(--border)'}`, borderRadius: 'var(--rl)', padding: 18, position: 'relative', boxShadow: pl.alert ? '0 0 20px rgba(255,92,53,.15)' : 'none', transition: 'all .2s' }}>
                                    {pl.alert && (
                                        <div style={{ position: 'absolute', top: 13, right: 13, background: 'var(--hot)', color: '#fff', fontFamily: 'var(--fm)', fontSize: 8.5, fontWeight: 700, padding: '2px 7px', borderRadius: 10, animation: 'pulse .9s infinite' }}>
                                            🚨 VIRAL
                                        </div>
                                    )}
                                    <div style={{ fontFamily: 'var(--fm)', fontSize: 9, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8 }}>{r.kw}</div>
                                    <div style={{ fontFamily: 'var(--fm)', fontSize: 40, fontWeight: 700, lineHeight: 1, marginBottom: 4, color: pl.color }}>{pct}%</div>
                                    <div style={{ fontFamily: 'var(--fd)', fontSize: 14, fontWeight: 700, marginBottom: 12, color: pl.color }}>{pl.label}</div>
                                    <div style={{ height: 5, background: 'var(--border)', borderRadius: 3, overflow: 'hidden', marginBottom: 12 }}>
                                        <div style={{ height: '100%', width: `${pct}%`, background: pl.color, borderRadius: 3, transition: 'width 1.2s cubic-bezier(.4,0,.2,1)' }} />
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                                        {[
                                            ['Velocity', fmt(r.avgVel) + '/hr', 'var(--accent)'],
                                            ['Engagement', fmtP(r.avgEng), 'var(--yellow)'],
                                            ['Viral Gap', r.vg.toFixed(2), 'var(--green)'],
                                            ['Trend', r.trend.toFixed(1), 'var(--blue)'],
                                        ].map(([l, v, c]) => (
                                            <div key={l} style={{ background: 'var(--elevated)', borderRadius: 5, padding: '6px 8px' }}>
                                                <div style={{ fontFamily: 'var(--fm)', fontSize: 8.5, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: .5 }}>{l}</div>
                                                <div style={{ fontFamily: 'var(--fm)', fontSize: 12, fontWeight: 700, marginTop: 1, color: c }}>{v}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </>
            )}

            {/* Feature weights */}
            <div style={{ marginTop: 24 }}>
                <div className="slbl">Feature Weights</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
                    {[
                        ['⚡', 'View Velocity', 'Primary early viral signal.', '25%', 'var(--adim)', 'var(--accent)'],
                        ['💬', 'Engagement Rate', '(Likes + Comments) ÷ Views.', '20%', 'var(--adim)', 'var(--accent)'],
                        ['🏆', 'Creator Success', 'Views ÷ subscribers.', '20%', 'var(--adim)', 'var(--accent)'],
                        ['📈', 'Trend Momentum', 'Recency + velocity acceleration.', '15%', 'rgba(255,215,64,.1)', 'var(--yellow)'],
                        ['💡', 'Viral Gap', 'Demand ÷ supply.', '15%', 'rgba(181,122,255,.1)', 'var(--purple)'],
                        ['📉', 'Low Saturation', 'Less competition = more reach.', '5%', 'rgba(255,215,64,.1)', 'var(--yellow)'],
                    ].map(([ico, name, desc, weight, bg, color]) => (
                        <div key={name} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--rl)', padding: 14 }}>
                            <div style={{ fontSize: 20, marginBottom: 6 }}>{ico}</div>
                            <div style={{ fontFamily: 'var(--fd)', fontWeight: 700, fontSize: 12.5, marginBottom: 4 }}>{name}</div>
                            <div style={{ fontSize: 11.5, color: 'var(--muted)', lineHeight: 1.5, marginBottom: 7 }}>{desc}</div>
                            <span style={{ display: 'inline-flex', padding: '2px 7px', borderRadius: 10, fontFamily: 'var(--fm)', fontSize: 9, fontWeight: 700, background: bg, color }}>{weight}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}