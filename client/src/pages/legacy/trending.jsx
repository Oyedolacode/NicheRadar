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
        <div className="page fade-in">
            <p style={{ fontSize: 13, color: '#7aadc8', marginBottom: 'var(--s4)', maxWidth: 560, lineHeight: 1.6 }}>
                Click any niche for a full analysis and historical signals breakdown.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 'var(--s4)' }}>
                {TRENDING.map((n, i) => (
                    <div key={n.kw} onClick={() => navigate('/explorer', { state: { keyword: n.kw } })}
                        className="card hoverable"
                        style={{ padding: 'var(--s4)', cursor: 'pointer', borderRadius: 'var(--r2)' }}>
                        <div style={{ fontFamily: 'var(--fm)', fontSize: 9, color: 'var(--muted)', marginBottom: 'var(--s1)' }}>— {String(i + 1).padStart(2, '0')}</div>
                        <div style={{ fontFamily: 'var(--fd)', fontSize: 16, fontWeight: 800, marginBottom: 'var(--s3)', color: 'var(--text)' }}>{n.kw}</div>
                        <div className="h-stack" style={{ gap: 'var(--s1)', flexWrap: 'wrap' }}>
                            {n.tags.map(t => (
                                <span key={t} className="chip">{t}</span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}