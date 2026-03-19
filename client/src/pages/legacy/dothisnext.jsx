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
        <div className="page fade-in">
            <div style={{ background: 'linear-gradient(135deg,rgba(0,229,204,.08),rgba(181,122,255,.05))', border: '1px solid rgba(0,229,204,.25)', borderRadius: 'var(--r3)', padding: 'var(--s6)', marginBottom: 'var(--s6)' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--s2)', background: 'rgba(0,229,204,.12)', border: '1px solid rgba(0,229,204,.25)', borderRadius: 100, padding: '4px 14px', fontFamily: 'var(--fm)', fontSize: 10, color: 'var(--accent)', marginBottom: 'var(--s3)', fontWeight: 700 }}>
                    <span style={{ width: 6, height: 6, background: 'var(--accent)', borderRadius: '50%', boxShadow: '0 0 6px var(--accent)', animation: 'blink 1.5s infinite' }} />
                    🚀 DO THIS NEXT
                </div>
                <div style={{ fontFamily: 'var(--fd)', fontSize: 22, fontWeight: 800, marginBottom: 'var(--s2)' }}>Intelligence-First Strategy</div>
                <div style={{ fontSize: 13, color: '#7aadc8', lineHeight: 1.6, maxWidth: 640 }}>AI-powered recommendation engine. Analyzes your niche signals to prioritize your <strong style={{ color: 'var(--text)' }}>highest-probability next moves</strong>.</div>
            </div>

            <div className="h-stack" style={{ gap: 'var(--s3)', marginBottom: 'var(--s6)' }}>
                <button className="btn hot" onClick={autoScan} disabled={busy}>{busy ? '⏳ Scanning…' : '🔄 Refresh Strategy'}</button>
                {lastExplorerResult && (
                    <button className="btn s" onClick={() => analyze([lastExplorerResult])}>
                        📡 Use Last Analysis
                    </button>
                )}
            </div>

            {recs.length === 0 && !busy && (
                <div className="empty fade-in"><div className="ei">🚀</div><h3>Awaiting Signal Intelligence</h3>
                    <p>Scan your niches to generate prioritized content opportunities.</p></div>
            )}

            {recs.length > 0 && (
                <div className="fade-in">
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
                            <div style={{ background: 'linear-gradient(135deg,rgba(0,229,204,.06),rgba(0,229,204,.02))', border: '1px solid rgba(0,229,204,.25)', borderRadius: 'var(--r3)', padding: 'var(--s6)', marginBottom: 'var(--s8)' }}>
                                <div style={{ fontFamily: 'var(--fm)', fontSize: 10, textTransform: 'uppercase', letterSpacing: 2, color: 'var(--accent)', marginBottom: 'var(--s4)', fontWeight: 800 }}>🎯 PRIMARY RECOMMENDATION</div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--s8)' }}>
                                    <div className="v-stack" style={{ gap: 'var(--s4)' }}>
                                        <div>
                                            <div style={{ fontFamily: 'var(--fm)', fontSize: 9, color: 'var(--muted)', marginBottom: 'var(--s1)' }}>PRIORITY TOPIC</div>
                                            <div style={{ fontFamily: 'var(--fd)', fontSize: 28, fontWeight: 800, color: 'var(--accent)', lineHeight: 1 }}>{top.kw}</div>
                                        </div>
                                        <div>
                                            <div style={{ fontFamily: 'var(--fm)', fontSize: 9, color: 'var(--muted)', marginBottom: 'var(--s1)' }}>RECOMMENDED FORMAT</div>
                                            <div style={{ fontSize: 15, fontWeight: 700 }}>{fm.format}</div>
                                        </div>
                                        <div>
                                            <div style={{ fontFamily: 'var(--fm)', fontSize: 9, color: 'var(--muted)', marginBottom: 'var(--s2)' }}>SUGGESTED TITLES</div>
                                            <div className="v-stack" style={{ gap: 'var(--s2)' }}>
                                                {titles.map((t, i) => (
                                                    <div key={i} className="card hoverable" style={{ padding: 'var(--s2) var(--s4)', borderRadius: 'var(--r1)', fontSize: 13, lineHeight: 1.4, cursor: 'pointer', borderLeft: '3px solid var(--accent)' }}
                                                        onClick={() => navigate('/factory', { state: { topic: top.kw } })}>
                                                        {t}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="v-stack" style={{ gap: 'var(--s5)' }}>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--s4)' }}>
                                            <div className="card" style={{ padding: 'var(--s4)', borderRadius: 'var(--r2)' }}>
                                                <div style={{ fontFamily: 'var(--fm)', fontSize: 9, color: 'var(--muted)', marginBottom: 'var(--s1)' }}>OPPORTUNITY</div>
                                                <div style={{ fontFamily: 'var(--fm)', fontSize: 32, fontWeight: 800, color: top.si.color, lineHeight: 1 }}>{top.opp.toFixed(1)}</div>
                                                <div className={`pill ${top.si.cls}`} style={{ marginTop: 'var(--s2)' }}>{top.si.label}</div>
                                            </div>
                                            <div className="card" style={{ padding: 'var(--s4)', borderRadius: 'var(--r2)' }}>
                                                <div style={{ fontFamily: 'var(--fm)', fontSize: 9, color: 'var(--muted)', marginBottom: 'var(--s1)' }}>VIRAL PROB.</div>
                                                <div style={{ fontFamily: 'var(--fm)', fontSize: 32, fontWeight: 800, color: top.viralProb >= .7 ? 'var(--green)' : top.viralProb >= .4 ? 'var(--yellow)' : 'var(--muted)', lineHeight: 1 }}>{Math.round(top.viralProb * 100)}%</div>
                                                <div style={{ color: 'var(--muted)', fontSize: 9.5, marginTop: 'var(--s2)', textTransform: 'uppercase' }}>{fm.confidence} Reliability</div>
                                            </div>
                                        </div>
                                        <div className="h-stack" style={{ gap: 'var(--s3)' }}>
                                            <button className="btn fac" onClick={() => navigate('/factory', { state: { topic: top.kw } })} style={{ flex: 1, justifyContent: 'center' }}>🏭 Factory</button>
                                            <button className="btn sim" onClick={() => navigate('/simulator', { state: { topic: top.kw } })} style={{ flex: 1, justifyContent: 'center' }}>🎮 Simulator</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })()}

                    {/* Other recommendations */}
                    <div>
                        <div style={{ fontFamily: 'var(--fm)', fontSize: 11, fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 'var(--s4)' }}>Secondary High-Potential Niches</div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 'var(--s4)' }}>
                            {recs.slice(1).map((r, i) => {
                                const fm = FORMAT_MAP[r.si.cls] || FORMAT_MAP.moderate
                                return (
                                    <div key={r.kw} className="card hoverable" style={{ padding: 'var(--s4)', borderRadius: 'var(--r2)', cursor: 'pointer' }}
                                        onClick={() => navigate('/factory', { state: { topic: r.kw } })}>
                                        <div className="h-stack" style={{ justifyContent: 'space-between', marginBottom: 'var(--s3)' }}>
                                            <div style={{ fontFamily: 'var(--fm)', fontSize: 10, color: 'var(--dim)', fontWeight: 800 }}>RANK #{i + 2}</div>
                                            <span className={`pill ${r.si.cls}`}>{r.si.label}</span>
                                        </div>
                                        <div style={{ fontFamily: 'var(--fd)', fontWeight: 800, fontSize: 16, marginBottom: 'var(--s1)', color: 'var(--text)' }}>{r.kw}</div>
                                        <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 'var(--s4)' }}>{fm.format}</div>
                                        <div className="h-stack" style={{ gap: 'var(--s4)', borderTop: '1px solid var(--border)', paddingTop: 'var(--s3)' }}>
                                            <div>
                                                <div style={{ fontSize: 9, color: 'var(--muted)', textTransform: 'uppercase' }}>Opposition</div>
                                                <div style={{ fontFamily: 'var(--fm)', fontSize: 14, fontWeight: 800, color: 'var(--accent)' }}>{r.opp.toFixed(1)}</div>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: 9, color: 'var(--muted)', textTransform: 'uppercase' }}>Viral Prob</div>
                                                <div style={{ fontFamily: 'var(--fm)', fontSize: 14, fontWeight: 800, color: 'var(--hot)' }}>{Math.round(r.viralProb * 100)}%</div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}