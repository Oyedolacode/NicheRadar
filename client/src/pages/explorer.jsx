import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useYouTube } from '../hooks/useYouTube'
import { useAppStore } from '../store/useAppStore'
import { useBookmarkStore } from '../store/useBookmarkStore'
import { scoreInfo, oppScore, fmt, fmtP, bdg } from '../lib/formulas'

const QUICK = ['dark history facts', 'AI tools for students', 'psychology facts', 'stoicism explained', 'weird science facts', 'minecraft documentaries', 'roman empire history']

const EXP = {
    history: ['history shorts', 'weird history facts', 'dark history stories', 'roman empire history', 'ancient civilizations explained', 'forgotten history facts', 'medieval history facts'],
    ai: ['AI tools for students', 'AI productivity hacks', 'ChatGPT tips tricks', 'AI automation 2024', 'AI side hustles', 'best AI apps free', 'AI business ideas'],
    minecraft: ['minecraft documentaries', 'minecraft lore explained', 'minecraft history', 'minecraft secrets', 'minecraft world records'],
    psychology: ['psychology facts mind-blowing', 'dark psychology tactics', 'human behavior explained', 'manipulation tactics psychology'],
    stoicism: ['stoicism explained simply', 'stoic daily habits', 'marcus aurelius life lessons', 'stoicism for beginners'],
    science: ['weird science facts', 'science experiments gone wrong', 'quantum physics explained', 'space facts mind-blowing'],
    finance: ['personal finance basics', 'investing for beginners', 'passive income ideas', 'money habits rich people'],
    coding: ['coding projects beginners', 'algorithms explained visually', 'web development roadmap'],
}
function expandKw(kw) {
    const b = kw.toLowerCase()
    for (const [k, v] of Object.entries(EXP)) if (b.includes(k)) return [...new Set([kw, ...v])].slice(0, 14)
    return [...new Set([kw, kw + ' shorts', kw + ' explained', kw + ' for beginners', kw + ' facts', 'best ' + kw, kw + ' documentary'])].slice(0, 10)
}

