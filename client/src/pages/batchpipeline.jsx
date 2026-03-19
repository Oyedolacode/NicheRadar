import React, { useState } from 'react'
import { useYouTube } from '../hooks/useYouTube'
import { useAppStore } from '../store/useAppStore'
import { useNavigate, useLocation } from 'react-router-dom'
import { scoreInfo, compLevel, trendDir, fmt, fmtP, bdg, viralProbability } from '../lib/formulas'

const PRESET = 'dark history facts\nAI tools for students\npsychology facts\nstoicism explained\nroman empire history\nweird science facts\nminecraft documentaries\npersonal finance basics'

const STAGES = [
    { i: '🌱', n: 'Seeds', s: 'Awaiting' },
    { i: '🔀', n: 'Expand', s: '50+ kws' },
    { i: '🎯', n: 'Discover', s: 'IDs & meta' },
    { i: '📊', n: 'Stats', s: 'Batched API' },
    { i: '🧠', n: 'Score', s: 'Opp. calc' },
]

export default function BatchPipeline() {
    const { fetchAndEnrich } = useYouTube()
    const { toast, setLoading } = useAppStore()
    const navigate = useNavigate()
    const location = useLocation()

    const [seeds, setSeeds] = useState(location.state?.seeds?.join('\n') || '')
    const [stage, setStage] = useState(-1)
    const [jobs, setJobs] = useState([])
    const [results, setResults] = useState([])
    const [busy, setBusy] = useState(false)

    async function run() {
        const list = seeds.split(/[\n,]+/).map(s => s.trim()).filter(Boolean)
        if (!list.length) { toast('Enter seed keywords', 'e'); return }
        setBusy(true); setLoading(true); setResults([])
        setJobs(list.map(kw => ({ kw, status: 'queued', info: '' })))
        const out = []
        for (let i = 0; i < list.length; i++) {
            setStage(Math.min(4, Math.floor(i / list.length * 5)))
            setJobs(j => j.map((job, idx) => idx === i ? { ...job, status: 'running', info: 'Fetching…' } : job))
            try {
                const r = await fetchAndEnrich(list[i])
                out.push(r)
                setJobs(j => j.map((job, idx) => idx === i ? { ...job, status: 'done', info: r.enriched.length + ' vids · ' + r.opp.toFixed(1) } : job))
            } catch (e) {
                setJobs(j => j.map((job, idx) => idx === i ? { ...job, status: 'error', info: 'Error' } : job))
            }
        }
        setStage(4); setResults(out); setBusy(false); setLoading(false)
        toast('Pipeline complete — ' + out.length + ' niches', 'ok')
    }

    const sorted = [...results].sort((a, b) => b.opp - a.opp)

    return (
        <div style={{ padding: 22 }}>
            {/* Pipeline stages */}
            <div style={{ marginBottom: 14 }}>
                <div className="slbl">Pipeline Stages</div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    {STAGES.map((s, i) => (
                        <div key={i} style={{ flex: 1, position: 'relative' }}>
                            {i > 0 && <div style={{ position: 'absolute', left: -8, top: 18, color: 'var(--dim)', fontSize: 18, fontWeight: 700 }}>›</div>}
                            <div style={{ background: 'var(--surface)', border: `1px solid ${i <= stage ? 'var(--green)' : 'var(--border)'}`, borderRadius: 'var(--rl)', padding: '11px 13px', opacity: i <= stage ? 1 : .6 }}>
                                <div style={{ fontSize: 17, marginBottom: 3 }}>{s.i}</div>
                                <div style={{ fontFamily: 'var(--fd)', fontWeight: 700, fontSize: 11, marginBottom: 2 }}>{s.n}</div>
                                <div style={{ fontSize: 9.5, color: 'var(--muted)', fontFamily: 'var(--fm)', marginBottom: 4 }}>{s.s}</div>
                                <span style={{ display: 'inline-flex', padding: '1px 6px', borderRadius: 10, fontFamily: 'var(--fm)', fontSize: 8.5, fontWeight: 700, background: i < stage ? 'rgba(0,230,118,.1)' : i === stage && busy ? 'var(--adim)' : 'var(--elevated)', color: i < stage ? 'var(--green)' : i === stage && busy ? 'var(--accent)' : 'var(--dim)' }}>
                                    {i < stage ? 'DONE' : i === stage && busy ? 'RUNNING' : 'WAIT'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
                <div className="card">
                    <div className="ch"><div className="ct">Seed Keywords</div><div className="cm">One per line or comma-separated</div></div>
                    <div style={{ padding: 13 }}>
                        <textarea className="inp" value={seeds} onChange={e => setSeeds(e.target.value)}
                            rows={7} style={{ width: '100%', resize: 'vertical', fontFamily: 'var(--fm)', fontSize: 11.5 }}
                            placeholder="dark history&#10;AI tools for students&#10;psychology facts" />
                        <div style={{ marginTop: 7, display: 'flex', gap: 7 }}>
                            <button className="btn" onClick={run} disabled={busy}>{busy ? '⏳ Running…' : '⚙️ Run Pipeline'}</button>
                            <button className="btn s" onClick={() => setSeeds(PRESET)}>📋 Preset</button>
                        </div>
                    </div>
                </div>
                <div className="card">
                    <div className="ch"><div className="ct">Job Queue</div><div className="cm">{busy ? 'Running…' : jobs.length ? 'Complete' : 'Idle'}</div></div>
                    <div style={{ padding: 13, maxHeight: 270, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {jobs.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: 20, color: 'var(--muted)', fontSize: 11.5, fontFamily: 'var(--fm)' }}>No jobs queued</div>
                        ) : jobs.map((job, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: 'var(--elevated)', borderRadius: 'var(--r)', border: `1px solid ${job.status === 'running' ? 'var(--accent)' : job.status === 'error' ? 'var(--red)' : 'var(--border)'}`, fontSize: 12 }}>
                                <span style={{ fontSize: 12, flexShrink: 0, width: 16, textAlign: 'center' }}>
                                    {job.status === 'queued' ? '⏳' : job.status === 'running' ? '⟳' : job.status === 'done' ? '✓' : '✗'}
                                </span>
                                <span style={{ flex: 1, fontWeight: 500 }}>{job.kw}</span>
                                <span style={{ fontFamily: 'var(--fm)', fontSize: 9.5, color: 'var(--muted)' }}>{job.info}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {sorted.length > 0 && (
                <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                        <div className="slbl" style={{ margin: 0 }}>Results</div>
                        <button className="btn ai" style={{ fontSize: '10.5px', padding: '5px 11px', marginLeft: 'auto' }}
                            onClick={() => navigate('/viral-predictor', { state: { results } })}>🤖 AI Predict All</button>
                    </div>
                    <div className="card">
                        <div className="ch"><div className="ct">Niche Comparison Dashboard</div><div className="cm">{sorted.length} niches</div></div>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr>
                                        {['Niche', 'Trend', 'Competition', 'Avg Views', 'Velocity', 'Engagement', 'Saturation', 'Viral Gap', 'Opportunity ↓'].map(h => (
                                            <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontFamily: 'var(--fm)', fontSize: 8, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--muted)', borderBottom: '1px solid var(--border)', background: 'var(--elevated)', whiteSpace: 'nowrap' }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {sorted.map(r => {
                                        const si = scoreInfo(r.opp), td = trendDir(r.trend), cl = compLevel(r.sat)
                                        const avgV = r.enriched.reduce((a, b) => a + b.views, 0) / Math.max(r.enriched.length, 1)
                                        return (
                                            <tr key={r.kw} onClick={() => navigate('/explorer', { state: { keyword: r.kw } })}
                                                style={{ borderBottom: '1px solid var(--border)', cursor: 'pointer' }}
                                                onMouseEnter={e => e.currentTarget.style.background = 'var(--elevated)'}
                                                onMouseLeave={e => e.currentTarget.style.background = ''}>
                                                <td style={{ padding: '9px 12px', fontWeight: 600, fontSize: 12 }}>{r.kw}</td>
                                                <td style={{ padding: '9px 12px', fontFamily: 'var(--fm)', fontSize: 11, color: td.dir === 'up' ? 'var(--green)' : td.dir === 'dn' ? 'var(--red)' : 'var(--yellow)' }}>{td.label}</td>
                                                <td style={{ padding: '9px 12px' }}><span className={`pill ${cl.cls}`}>{cl.label}</span></td>
                                                <td className="tm">{fmt(avgV)}</td>
                                                <td className="tm">{fmt(r.avgVel)}/hr</td>
                                                <td className="tm">{fmtP(r.avgEng)}</td>
                                                <td className="tm">{r.sat}</td>
                                                <td className="tm">{r.vg.toFixed(2)}</td>
                                                <td><span className={`sbdg ${bdg(r.opp)}`}>{r.opp.toFixed(1)}</span> <span className={`pill ${si.cls}`}>{si.label}</span></td>
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