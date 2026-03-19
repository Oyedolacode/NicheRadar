import React from 'react'
import { useNavigate } from 'react-router-dom'

const TRENDING = [
    { kw: 'AI tools for students', tags: ['Tech', 'Rising'] },
    { kw: 'history shorts', tags: ['History', 'Viral'] },
    { kw: 'psychology facts', tags: ['Mind', 'Evergreen'] },
    { kw: 'minecraft documentaries', tags: ['Gaming', 'Niche'] },
    { kw: 'stoicism explained', tags: ['Philosophy', 'Deep'] },
    { kw: 'ancient civilizations', tags: ['History', 'Epic'] },
    { kw: 'personal finance basics', tags: ['Finance', 'High CPM'] },
    { kw: 'dark history facts', tags: ['History', 'Edgy'] },
    { kw: 'weird science experiments', tags: ['Science', 'Shorts'] },
    { kw: 'coding projects beginners', tags: ['Tech', 'Demand'] },
    { kw: 'human psychology tricks', tags: ['Psychology', 'Viral'] },
    { kw: 'roman empire explained', tags: ['History', 'Classic'] },
    { kw: 'self improvement habits', tags: ['Lifestyle', 'Broad'] },
    { kw: 'AI side hustles 2024', tags: ['Finance', 'Hot'] },
    { kw: 'conspiracy theories explained', tags: ['Mystery', 'Edgy'] },
]

export default function Trending() {
    const navigate = useNavigate()
    return (
        <div style={{ padding: 22 }}>
            <p style={{ fontSize: 12.5, color: '#7aadc8', marginBottom: 16 }}>Click any niche for a full analysis.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(210px,1fr))', gap: 11 }}>
                {TRENDING.map((n, i) => (
                    <div key={n.kw} onClick={() => navigate('/explorer', { state: { keyword: n.kw } })}
                        style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--rl)', padding: 15, cursor: 'pointer', transition: 'all .2s' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = '' }}>
                        <div style={{ fontFamily: 'var(--fm)', fontSize: 9, color: 'var(--dim)', marginBottom: 3 }}>— {String(i + 1).padStart(2, '0')}</div>
                        <div style={{ fontFamily: 'var(--fd)', fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{n.kw}</div>
                        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                            {n.tags.map(t => (
                                <span key={t} style={{ background: 'var(--elevated)', border: '1px solid var(--border)', borderRadius: 4, padding: '2px 7px', fontFamily: 'var(--fm)', fontSize: 9, color: 'var(--muted)' }}>{t}</span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}