export default function Explorer() {
    const { fetchAndEnrich } = useYouTube()
    const { toast, setLastExplorerResult, setLoading } = useAppStore()
    const { saveNiche, isNicheSaved } = useBookmarkStore()
    const navigate = useNavigate()

    const [keyword, setKeyword] = useState('')
    const [result, setResult] = useState(null)
    const [busy, setBusy] = useState(false)
    const [filter, setFilter] = useState('all')
    const [sort, setSort] = useState({ col: 7, desc: true })
    const [expanded, setExpanded] = useState(false)
    const [expandList, setExpandList] = useState([])
    const [selectedKws, setSelected] = useState(new Set())
    const [relatedChips, setRelated] = useState([])
    const dialRef = useRef(null)

    async function run(kw) {
        kw = kw || keyword.trim()
        if (!kw) { toast('Enter a keyword', 'e'); return }
        setKeyword(kw); setBusy(true); setLoading(true); setResult(null)
        try {
            const r = await fetchAndEnrich(kw)
            if (!r.enriched.length) { toast('No videos found', 'w'); return }
            setResult(r); setLastExplorerResult(r)
            setRelated(expandKw(kw).slice(1, 8))
            toast('Analysis complete — ' + r.enriched.length + ' videos', 'ok')
        } catch (e) { toast(e.message, 'e') }
        finally { setBusy(false); setLoading(false) }
    }

    function showExpand() {
        if (!keyword.trim()) { toast('Enter a keyword first', 'e'); return }
        const list = expandKw(keyword)
        setExpandList(list); setSelected(new Set(list)); setExpanded(true)
    }

    function toggleKw(kw) {
        setSelected(prev => { const n = new Set(prev); n.has(kw) ? n.delete(kw) : n.add(kw); return n })
    }

    useEffect(() => {
        if (!result || !dialRef.current) return
        const si = scoreInfo(result.opp)
        setTimeout(() => {
            dialRef.current.style.strokeDashoffset = String(251 - (result.opp / 10) * 251)
            dialRef.current.style.stroke = si.color
        }, 80)
    }, [result])

    const rows = (() => {
        if (!result) return []
        let r = [...result.enriched]
        if (filter === 'massive') r = r.filter(v => oppScore(v.vel, v.eng, result.trend, result.sat) >= 8)
        else if (filter === 'strong') r = r.filter(v => oppScore(v.vel, v.eng, result.trend, result.sat) >= 6)
        else if (filter === 'small') r = r.filter(v => v.subs < 50000)
        const get = [v => v.title, v => v.views, v => v.subs, v => v.vel, v => v.eng, v => v.cs, v => v.cp, v => oppScore(v.vel, v.eng, result.trend, result.sat)]
        r.sort((a, b) => { const va = get[sort.col](a), vb = get[sort.col](b); return sort.desc ? (vb > va ? 1 : -1) : (va > vb ? 1 : -1) })
        return r
    })()

    const si = result ? scoreInfo(result.opp) : null

    return (
        <div style={{ padding: 22 }}>
            <div style={{ marginBottom: 6 }}>
                <div className="slbl">Keyword</div>
                <div style={{ display: 'flex', gap: 7, maxWidth: 740 }}>
                    <input className="inp" value={keyword} onChange={e => setKeyword(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && run()} placeholder="dark history, AI tools, psychology facts…" />
                    <button className="btn" onClick={() => run()} disabled={busy}>{busy ? '⏳' : '⚡'} Analyze</button>
                    <button className="btn s" onClick={showExpand}>🔀 Expand</button>
                </div>
            </div>

            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center', marginBottom: 20 }}>
                <span style={{ fontFamily: 'var(--fm)', fontSize: 10, color: 'var(--muted)' }}>{result ? 'Related:' : 'Quick:'}</span>
                {(result ? relatedChips : QUICK).map(kw => (
                    <button key={kw} className="chip" onClick={() => run(kw)}>{kw}</button>
                ))}
            </div>

            {expanded && (
                <div className="card" style={{ marginBottom: 18 }}>
                    <div className="ch"><div className="ct">Keyword Expansion</div><div className="cm">{expandList.length} variants</div></div>
                    <div style={{ padding: 13 }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(185px,1fr))', gap: 6, marginBottom: 13 }}>
                            {expandList.map(kw => (
                                <div key={kw} onClick={() => toggleKw(kw)} className={`kwc${selectedKws.has(kw) ? ' sel' : ''}`}>
                                    <span style={{ fontSize: 11.5, fontWeight: 500 }}>{kw}</span>
                                    <span style={{ fontSize: 10, color: 'var(--muted)' }}>{selectedKws.has(kw) ? '✓' : '+'}</span>
                                </div>
                            ))}
                        </div>
                        <div style={{ display: 'flex', gap: 7 }}>
                            <button className="btn s" style={{ fontSize: '10.5px', padding: '6px 11px' }} onClick={() => setSelected(new Set(expandList))}>Select All</button>
                            <button className="btn s" style={{ fontSize: '10.5px', padding: '6px 11px' }} onClick={() => setSelected(new Set())}>Deselect</button>
                            <button className="btn" style={{ fontSize: '10.5px', padding: '6px 13px' }}
                                onClick={() => navigate('/batch', { state: { seeds: [...selectedKws] } })}>⚙️ Batch Analyze</button>
                        </div>
                    </div>
                </div>
            )}

            {!result && !busy && (
                <div className="empty"><div className="ei">📡</div><h3>Ready to Hunt Niches</h3>
                    <p>Enter a keyword to fetch live YouTube data and score opportunity.</p></div>
            )}

            {result && (
                <>
                    <div className="mg">
                        {[
                            { label: 'Opportunity Score', value: result.opp.toFixed(1), sub: 'v2 formula', cls: 'ca' },
                            { label: 'View Velocity', value: fmt(result.avgVel) + '/hr', sub: 'views / hour', cls: '' },
                            { label: 'Engagement Rate', value: fmtP(result.avgEng), sub: '(likes+cmts)/views', cls: 'cy' },
                            { label: 'Content Saturation', value: String(result.sat), sub: 'videos · 30d', cls: 'chot' },
                            { label: 'Viral Gap Score', value: result.vg.toFixed(2), sub: 'demand ÷ supply', cls: 'cg' },
                        ].map((m, i) => (
                            <div key={i} className="mc lit">
                                <div className="ml">{m.label}</div>
                                <div className={`mv ${m.cls}`}>{m.value}</div>
                                <div className="ms">{m.sub}</div>
                            </div>
                        ))}
                    </div>

                    <div className="hero">
                        <div className="dial">
                            <svg width="96" height="96" viewBox="0 0 96 96" style={{ transform: 'rotate(-90deg)' }}>
                                <circle cx="48" cy="48" r="40" fill="none" stroke="var(--border)" strokeWidth="7.5" />
                                <circle ref={dialRef} cx="48" cy="48" r="40" fill="none" stroke="var(--accent)"
                                    strokeWidth="7.5" strokeDasharray="251" strokeDashoffset="251" strokeLinecap="round"
                                    style={{ transition: 'stroke-dashoffset 1.1s cubic-bezier(.4,0,.2,1),stroke .4s' }} />
                            </svg>
                            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                <div className="dn" style={{ color: si.color }}>{result.opp.toFixed(1)}</div>
                                <div className="ds">Score</div>
                            </div>
                        </div>
                        <div style={{ flex: 1 }}>
                            <div className="ht">"{result.kw}" — {si.label} OPPORTUNITY</div>
                            <div className="hd">{si.desc}</div>
                            <div className="sbars">
                                {[{ l: 'Trend', v: result.trend / 10 }, { l: 'Viral Gap', v: result.vg / 10 }, { l: 'Low Sat.', v: Math.max(0, 1 - result.sat / 50) }, { l: 'Eng.', v: Math.min(1, result.avgEng * 20) }].map(s => (
                                    <div key={s.l} className="sb">
                                        <span>{s.l}</span>
                                        <div className="sbt"><div className="sbf" style={{ width: `${s.v * 100}%` }} /></div>
                                        <span>{(s.v * 10).toFixed(1)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginLeft: 'auto', flexShrink: 0 }}>
                            <button className="btn ai" style={{ fontSize: '10.5px', padding: '6px 11px' }}
                                onClick={() => navigate('/viral-predictor', { state: { results: [result] } })}>🤖 AI Predict</button>
                            <button className="btn sim" style={{ fontSize: '10.5px', padding: '6px 11px' }}
                                onClick={() => navigate('/simulator', { state: { topic: result.kw } })}>🎮 Simulate</button>
                            <button className="btn fac" style={{ fontSize: '10.5px', padding: '6px 11px' }}
                                onClick={() => navigate('/factory', { state: { topic: result.kw } })}>🏭 Factory</button>
                            <button className="btn s" style={{ fontSize: '10.5px', padding: '6px 11px' }}
                                onClick={() => navigate('/do-this-next', { state: { result } })}>🚀 Do This Next</button>
                            <button className="btn s" style={{ fontSize: '10.5px', padding: '6px 11px', borderColor: isNicheSaved(result.kw) ? 'var(--accent)' : undefined }}
                                onClick={() => {
                                    if (isNicheSaved(result.kw)) { toast('Already saved', 'w'); return }
                                    saveNiche({ kw: result.kw, opp: result.opp, vg: result.vg, trend: result.trend })
                                    toast('Saved to bookmarks', 'ok')
                                }}>{isNicheSaved(result.kw) ? '🔖 Saved' : '🔖 Save'}</button>
                        </div>
                    </div>

                    <div className="card">
                        <div className="ch">
                            <div className="ct">Video Intelligence Feed</div>
                            <div style={{ display: 'flex', gap: 7, alignItems: 'center' }}>
                                <div className="cm">{rows.length} videos</div>
                                <select className="inp" value={filter} onChange={e => setFilter(e.target.value)}
                                    style={{ padding: '3px 7px', fontSize: '9.5px', maxWidth: 130 }}>
                                    <option value="all">All</option>
                                    <option value="massive">Massive only</option>
                                    <option value="strong">Strong+</option>
                                    <option value="small">Small channels</option>
                                </select>
                            </div>
                        </div>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr>
                                        {['Video', 'Views', 'Subs', 'Velocity', 'Eng. Rate', 'Creator Success', 'Chan. Power', 'Score', 'Signal'].map((h, i) => (
                                            <th key={h} onClick={() => setSort(s => ({ col: i, desc: s.col === i ? !s.desc : true }))}
                                                style={{ padding: '8px 12px', textAlign: 'left', fontFamily: 'var(--fm)', fontSize: 8, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--muted)', borderBottom: '1px solid var(--border)', background: 'var(--elevated)', whiteSpace: 'nowrap', cursor: 'pointer' }}>
                                                {h}{sort.col === i ? (sort.desc ? ' ↓' : ' ↑') : ''}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {rows.map(v => {
                                        const vs = oppScore(v.vel, v.eng, result.trend, result.sat)
                                        const si2 = scoreInfo(vs)
                                        const ago = Math.floor((Date.now() - new Date(v.pub)) / 86_400_000)
                                        return (
                                            <tr key={v.id} onClick={() => window.open(v.url, '_blank')}
                                                style={{ borderBottom: '1px solid var(--border)', cursor: 'pointer' }}
                                                onMouseEnter={e => e.currentTarget.style.background = 'var(--elevated)'}
                                                onMouseLeave={e => e.currentTarget.style.background = ''}>
                                                <td style={{ padding: '9px 12px' }}>
                                                    <span style={{ maxWidth: 230, fontWeight: 500, fontSize: 12, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>{v.title}</span>
                                                    <span style={{ fontSize: 9.5, color: 'var(--muted)', fontFamily: 'var(--fm)' }}>{v.chan} · {ago}d ago</span>
                                                </td>
                                                <td className="tm">{fmt(v.views)}</td>
                                                <td className="tm">{fmt(v.subs)}</td>
                                                <td className="tm">{fmt(v.vel)}/hr</td>
                                                <td className="tm">{fmtP(v.eng)}</td>
                                                <td className="tm">{v.cs.toFixed(2)}×</td>
                                                <td className="tm">{v.cp < .1 ? '🔥 Low' : v.cp < 1 ? '✅ Med' : '⚪ High'}</td>
                                                <td><span className={`sbdg ${bdg(vs)}`}>{vs.toFixed(1)}</span></td>
                                                <td><span className={`pill ${si2.cls}`}>{si2.label}</span></td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}