import React, { useState } from 'react'
import { useYouTube } from '../hooks/useYouTube'
import { useAppStore } from '../store/useAppStore'

const FMTS = [
    { l: 'Shorts', sf: 'shorts', i: '📱' }, { l: 'Documentary', sf: 'documentary', i: '🎥' },
    { l: 'Animation', sf: 'animated', i: '✏️' }, { l: 'Explained', sf: 'explained', i: '📖' },
    { l: 'Compilation', sf: 'compilation', i: '📋' }, { l: 'Story', sf: 'story', i: '📜' },
    { l: 'Tips', sf: 'tips', i: '💡' }, { l: 'Beginners', sf: 'for beginners', i: '🎓' },
]

export default function ContentGapEngine() {
    const { fetchAndEnrich } = useYouTube()
    const { toast, setLoading } = useAppStore()
    const [keyword, setKeyword] = useState('')
    const [results, setResults] = useState([])
    const [busy, setBusy] = useState(false)

    async function detect() {
        if (!keyword.trim()) { toast('Enter a topic', 'e'); return }
        setBusy(true); setLoading(true); setResults([])
        try {
            const out = await Promise.all(FMTS.map(async f => {
                try {
                    const r = await fetchAndEnrich(`${keyword} ${f.sf}`)
                    return { ...f, count: r.enriched.length }
                } catch { return { ...f, count: 0 } }
            }))
            setResults(out)
            const gaps = out.filter(r => r.count <= 3)
            toast(gaps.length + ' gaps found!', gaps.length ? 'ok' : 'w')
        } catch (e) { toast(e.message, 'e') }
        finally { setBusy(false); setLoading(false) }
    }

    const maxCount = results.length ? Math.max(...results.map(r => r.count), 1) : 1
    const foundGaps = results.filter(r => r.count <= 3)

    return (
        <div style={{ padding: 22 }}>
            <p style={{ fontSize: 13, color: '#7aadc8', marginBottom: 16, maxWidth: 560, lineHeight: 1.6 }}>
                Find which <strong style={{ color: 'var(--accent)' }}>content formats</strong> are missing — Shorts, Animation, Documentary, Explainers, etc.
            </p>
            <div style={{ display: 'flex', gap: 7, maxWidth: 560, marginBottom: 24 }}>
                <input className="inp" value={keyword} onChange={e => setKeyword(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && detect()} placeholder="Topic… roman empire, stoicism, machine learning" />
                <button className="btn" onClick={detect} disabled={busy}>{busy ? '⏳' : '💡'} Detect Gaps</button>
            </div>

            {results.length === 0 && !busy && (
                <div className="empty">
                    <div className="ei">💡</div>
                    <h3>Format Gap Detector</h3>
                    <p>Enter a topic to find underserved content styles in that niche.</p>
                </div>
            )}

            {results.length > 0 && (
                <div className="fade-in">
                    <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ fontFamily: 'var(--fm)', fontSize: 11, color: 'var(--muted)', background: 'var(--elevated)', padding: '4px 10px', borderRadius: 4, border: '1px solid var(--border)' }}>
                            TARGET: <span style={{ color: 'var(--text)', fontWeight: 700 }}>{keyword.toUpperCase()}</span>
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--hot)', fontWeight: 700 }}>{foundGaps.length} Format Gaps Found</div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 12, marginBottom: 24 }}>
                        {results.map(r => {
                            const isGap = r.count <= 3
                            const pct = (r.count / maxCount) * 100
                            return (
                                <div key={r.l} className="card" style={{ padding: 16, borderRadius: 'var(--r2)', border: isGap ? '1px solid rgba(255,92,53,.4)' : '1px solid var(--border)', background: isGap ? 'rgba(255,92,53,.04)' : 'var(--surface)', position: 'relative' }}>
                                    {isGap && <div style={{ position: 'absolute', top: -10, right: 10, background: 'var(--hot)', color: '#000', fontSize: 8, fontWeight: 900, padding: '2px 6px', borderRadius: 4 }}>GAP</div>}
                                    <div style={{ fontSize: 24, marginBottom: 8 }}>{r.i}</div>
                                    <div style={{ fontFamily: 'var(--fd)', fontWeight: 800, fontSize: 13, marginBottom: 4 }}>{r.l}</div>
                                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 4 }}>
                                        <div style={{ fontFamily: 'var(--fm)', fontSize: 22, fontWeight: 800, color: isGap ? 'var(--hot)' : 'var(--text)' }}>{r.count}</div>
                                        <div style={{ fontSize: 10, color: 'var(--muted)' }}>competitors</div>
                                    </div>
                                    <div style={{ height: 4, background: 'var(--elevated)', borderRadius: 2, overflow: 'hidden' }}>
                                        <div style={{ height: '100%', width: `${Math.max(pct, 5)}%`, background: isGap ? 'var(--hot)' : 'var(--accent)', transition: 'width 1s ease-out' }} />
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {foundGaps.length > 0 && (
                        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                            <div className="ch" style={{ background: 'rgba(255,92,53,.1)' }}>
                                <div className="ct" style={{ color: 'var(--hot)' }}>Execution Strategy</div>
                            </div>
                            <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                                {foundGaps.map(g => (
                                    <div key={g.l} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, background: 'var(--elevated)', borderRadius: 'var(--r1)', borderLeft: '3px solid var(--hot)' }}>
                                        <span style={{ fontSize: 20 }}>{g.i}</span>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: 700, fontSize: 14 }}>Create "{keyword}" as {g.l}</div>
                                            <div style={{ fontSize: 11, color: 'var(--muted)' }}>High probability of ranking with only {g.count} established competitors.</div>
                                        </div>
                                        <button className="btn s" onClick={() => toast(`Added to queue`, 'ok')}>START</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
