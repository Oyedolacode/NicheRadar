import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useYouTube } from '../hooks/useYouTube'
import { useAppStore } from '../store/useAppStore'
import { scoreInfo, fmt, fmtP } from '../lib/formulas'

export default function BatchPipeline() {
    const { fetchAndEnrich } = useYouTube()
    const { toast, setLoading } = useAppStore()
    const location = useLocation()
    const navigate = useNavigate()

    const [input, setInput] = useState('')
    const [jobs, setJobs] = useState([])
    const [busy, setBusy] = useState(false)
    const [stats, setStats] = useState({ done: 0, total: 0 })

    useEffect(() => {
        if (location.state?.seeds) {
            setInput(location.state.seeds.join(', '))
        }
    }, [location.state])

    async function run() {
        const topics = input.split(',').map(s => s.trim()).filter(Boolean)
        if (!topics.length) { toast('Enter topics', 'e'); return }
        
        setBusy(true)
        setLoading(true)
        setStats({ done: 0, total: topics.length })
        
        const newJobs = topics.map(t => ({ topic: t, status: 'pending', result: null }))
        setJobs(newJobs)

        for (let i = 0; i < topics.length; i++) {
            setJobs(prev => prev.map((j, idx) => idx === i ? { ...j, status: 'loading' } : j))
            try {
                const res = await fetchAndEnrich(topics[i])
                setJobs(prev => prev.map((j, idx) => idx === i ? { ...j, status: 'done', result: res } : j))
            } catch (e) {
                setJobs(prev => prev.map((j, idx) => idx === i ? { ...j, status: 'error' } : j))
            }
            setStats(prev => ({ ...prev, done: i + 1 }))
        }
        
        setBusy(false)
        setLoading(false)
        toast('Batch analysis complete!', 'ok')
    }

    return (
        <div className="page fade-in">
            <div style={{ background: 'linear-gradient(135deg,rgba(0,229,204,.08),rgba(181,122,255,.05))', border: '1px solid rgba(0,229,204,.25)', borderRadius: 'var(--r3)', padding: 'var(--s6)', marginBottom: 'var(--s6)' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--s2)', background: 'rgba(0,229,204,.12)', border: '1px solid rgba(0,229,204,.25)', borderRadius: 100, padding: '4px 14px', fontFamily: 'var(--fm)', fontSize: 10, color: 'var(--accent)', marginBottom: 'var(--s3)', fontWeight: 700 }}>
                    <span style={{ width: 6, height: 6, background: 'var(--accent)', borderRadius: '50%', boxShadow: '0 0 6px var(--accent)', animation: 'blink 1.5s infinite' }} />
                    ⚙️ BATCH PIPELINE
                </div>
                <div style={{ fontFamily: 'var(--fd)', fontSize: 22, fontWeight: 800, marginBottom: 'var(--s2)' }}>Bulk Niche Analysis</div>
                <div style={{ fontSize: 13, color: '#7aadc8', lineHeight: 1.6, maxWidth: 600 }}>Analyze multiple keywords simultaneously. Get comparative scores, viral gaps, and cross-niche intelligence in seconds.</div>
            </div>

            <div style={{ display: 'flex', gap: 8, marginBottom: 'var(--s4)', flexWrap: 'wrap' }}>
                <input className="inp" value={input} onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && !busy && run()} style={{ maxWidth: 600 }}
                    placeholder="Enter keywords separated by commas…" />
                <button className="btn" onClick={run} disabled={busy}>{busy ? '⏳ Processing…' : '🏁 Start Batch'}</button>
                {busy && <div style={{ alignSelf: 'center', fontFamily: 'var(--fm)', fontSize: 11, color: 'var(--accent)' }}>{stats.done} / {stats.total} Complete</div>}
            </div>

            {jobs.length === 0 && !busy && (
                <div className="empty">
                    <div className="ei">⚙️</div>
                    <h3>Batch Ready</h3>
                    <p>Enter multiple keywords to analyze them in parallel. Perfect for vetting niche lists.</p>
                </div>
            )}

            {jobs.length > 0 && (
                <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    <div className="ch">
                        <div className="ct">Queue Monitor</div>
                        <div className="cm">{stats.done} of {stats.total} processed</div>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: 'var(--elevated)', borderBottom: '1px solid var(--border)' }}>
                                    <th style={{ padding: '12px 18px', textAlign: 'left', fontFamily: 'var(--fm)', fontSize: 9, color: 'var(--muted)', textTransform: 'uppercase' }}>Topic</th>
                                    <th style={{ padding: '12px 18px', textAlign: 'left', fontFamily: 'var(--fm)', fontSize: 9, color: 'var(--muted)', textTransform: 'uppercase' }}>Status</th>
                                    <th style={{ padding: '12px 18px', textAlign: 'left', fontFamily: 'var(--fm)', fontSize: 9, color: 'var(--muted)', textTransform: 'uppercase' }}>Score</th>
                                    <th style={{ padding: '12px 18px', textAlign: 'left', fontFamily: 'var(--fm)', fontSize: 9, color: 'var(--muted)', textTransform: 'uppercase' }}>Viral Gap</th>
                                    <th style={{ padding: '12px 18px', textAlign: 'left', fontFamily: 'var(--fm)', fontSize: 9, color: 'var(--muted)', textTransform: 'uppercase' }}>Potential</th>
                                    <th style={{ padding: '12px 18px', textAlign: 'right', fontFamily: 'var(--fm)', fontSize: 9, color: 'var(--muted)', textTransform: 'uppercase' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {jobs.map((job, idx) => {
                                    const res = job.result
                                    const si = res ? scoreInfo(res.opp) : null
                                    
                                    return (
                                        <tr key={idx} style={{ borderBottom: '1px solid var(--border)', background: job.status === 'loading' ? 'rgba(0,229,204,.03)' : 'transparent' }}>
                                            <td style={{ padding: '14px 18px', fontSize: 13, fontWeight: 700 }}>{job.topic}</td>
                                            <td style={{ padding: '14px 18px' }}>
                                                {job.status === 'pending' && <span style={{ color: 'var(--dim)', fontSize: 11 }}>⏳ Pending</span>}
                                                {job.status === 'loading' && <span style={{ color: 'var(--accent)', fontSize: 11, fontWeight: 700 }}>⚡ Analyzing…</span>}
                                                {job.status === 'done' && <span style={{ color: 'var(--green)', fontSize: 11 }}>✅ Done</span>}
                                                {job.status === 'error' && <span style={{ color: 'var(--red)', fontSize: 11 }}>❌ Error</span>}
                                            </td>
                                            <td style={{ padding: '14px 18px', fontFamily: 'var(--fm)', fontWeight: 700, color: si?.color }}>{res ? res.opp.toFixed(1) : '—'}</td>
                                            <td style={{ padding: '14px 18px', fontFamily: 'var(--fm)', color: 'var(--green)' }}>{res ? res.vg.toFixed(2) : '—'}</td>
                                            <td style={{ padding: '14px 18px' }}>
                                                {si && <span className={`pill ${si.cls}`} style={{ fontSize: 9 }}>{si.label}</span>}
                                            </td>
                                            <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                                                {res && (
                                                    <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                                                        <button className="btn s" style={{ fontSize: 9, padding: '4px 8px' }} onClick={() => navigate('/explorer', { state: { result: res } })}>View</button>
                                                        <button className="btn fac" style={{ fontSize: 9, padding: '4px 8px' }} onClick={() => navigate('/factory', { state: { topic: res.kw } })}>Factory</button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    )
}