import React, { useState } from 'react'
import { useYouTube } from '../hooks/useYouTube'
import { useAppStore } from '../store/useAppStore'
import { useNavigate } from 'react-router-dom'
import { fmt, oppScore, scoreInfo } from '../lib/formulas'

function estimateVolume(avgViews, sat, vel) {
    const score = vel * sat
    if (score > 100000) return { label: 'Very High', color: 'var(--green)', pct: 95 }
    if (score > 30000) return { label: 'High', color: 'var(--accent)', pct: 75 }
    if (score > 8000) return { label: 'Medium', color: 'var(--yellow)', pct: 50 }
    if (score > 2000) return { label: 'Low', color: 'var(--orange)', pct: 30 }
    return { label: 'Very Low', color: 'var(--muted)', pct: 15 }
}

function estimateDifficulty(sat, avgSubs) {
    const score = sat * Math.log10(Math.max(avgSubs, 100))
    if (score > 5000) return { label: 'Very Hard', color: 'var(--red)', pct: 90 }
    if (score > 2000) return { label: 'Hard', color: 'var(--hot)', pct: 70 }
    if (score > 800) return { label: 'Medium', color: 'var(--yellow)', pct: 50 }
    if (score > 200) return { label: 'Easy', color: 'var(--green)', pct: 30 }
    return { label: 'Very Easy', color: 'var(--accent)', pct: 10 }
}

const RELATED_SUFFIXES = ['explained', 'for beginners', 'tips', 'secrets', 'documentary', 'shorts', 'facts', 'tutorial', 'guide', 'examples', 'case study', 'deep dive']

