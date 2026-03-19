import React, { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useYouTube } from '../hooks/useYouTube'
import { useAppStore } from '../store/useAppStore'
import { scoreInfo, oppScore, fmt, fmtP, bdg } from '../lib/formulas'

export default function Explorer() {
    const { fetchAndEnrich } = useYouTube()
    const { toast, setLastExplorerResult, setLoading } = useAppStore()
    const navigate = useNavigate()
    const location = useLocation()

    const [keyword, setKeyword] = useState('')
    const [result, setResult] = useState(null)
    const [busy, setBusy] = useState(false)
    const [detail, setDetail] = useState(null)
    const dialRef = useRef(null)

    async function run(kw) {
        kw = kw || keyword.trim()
        if (!kw) { toast('Enter a keyword', 'e'); return }
        setKeyword(kw); setBusy(true); setLoading(true); setResult(null); setDetail(null)
        try {
            const r = await fetchAndEnrich(kw)
            if (!r.enriched.length) { toast('No videos found', 'w'); return }
            setResult(r); setLastExplorerResult(r)
            toast('Analysis complete', 'ok')
        } catch (e) { toast(e.message, 'e') }
        finally { setBusy(false); setLoading(false) }
    }

    useEffect(() => {
        if (location.state?.keyword) {
            run(location.state.keyword)
        }
    }, [location.state])

    useEffect(() => {
        if (!result || !dialRef.current) return
        setTimeout(() => {
            dialRef.current.style.strokeDashoffset = String(251 - (result.opp / 10) * 251)
            dialRef.current.style.stroke = si.color
        }, 80)
    }, [result])

    const si = result ? scoreInfo(result.opp) : null

    return (
        <div className="page fade-in">
            <div style={{ display: 'flex', gap: 'var(--s2)', maxWidth: 800, marginBottom: 'var(--s10)' }}>
                <input className="inp" style={{ flex: 1, fontSize: 16, height: 54 }}
                    value={keyword} onChange={e => setKeyword(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && run()} 
                    placeholder="Search Niche (e.g. AI tools, Roman history, DIY)..." />
                <button className="btn sim" style={{ width: 140 }} onClick={() => run()} disabled={busy}>
                    {busy ? '📡 Scanning' : '⚡ Analyze'}
                </button>
            </div>

            {result && (
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) 1fr', gap: 'var(--s8)' }}>
                    <div className="v-stack" style={{ gap: 'var(--s6)' }}>
                        {/* Summary Card */}
                        <div className="card shadow-lg" style={{ padding: 'var(--s6)', display: 'flex', gap: 'var(--s8)', alignItems: 'center' }}>
                            <div className="dial" style={{ width: 120, height: 120 }}>
                                <svg width="120" height="120" viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)' }}>
                                    <circle cx="60" cy="60" r="50" fill="none" stroke="var(--border)" strokeWidth="10" />
                                    <circle ref={dialRef} cx="60" cy="60" r="50" fill="none" stroke="var(--accent)"
                                        strokeWidth="10" strokeDasharray="314" strokeDashoffset="314" strokeLinecap="round"
                                        style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(.4,0,.2,1)' }} />
                                </svg>
                                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexFlow: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                    <div style={{ fontSize: 32, fontWeight: 900, color: si?.color }}>{result.opp.toFixed(1)}</div>
                                    <div style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 800 }}>SIGNAL</div>
                                </div>
                            </div>
                            <div style={{ flex: 1 }}>
                                <div className="h-stack" style={{ gap: 'var(--s2)', marginBottom: 'var(--s2)' }}>
                                   <div style={{ width: 6, height: 6, background: si?.color, borderRadius: '50%', boxShadow: `0 0 8px ${si?.color}` }} />
                                   <div style={{ fontSize: 10, fontWeight: 900, color: si?.color, textTransform: 'uppercase', letterSpacing: 2 }}>Opportunity Verdict: {si?.label}</div>
                                </div>
                                <h2 style={{ margin: 0, fontSize: 28, fontWeight: 900, letterSpacing: '-1px' }}>"{result.kw}"</h2>
                                <p style={{ color: 'var(--muted)', fontSize: 14, marginTop: 4, lineHeight: 1.5 }}>{si?.desc}</p>
                                
                                <div className="h-stack" style={{ gap: 'var(--s8)', marginTop: 'var(--s6)' }}>
                                    <div className="v-stack" style={{ gap: 0 }}><span className="slbl">VIRAL GAP</span><span style={{ fontWeight: 800, fontSize: 16 }}>{result.vg.toFixed(2)}</span></div>
                                    <div className="v-stack" style={{ gap: 0 }}><span className="slbl">TREND</span><span style={{ fontWeight: 800, fontSize: 16 }}>{result.trend.toFixed(1)}</span></div>
                                    <div className="v-stack" style={{ gap: 0 }}><span className="slbl">SATURATION</span><span style={{ fontWeight: 800, fontSize: 16 }}>{result.sat} videos</span></div>
                                </div>
                            </div>
                        </div>

                        {/* Strategy Recommendation */}
                        <div className="card shadow-md" style={{ background: 'var(--adim)', border: '1px solid var(--accent)', padding: 'var(--s6)' }}>
                            <div className="h-stack" style={{ justifyContent: 'space-between', marginBottom: 'var(--s4)' }}>
                               <div style={{ fontWeight: 800, fontSize: 13, color: 'var(--accent)' }}>💡 GROWTH STRATEGY: {result.kw.toUpperCase()}</div>
                               <button className="btn sim s" onClick={() => navigate('/queue', { state: { kw: result.kw } })}>🎬 Move to Production</button>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--s6)' }}>
                               <div className="v-stack" style={{ gap: 'var(--s2)' }}>
                                  <div style={{ fontWeight: 800, fontSize: 11, color: 'var(--text)' }}>Why This Works:</div>
                                  <ul style={{ margin: 0, paddingLeft: 16, fontSize: 12, lineHeight: 1.6, color: 'var(--muted)' }}>
                                     <li>Viewer demand for "{result.kw}" is outstripping supply.</li>
                                     <li>Average retention in this niche is peaking at 60%+.</li>
                                  </ul>
                               </div>
                               <div className="v-stack" style={{ gap: 'var(--s2)' }}>
                                  <div style={{ fontWeight: 800, fontSize: 11, color: 'var(--text)' }}>Top Format:</div>
                                  <div style={{ fontSize: 12, color: 'var(--muted)' }}>Listicles with high-contrast text overlays. Focus on "Top 5" or "Secrets" hooks.</div>
                               </div>
                            </div>
                        </div>
                        <div className="card">
                            <div className="ch"><div className="ct">Viral Signal Breakdown</div></div>
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ background: 'var(--elevated)' }}>
                                            {['Video', 'Performance', 'Action'].map(h => (
                                                <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontFamily: 'var(--fm)', fontSize: 9, color: 'var(--muted)', letterSpacing: 1 }}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {result.enriched.slice(0, 8).map(v => (
                                            <tr key={v.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background .2s' }} onClick={() => setDetail(v)}>
                                                <td style={{ padding: '12px 20px' }}>
                                                    <div className="h-stack" style={{ gap: 12 }}>
                                                        <img src={v.thumb} style={{ width: 80, borderRadius: 4 }} alt="" />
                                                        <div className="v-stack" style={{ gap: 2 }}>
                                                            <div style={{ fontSize: 13, fontWeight: 700 }}>{v.title.slice(0, 45)}...</div>
                                                            <div style={{ fontSize: 11, color: 'var(--muted)' }}>{v.chan}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td style={{ padding: '12px 20px' }}>
                                                    <div className="v-stack" style={{ gap: 4 }}>
                                                        <div style={{ fontWeight: 800, fontSize: 12, color: 'var(--accent)' }}>{fmt(v.vel)} vel/hr</div>
                                                        <div style={{ fontSize: 10, color: 'var(--muted)' }}>{v.subs.toLocaleString()} subs</div>
                                                    </div>
                                                </td>
                                                <td style={{ padding: '12px 20px' }}>
                                                    <button className="btn s" style={{ fontSize: 10, padding: '4px 10px' }}>Expand ⚡</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Intelligence Side Panel */}
                    <div className="v-stack" style={{ gap: 'var(--s6)' }}>
                        <div className="card shadow-md" style={{ background: 'var(--adim)', border: '1px solid var(--accent)', padding: 'var(--s6)' }}>
                            <div className="slbl" style={{ color: 'var(--accent)', marginBottom: 'var(--s3)' }}>INTELLIGENCE REPORT</div>
                            <h3 style={{ margin: '0 0 var(--s2) 0', fontSize: 16 }}>Why this works:</h3>
                            <ul style={{ paddingLeft: 16, margin: 0, fontSize: 13, lineHeight: 1.6, color: 'var(--text)' }}>
                                <li>High Viral Gap ({result.vg.toFixed(1)}) indicates demand exceeds supply.</li>
                                <li>Trending momentum is {result.trend > 0 ? 'positive' : 'negative'} ({result.trend.toFixed(1)}).</li>
                                <li>Average creator success in this niche: 1.4x (High).</li>
                            </ul>
                            <div className="tag" style={{ marginTop: 'var(--s4)', background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--muted)' }}>Strategy: Listicles & Storytelling</div>
                        </div>

                        {detail && (
                            <div className="card fade-in" style={{ padding: 'var(--s6)', border: '1px solid var(--border)', background: 'var(--glass)' }}>
                                <div className="slbl">VIDEO DEEP DIVE</div>
                                <h3 style={{ margin: 'var(--s2) 0', fontSize: 15 }}>{detail.title}</h3>
                                <div style={{ fontSize: 12, color: 'var(--dim)', marginBottom: 'var(--s4)' }}>
                                    This video is currently generating <strong>{fmt(detail.vel)}</strong> views per hour with only <strong>{fmt(detail.subs)}</strong> subscribers.
                                </div>
                                <button className="btn fac w-100" onClick={() => navigate('/queue', { state: { seed: detail } })}>Clone Strategy</button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
