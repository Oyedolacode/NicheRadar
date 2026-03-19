import React, { useState } from 'react'
import { useYouTube } from '../hooks/useYouTube'
import { useAppStore } from '../store/useAppStore'
import { scoreInfo, fmt } from '../lib/formulas'
import { useNavigate } from 'react-router-dom'

const KWS = ['AI tools for students', 'history shorts', 'psychology facts', 'minecraft documentaries', 'stoicism explained', 'weird science facts', 'coding projects beginners', 'personal finance young adults', 'ancient civilizations', 'dark history facts']

export default function ViralGaps() {
    const { fetchAndEnrich } = useYouTube()
    const { toast, setLoading } = useAppStore()
    const navigate = useNavigate()
    const [results, setResults] = useState([])
    const [busy, setBusy] = useState(false)

    async function scan() {
        setBusy(true); setLoading(true); setResults([])
        const out = []
        for (const kw of KWS) {
            try {
                const r = await fetchAndEnrich(kw)
                const avgV = r.enriched.reduce((a, b) => a + b.views, 0) / Math.max(r.enriched.length, 1)
                out.push({ ...r, avgV })
                setResults([...out])
            } catch (e) { }
        }
        setBusy(false); setLoading(false)
        toast('Scan complete', 'ok')
    }

    return (
        <div className="page fade-in">
            <p style={{ fontSize: 13, color: '#7aadc8', marginBottom: 'var(--s4)', maxWidth: 560, lineHeight: 1.6 }}>
                Topics where <strong style={{ color: 'var(--accent)' }}>demand outpaces supply</strong>.
                Formula: <code style={{ fontFamily: 'var(--fm)', color: 'var(--yellow)', fontSize: 11 }}>(vel × trend) ÷ saturation</code>
            </p>
            <button className="btn hot" onClick={scan} disabled={busy} style={{ marginBottom: 'var(--s4)' }}>
                {busy ? '⏳ Scanning…' : '⚡ Scan Viral Gaps'}
            </button>

            {results.length === 0 && !busy && (
                <div className="empty fade-in">
                    <div className="ei">⚡</div>
                    <h3>Click Scan to Begin</h3>
                    <p>Analyses 10 trending niches using the Viral Gap formula.</p>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(250px,1fr))', gap: 'var(--s4)' }}>
                {results.map(r => {
                    const si = scoreInfo(r.opp)
                    return (
                        <div key={r.kw} onClick={() => navigate('/explorer', { state: { keyword: r.kw } })}
                            style={{ background: 'var(--surface)', border: `1px solid ${si.color}55`, borderRadius: 'var(--r2)', padding: 'var(--s4)', cursor: 'pointer', transition: 'all .2s' }}
                            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2.5px)'}
                            onMouseLeave={e => e.currentTarget.style.transform = ''}>
                            <div style={{ fontFamily: 'var(--fm)', fontSize: 9, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 'var(--s2)' }}>{r.kw.toUpperCase()}</div>
                            <div style={{ fontFamily: 'var(--fm)', fontSize: 32, fontWeight: 700, color: si.color, lineHeight: 1, marginBottom: 'var(--s1)' }}>{r.opp.toFixed(1)}</div>
                            <div style={{ fontFamily: 'var(--fd)', fontSize: 13, fontWeight: 700, marginBottom: 'var(--s3)' }}>{si.label}</div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 'var(--s2)' }}>
                                {[['Views', fmt(r.avgV)], ['Videos', r.sat], ['Gap', r.vg.toFixed(1)]].map(([l, v]) => (
                                    <div key={l} style={{ background: 'var(--elevated)', borderRadius: 'var(--r1)', padding: 'var(--s2)', textAlign: 'center' }}>
                                        <div style={{ fontFamily: 'var(--fm)', fontSize: 11, fontWeight: 700 }}>{v}</div>
                                        <div style={{ fontSize: 8, color: 'var(--muted)', textTransform: 'uppercase', marginTop: 1 }}>{l}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                })}
                {busy && KWS.slice(results.length).map(kw => (
                    <div key={kw} className="card" style={{ padding: 'var(--s4)', borderRadius: 'var(--r2)' }}>
                        <div className="sk" style={{ height: 11, width: '55%', marginBottom: 'var(--s2)' }} />
                        <div className="sk" style={{ height: 38, width: 60, marginBottom: 'var(--s1)' }} />
                        <div className="sk" style={{ height: 14, width: '80%', marginBottom: 'var(--s3)' }} />
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 'var(--s2)' }}>
                            <div className="sk" style={{ height: 36, borderRadius: 'var(--r1)' }} />
                            <div className="sk" style={{ height: 36, borderRadius: 'var(--r1)' }} />
                            <div className="sk" style={{ height: 36, borderRadius: 'var(--r1)' }} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}