export default function KeywordResearch() {
    const { fetchAndEnrich } = useYouTube()
    const { toast, setLoading } = useAppStore()
    const navigate = useNavigate()
    const [keyword, setKeyword] = useState('')
    const [results, setResults] = useState([])
    const [main, setMain] = useState(null)
    const [busy, setBusy] = useState(false)

    async function research() {
        if (!keyword.trim()) { toast('Enter a keyword', 'e'); return }
        setBusy(true); setLoading(true); setResults([]); setMain(null)
        try {
            // Fetch main keyword
            const mainResult = await fetchAndEnrich(keyword)
            setMain(mainResult)

            // Fetch top related variants
            const variants = RELATED_SUFFIXES.slice(0, 6).map(s => `${keyword} ${s}`)
            const out = []
            for (const v of variants) {
                try {
                    const r = await fetchAndEnrich(v)
                    if (r.enriched.length > 0) {
                        const avgSubs = r.enriched.reduce((a, b) => a + b.subs, 0) / r.enriched.length
                        const vol = estimateVolume(r.enriched.reduce((a, b) => a + b.views, 0) / r.enriched.length, r.sat, r.avgVel)
                        const diff = estimateDifficulty(r.sat, avgSubs)
                        out.push({ ...r, vol, diff, avgSubs })
                    }
                } catch (e) { }
            }
            setResults(out.sort((a, b) => b.opp - a.opp))
            toast('Research complete', 'ok')
        } catch (e) { toast(e.message, 'e') }
        finally { setBusy(false); setLoading(false) }
    }

    return (
        <div className="page fade-in">
            <div style={{ background: 'linear-gradient(135deg,rgba(0,229,204,.08),rgba(181,122,255,.05))', border: '1px solid rgba(0,229,204,.25)', borderRadius: 'var(--r3)', padding: 'var(--s6)', marginBottom: 'var(--s6)' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--s2)', background: 'rgba(0,229,204,.12)', border: '1px solid rgba(0,229,204,.25)', borderRadius: 100, padding: '4px 14px', fontFamily: 'var(--fm)', fontSize: 10, color: 'var(--accent)', marginBottom: 'var(--s3)', fontWeight: 700 }}>
                    <span style={{ width: 6, height: 6, background: 'var(--accent)', borderRadius: '50%', boxShadow: '0 0 6px var(--accent)', animation: 'blink 1.5s infinite' }} />
                    🔍 KEYWORD RESEARCH
                </div>
                <div style={{ fontFamily: 'var(--fd)', fontSize: 22, fontWeight: 800, marginBottom: 'var(--s2)' }}>Niche Discovery Engine</div>
                <div style={{ fontSize: 13, color: '#7aadc8', lineHeight: 1.6, maxWidth: 640 }}>Find high-traffic, low-competition keywords across any niche. Analyze search volume trends and advertiser interest (CPM).</div>
            </div>

            <div style={{ display: 'flex', gap: 'var(--s2)', maxWidth: 700, marginBottom: 'var(--s6)' }}>
                <input className="inp" value={keyword} onChange={e => setKeyword(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && research()}
                    placeholder="Seed keyword… AI tools, stoicism, dark history" />
                <button className="btn sim" onClick={research} disabled={busy}>{busy ? '⏳ Researching…' : '🔑 Research'}</button>
            </div>

            {!main && !busy && (
                <div className="empty"><div className="ei">🔑</div><h3>Keyword Research Ready</h3>
                    <p>Enter a seed keyword to get volume estimation, difficulty score, and related keyword tree.</p></div>
            )}

            {main && (
                <>
                    {/* Main keyword */}
                    <div className="card" style={{ marginBottom: 16 }}>
                        <div className="ch"><div className="ct">"{main.kw}" — Main Keyword</div></div>
                        <div style={{ padding: '14px 17px', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
                            {(() => {
                                const avgSubs = main.enriched.reduce((a, b) => a + b.subs, 0) / Math.max(main.enriched.length, 1)
                                const vol = estimateVolume(main.enriched.reduce((a, b) => a + b.views, 0) / Math.max(main.enriched.length, 1), main.sat, main.avgVel)
                                const diff = estimateDifficulty(main.sat, avgSubs)
                                const si = scoreInfo(main.opp)
                                return [
                                    { l: 'Search Volume', v: vol.label, color: vol.color, bar: vol.pct },
                                    { l: 'Difficulty', v: diff.label, color: diff.color, bar: diff.pct },
                                    { l: 'Opportunity', v: main.opp.toFixed(1) + '/10', color: si.color, bar: main.opp * 10 },
                                    { l: 'Saturation', v: main.sat + ' videos', color: 'var(--text)', bar: Math.min(100, main.sat * 2) },
                                ].map(({ l, v, color, bar }) => (
                                    <div key={l}>
                                        <div style={{ fontFamily: 'var(--fm)', fontSize: 9, textTransform: 'uppercase', letterSpacing: 1.5, color: 'var(--muted)', marginBottom: 5 }}>{l}</div>
                                        <div style={{ fontFamily: 'var(--fm)', fontSize: 18, fontWeight: 700, color, marginBottom: 5 }}>{v}</div>
                                        <div style={{ height: 4, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
                                            <div style={{ height: '100%', width: `${bar}%`, background: color, transition: 'width 1s' }} />
                                        </div>
                                    </div>
                                ))
                            })()}
                        </div>
                    </div>

                    {/* Related keywords table */}
                    {results.length > 0 && (
                        <div className="card">
                            <div className="ch"><div className="ct">Related Keyword Tree</div><div className="cm">{results.length} variants</div></div>
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr>
                                            {['Keyword', 'Volume', 'Difficulty', 'Videos/30d', 'Avg Views', 'Opportunity'].map(h => (
                                                <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontFamily: 'var(--fm)', fontSize: 8, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--muted)', borderBottom: '1px solid var(--border)', background: 'var(--elevated)', whiteSpace: 'nowrap' }}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {results.map(r => {
                                            const avgV = r.enriched.reduce((a, b) => a + b.views, 0) / Math.max(r.enriched.length, 1)
                                            const si = scoreInfo(r.opp)
                                            return (
                                                <tr key={r.kw} onClick={() => navigate('/explorer', { state: { keyword: r.kw } })}
                                                    style={{ borderBottom: '1px solid var(--border)', cursor: 'pointer' }}
                                                    onMouseEnter={e => e.currentTarget.style.background = 'var(--elevated)'}
                                                    onMouseLeave={e => e.currentTarget.style.background = ''}>
                                                    <td style={{ padding: '9px 12px', fontWeight: 500, fontSize: 12 }}>{r.kw}</td>
                                                    <td style={{ padding: '9px 12px' }}><span style={{ fontFamily: 'var(--fm)', fontSize: 11, color: r.vol.color, fontWeight: 700 }}>{r.vol.label}</span></td>
                                                    <td style={{ padding: '9px 12px' }}><span style={{ fontFamily: 'var(--fm)', fontSize: 11, color: r.diff.color, fontWeight: 700 }}>{r.diff.label}</span></td>
                                                    <td className="tm">{r.sat}</td>
                                                    <td className="tm">{fmt(avgV)}</td>
                                                    <td><span className={`sbdg`} style={{ background: 'var(--elevated)', color: si.color, fontFamily: 'var(--fm)', fontWeight: 700, fontSize: 11, padding: '2px 7px', borderRadius: 4 }}>{r.opp.toFixed(1)}</span></td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}