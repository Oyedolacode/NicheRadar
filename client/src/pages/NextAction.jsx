import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useYouTube } from '../hooks/useYouTube'
import { useAppStore } from '../store/useAppStore'
import { useBookmarkStore } from '../store/useBookmarkStore'
import { scoreInfo, viralProbability, fmt } from '../lib/formulas'

const SEED_TOPICS = ['AI tools for students', 'dark history facts', 'psychology facts', 'stoicism explained', 'personal finance basics', 'weird science facts', 'minecraft documentaries', 'coding projects beginners']

export default function DoThisNext() {
    const { fetchAndEnrich } = useYouTube()
    const { toast, setLoading, lastExplorerResult } = useAppStore()
    const { niches } = useBookmarkStore()
    const location = useLocation()
    const navigate = useNavigate()
    const [recs, setRecs] = useState([])
    const [busy, setBusy] = useState(false)

    const passedResult = location.state?.result

    useEffect(() => {
        if (passedResult) analyze([passedResult])
        else if (lastExplorerResult) analyze([lastExplorerResult])
        else autoScan()
    }, [])

    async function analyze(existingResults) {
        setBusy(true); setLoading(true)
        try {
            let results = existingResults || []
            if (!results.length) {
                const sources = niches.length ? niches.map(n => n.kw) : SEED_TOPICS.slice(0, 6)
                for (const kw of sources.slice(0, 6)) {
                    try { results.push(await fetchAndEnrich(kw)) } catch (e) { }
                }
            }
            const scored = results.filter(r => r.enriched.length > 0).map(r => ({
                ...r,
                viralProb: viralProbability(r),
                si: scoreInfo(r.opp),
            })).sort((a, b) => (b.opp + b.viralProb * 10) - (a.opp + a.viralProb * 10))
            setRecs(scored.slice(0, 5))
            toast('Recommendations ready', 'ok')
        } catch (e) { toast(e.message, 'e') }
        finally { setBusy(false); setLoading(false) }
    }

    async function autoScan() {
        setBusy(true); setLoading(true)
        const results = []
        for (const kw of SEED_TOPICS.slice(0, 6)) {
            try { results.push(await fetchAndEnrich(kw)) } catch (e) { }
        }
        const scored = results.filter(r => r.enriched.length > 0).map(r => ({
            ...r,
            viralProb: viralProbability(r),
            si: scoreInfo(r.opp),
        })).sort((a, b) => (b.opp + b.viralProb * 10) - (a.opp + a.viralProb * 10))
        setRecs(scored.slice(0, 5))
        setBusy(false); setLoading(false)
        toast('Scan complete', 'ok')
    }

    const FORMAT_MAP = {
        massive: { format: 'Storytelling / Documentary', confidence: 'HIGH' },
        strong: { format: 'List video (5–10 items)', confidence: 'HIGH' },
        moderate: { format: 'How-to / Tutorial', confidence: 'MEDIUM' },
        saturated: { format: 'Shorts / Quick facts', confidence: 'LOW' },
    }

    return (
        <div>
            <div style={{ background: 'linear-gradient(135deg,rgba(0,229,204,.08),rgba(181,122,255,.05))', border: '1px solid rgba(0,229,204,.2)', borderRadius: 'var(--rl)', padding: '22px 26px', marginBottom: 20 }}>
                <div style={{ fontFamily: 'var(--fd)', fontSize: 20, fontWeight: 700, marginBottom: 6 }}>🚀 Do This Next</div>
                <div style={{ fontSize: 13, color: '#7aadc8', lineHeight: 1.6, maxWidth: 580 }}>
                    AI-powered recommendation engine. Analyzes your niche data and outputs your <strong style={{ color: 'var(--text)' }}>highest-probability next video</strong> — topic, format, title, and confidence score.
                </div>
            </div>

            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
                <button className="btn" onClick={autoScan} disabled={busy}>{busy ? '⏳ Scanning…' : '🔄 Rescan Niches'}</button>
                {lastExplorerResult && (
                    <button className="btn s" onClick={() => analyze([lastExplorerResult])}>
                        📡 Use Last Explorer Result
                    </button>
                )}
            </div>

            {recs.length === 0 && !busy && (
                <div className="empty"><div className="ei">🚀</div><h3>Scanning niches…</h3>
                    <p>Analyzing top niches to find your best next video opportunity.</p></div>
            )}

            {recs.length > 0 && (
                <>
                    {/* #1 Recommendation — hero */}
                    {(() => {
                        const top = recs[0]
                        const fm = FORMAT_MAP[top.si.cls] || FORMAT_MAP.moderate
                        const titles = [
                            `${top.enriched[0]?.title?.split(' ').slice(0, 4).join(' ') || '5'} Things About ${top.kw}`,
                            `The Truth About ${top.kw} Nobody Talks About`,
                            `Why ${top.kw} Is More Important Than You Think`,
                        ]
                        return (
                            <div style={{ background: 'linear-gradient(135deg,rgba(0,229,204,.06),rgba(0,229,204,.02))', border: '1px solid rgba(0,229,204,.25)', borderRadius: 'var(--rl)', padding: '22px 26px', marginBottom: 20 }}>
                                <div style={{ fontFamily: 'var(--fm)', fontSize: 9, textTransform: 'uppercase', letterSpacing: 2, color: 'var(--accent)', marginBottom: 10 }}>🎯 #1 RECOMMENDATION</div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                                    <div>
                                        <div style={{ fontFamily: 'var(--fm)', fontSize: 9, color: 'var(--muted)', marginBottom: 3 }}>TOPIC</div>
                                        <div style={{ fontFamily: 'var(--fd)', fontSize: 22, fontWeight: 700, marginBottom: 12, color: 'var(--accent)' }}>{top.kw}</div>
                                        <div style={{ fontFamily: 'var(--fm)', fontSize: 9, color: 'var(--muted)', marginBottom: 3 }}>FORMAT</div>
                                        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>{fm.format}</div>
                                        <div style={{ fontFamily: 'var(--fm)', fontSize: 9, color: 'var(--muted)', marginBottom: 6 }}>SUGGESTED TITLES</div>
                                        {titles.map((t, i) => (
                                            <div key={i} style={{ padding: '7px 10px', background: 'var(--elevated)', borderRadius: 'var(--r)', marginBottom: 5, fontSize: 12.5, lineHeight: 1.4, cursor: 'pointer', transition: 'all .15s', borderLeft: '2px solid var(--accent)' }}
                                                onClick={() => navigate('/factory', { state: { topic: top.kw } })}>
                                                {t}
                                            </div>
                                        ))}
                                    </div>
                                    <div>
                                        <div style={{ marginBottom: 12 }}>
                                            <div style={{ fontFamily: 'var(--fm)', fontSize: 9, color: 'var(--muted)', marginBottom: 4 }}>OPPORTUNITY SCORE</div>
                                            <div style={{ fontFamily: 'var(--fm)', fontSize: 42, fontWeight: 700, color: top.si.color, lineHeight: 1 }}>{top.opp.toFixed(1)}</div>
                                            <span className={`pill ${top.si.cls}`} style={{ marginTop: 6, display: 'inline-flex' }}>{top.si.label}</span>
                                        </div>
                                        <div style={{ marginBottom: 12 }}>
                                            <div style={{ fontFamily: 'var(--fm)', fontSize: 9, color: 'var(--muted)', marginBottom: 4 }}>VIRAL PROBABILITY</div>
                                            <div style={{ fontFamily: 'var(--fm)', fontSize: 28, fontWeight: 700, color: top.viralProb >= .7 ? 'var(--green)' : top.viralProb >= .4 ? 'var(--yellow)' : 'var(--muted)' }}>{Math.round(top.viralProb * 100)}%</div>
                                        </div>
                                        <div style={{ marginBottom: 16 }}>
                                            <div style={{ fontFamily: 'var(--fm)', fontSize: 9, color: 'var(--muted)', marginBottom: 4 }}>CONFIDENCE</div>
                                            <span style={{ fontFamily: 'var(--fm)', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: fm.confidence === 'HIGH' ? 'rgba(0,230,118,.1)' : fm.confidence === 'MEDIUM' ? 'rgba(255,215,64,.1)' : 'rgba(255,92,53,.1)', color: fm.confidence === 'HIGH' ? 'var(--green)' : fm.confidence === 'MEDIUM' ? 'var(--yellow)' : 'var(--hot)' }}>{fm.confidence}</span>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                                            <button className="btn fac" onClick={() => navigate('/factory', { state: { topic: top.kw } })} style={{ justifyContent: 'center' }}>🏭 Open in Factory</button>
                                            <button className="btn sim" onClick={() => navigate('/simulator', { state: { topic: top.kw } })} style={{ justifyContent: 'center' }}>🎮 Simulate It</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })()}

                    {/* Other recommendations */}
                    <div style={{ marginBottom: 10 }}>
                        <div className="slbl">Also Strong</div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 10 }}>
                            {recs.slice(1).map((r, i) => {
                                const fm = FORMAT_MAP[r.si.cls] || FORMAT_MAP.moderate
                                return (
                                    <div key={r.kw} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--rl)', padding: 15, cursor: 'pointer', transition: 'all .2s' }}
                                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = '' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                                            <div style={{ fontFamily: 'var(--fm)', fontSize: 9, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1 }}>#{i + 2}</div>
                                            <span className={`pill ${r.si.cls}`}>{r.si.label}</span>
                                        </div>
                                        <div style={{ fontFamily: 'var(--fd)', fontWeight: 700, fontSize: 14, marginBottom: 4, color: 'var(--text)' }}>{r.kw}</div>
                                        <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 10 }}>{fm.format}</div>
                                        <div style={{ display: 'flex', gap: 10, fontFamily: 'var(--fm)', fontSize: 10.5 }}>
                                            <span style={{ color: 'var(--accent)' }}>Score: {r.opp.toFixed(1)}</span>
                                            <span style={{ color: 'var(--muted)' }}>VP: {Math.round(r.viralProb * 100)}%</span>
                                        </div>
                                        <button className="btn fac" style={{ width: '100%', justifyContent: 'center', marginTop: 10, fontSize: '10.5px', padding: '6px' }}
                                            onClick={() => navigate('/factory', { state: { topic: r.kw } })}>🏭 Factory</button>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}