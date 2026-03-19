import React, { useState } from 'react'
import { useYouTube } from '../hooks/useYouTube'
import { useAppStore } from '../store/useAppStore'

const FMTS = [
    { l: 'Shorts', sf: 'shorts', i: '📱' }, { l: 'Documentary', sf: 'documentary', i: '🎥' },
    { l: 'Animation', sf: 'animated', i: '✏️' }, { l: 'Explained', sf: 'explained', i: '📖' },
    { l: 'Compilation', sf: 'compilation', i: '📋' }, { l: 'Story', sf: 'story', i: '📜' },
    { l: 'Tips', sf: 'tips', i: '💡' }, { l: 'Beginners', sf: 'for beginners', i: '🎓' },
]

export default function ContentGaps() {
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

    const max = results.length ? Math.max(...results.map(r => r.count), 1) : 1
    const found = results.filter(r => r.count <= 3)

    return (
        <div style={{ padding: 22 }}>
            <p style={{ fontSize: 12.5, color: '#7aadc8', marginBottom: 13, maxWidth: 560, lineHeight: 1.6 }}>
                Find which <strong style={{ color: 'var(--accent)' }}>content formats</strong> are missing — Shorts, Animation, Documentary, Explainers, etc.
            </p>
            <div style={{ display: 'flex', gap: 7, maxWidth: 560, marginBottom: 20 }}>
                <input className="inp" value={keyword} onChange={e => setKeyword(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && detect()} placeholder="Topic… roman empire, stoicism, machine learning" />
                <button className="btn" onClick={detect} disabled={busy}>{busy ? '⏳' : '💡'} Detect Gaps</button>
            </div>

            {results.length === 0 && !busy && (
                <div className="empty"><div className="ei">💡</div><h3>Detect Missing Formats</h3>
                    <p>Find which formats are missing — then fill them first.</p></div>
            )}

            {results.length > 0 && (
                <>
                    <div style={{ marginBottom: 12 }}>
                        <p style={{ fontSize: 11.5, color: 'var(--muted)', fontFamily: 'var(--fm)' }}>
                            "<strong style={{ color: 'var(--text)' }}>{keyword}</strong>" · <strong style={{ color: 'var(--hot)' }}>{found.length} gaps detected</strong>
                        </p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 9, marginBottom: 15 }}>
                        {results.map(r => {
                            const isGap = r.count <= 3
                            const pct = r.count / max * 100
                            return (
                                <div key={r.l} style={{ background: 'var(--surface)', border: `1px solid ${isGap ? 'var(--hot)' : 'var(--border)'}`, borderRadius: 'var(--rl)', padding: 14, boxShadow: isGap ? '0 0 10px var(--hdim)' : 'none' }}>
                                    <div style={{ fontSize: 20, marginBottom: 4 }}>{r.i}</div>
                                    <div style={{ fontFamily: 'var(--fd)', fontWeight: 700, fontSize: 12, marginBottom: 2 }}>{r.l}</div>
                                    <div style={{ fontFamily: 'var(--fm)', fontSize: 19, fontWeight: 700, color: isGap ? 'var(--hot)' : 'var(--text)', marginBottom: 2 }}>{r.count}</div>
                                    <div style={{ fontSize: 9.5, color: isGap ? 'var(--hot)' : 'var(--muted)', fontWeight: isGap ? 700 : 400 }}>{isGap ? '⚡ GAP' : 'Existing'}</div>
                                    <div style={{ marginTop: 6, height: 3, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
                                        <div style={{ height: '100%', width: `${pct}%`, background: isGap ? 'var(--hot)' : 'var(--accent)' }} />
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {found.length > 0 && (
                        <div className="card">
                            <div className="ch"><div className="ct">Recommended Ideas</div><div className="cm">{found.length} gaps</div></div>
                            <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
                                {found.map(g => (
                                    <div key={g.l} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: 10, background: 'var(--elevated)', borderRadius: 'var(--r)', borderLeft: '3px solid var(--hot)' }}>
                                        <span style={{ fontSize: 16 }}>{g.i}</span>
                                        <div>
                                            <div style={{ fontWeight: 600, fontSize: 13 }}>"{keyword}" as {g.l}</div>
                                            <div style={{ fontSize: 10.5, color: 'var(--muted)', marginTop: 1 }}>Only {g.count} competitor{g.count === 1 ? '' : 's'}</div>
                                        </div>
                                        <span className="pill massive" style={{ marginLeft: 'auto' }}>ENTER NOW</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}