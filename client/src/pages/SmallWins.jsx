import React, { useState } from 'react'
import { useYouTube } from '../hooks/useYouTube'
import { useAppStore } from '../store/useAppStore'
import { fmt, fmtP } from '../lib/formulas'

export default function SmallWins() {
    const { fetchAndEnrich } = useYouTube()
    const { toast, setLoading } = useAppStore()
    const [keyword, setKeyword] = useState('')
    const [wins, setWins] = useState([])
    const [busy, setBusy] = useState(false)

    async function find() {
        if (!keyword.trim()) { toast('Enter a topic', 'e'); return }
        setBusy(true); setLoading(true); setWins([])
        try {
            const r = await fetchAndEnrich(keyword)
            const ws = r.enriched.filter(v => v.subs < 50000 && v.views > 20000).sort((a, b) => b.cs - a.cs)
            if (!ws.length) { toast('No small wins found — try a broader topic', 'w'); return }
            setWins(ws.slice(0, 12))
            toast(ws.length + ' wins found', 'ok')
        } catch (e) { toast(e.message, 'e') }
        finally { setBusy(false); setLoading(false) }
    }

    return (
        <div style={{ padding: 22 }}>
            <p style={{ fontSize: 12.5, color: '#7aadc8', marginBottom: 13, maxWidth: 560, lineHeight: 1.6 }}>
                Channels with <strong style={{ color: 'var(--hot)' }}>&lt;50k subs</strong> getting disproportionate views — sorted by Views÷Subs ratio.
            </p>
            <div style={{ display: 'flex', gap: 7, maxWidth: 560, marginBottom: 20 }}>
                <input className="inp" value={keyword} onChange={e => setKeyword(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && find()} placeholder="Topic… stoicism, dark history, AI tools" />
                <button className="btn" onClick={find} disabled={busy}>{busy ? '⏳' : '🏆'} Find Wins</button>
            </div>

            {wins.length === 0 && !busy && (
                <div className="empty"><div className="ei">🏆</div><h3>Find Algorithm Signals</h3>
                    <p>Discover small creators beating the algorithm.</p></div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 11 }}>
                {wins.map(w => (
                    <div key={w.id} onClick={() => window.open(w.url, '_blank')}
                        className="wc" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--rl)', padding: 15, cursor: 'pointer', transition: 'all .2s' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--hot)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = '' }}>
                        <div style={{ display: 'flex', gap: 9, marginBottom: 11 }}>
                            <div style={{ width: 72, height: 46, background: 'var(--elevated)', borderRadius: 5, overflow: 'hidden', flexShrink: 0, display: 'grid', placeItems: 'center', fontSize: 17 }}>
                                {w.thumb ? <img src={w.thumb} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '🎬'}
                            </div>
                            <div>
                                <div style={{ fontWeight: 600, fontSize: 12, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.4 }}>{w.title}</div>
                                <div style={{ fontFamily: 'var(--fm)', fontSize: 9, color: 'var(--muted)', marginTop: 2 }}>{w.chan}</div>
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 7 }}>
                            {[['Views', fmt(w.views), 'var(--hot)'], ['Subs', fmt(w.subs), 'var(--text)'], ['V/S', w.cs.toFixed(1) + '×', 'var(--accent)']].map(([l, v, c]) => (
                                <div key={l} style={{ textAlign: 'center', background: 'var(--elevated)', borderRadius: 5, padding: '6px 4px' }}>
                                    <div style={{ fontFamily: 'var(--fm)', fontSize: 13, fontWeight: 700, color: c }}>{v}</div>
                                    <div style={{ fontSize: 8.5, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: .3, marginTop: 1 }}>{l}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}