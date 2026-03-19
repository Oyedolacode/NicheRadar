import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'
import { useBookmarkStore } from '../store/useBookmarkStore'

const NAV = [
    {
        label: 'Intelligence',
        items: [
            { to: '/explorer', icon: '🔍', label: 'Niche Explorer' },
            { to: '/simulator', icon: '🎮', label: 'Algorithm Simulator' },
            { to: '/topic-map', icon: '🗺️', label: 'Topic Map Engine' },
            { to: '/viral-predictor', icon: '🤖', label: 'Viral Predictor', badge: 'AI', badgeCls: 'ai' },
            { to: '/batch', icon: '⚙️', label: 'Batch Pipeline' },
            { to: '/viral-gaps', icon: '⚡', label: 'Viral Gaps', badge: 'HOT', badgeCls: 'hot' },
            { to: '/small-wins', icon: '🏆', label: 'Small Channel Wins' },
        ],
    },
    {
        label: 'Production',
        items: [
            { to: '/factory', icon: '🏭', label: 'Content Factory', badge: 'NEW', badgeCls: 'fac' },
            { to: '/queue', icon: '📋', label: 'Production Queue' },
            { to: '/scheduler', icon: '📅', label: 'Pub. Scheduler' },
        ],
    },
    {
        label: 'New Features',
        items: [
            { to: '/competitors', icon: '🎯', label: 'Competitor Studio', badge: 'NEW', badgeCls: 'fac' },
            { to: '/keywords', icon: '🔑', label: 'Keyword Research', badge: 'NEW', badgeCls: 'fac' },
            { to: '/bookmarks', icon: '🔖', label: 'Bookmarks', badge: 'NEW', badgeCls: 'fac' },
            { to: '/analyzer', icon: '🎬', label: 'Video Analyzer', badge: 'NEW', badgeCls: 'fac' },
            { to: '/do-this-next', icon: '🚀', label: 'Do This Next', badge: 'NEW', badgeCls: 'fac' },
        ],
    },
    {
        label: 'Discovery',
        items: [
            { to: '/trending', icon: '📈', label: 'Trending Feed' },
            { to: '/content-gaps', icon: '💡', label: 'Content Gaps' },
        ],
    },
    {
        label: 'System',
        items: [
            { to: '/cache', icon: '💾', label: 'Cache & Storage' },
        ],
    },
]

const BADGE_STYLES = {
    hot: { background: 'var(--hot)', color: '#fff' },
    ai: { background: 'var(--purple)', color: '#fff' },
    sim: { background: 'var(--blue)', color: '#fff' },
    fac: { background: 'var(--orange)', color: '#000' },
}

export default function Sidebar() {
    const { quotaUsed, apiStatus } = useAppStore()
    const { getTotalCount } = useBookmarkStore()
    const totalBookmarks = typeof getTotalCount === 'function' ? getTotalCount() : 0

    return (
        <aside style={{
            width: 'var(--sidebar-w)',
            background: 'var(--surface)',
            borderRight: '1px solid var(--border)',
            display: 'flex',
            flexDirection: 'column',
            position: 'fixed',
            inset: '0 auto 0 0',
            zIndex: 100,
            overflowY: 'auto',
        }}>
            {/* Logo */}
            <div style={{ padding: 'var(--s5) var(--s4) var(--s4)', borderBottom: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--s3)' }}>
                    <div style={{ width: 38, height: 38, background: 'linear-gradient(135deg,var(--accent),#00e5cc)', borderRadius: 'var(--r2)', display: 'grid', placeItems: 'center', fontSize: 18, flexShrink: 0, boxShadow: '0 0 15px rgba(0,229,204,.2)' }}>
                        📡
                    </div>
                    <div>
                        <div style={{ fontFamily: 'var(--fd)', fontWeight: 900, fontSize: 18, letterSpacing: '-0.5px', color: 'var(--text)' }}>NicheRadar</div>
                        <div style={{ fontFamily: 'var(--fm)', fontSize: 9, color: 'var(--muted)', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 700 }}>v6.0 · RDR</div>
                    </div>
                </div>
            </div>

            {/* Nav */}
            <nav style={{ flex: 1, padding: 'var(--s3) var(--s2)', display: 'flex', flexDirection: 'column', gap: 2 }}>
                {NAV.map(section => (
                    <div key={section.label} style={{ marginBottom: 'var(--s4)' }}>
                        <div style={{ fontFamily: 'var(--fm)', fontSize: 9.5, textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--dim)', padding: 'var(--s2) var(--s3)', fontWeight: 800 }}>
                            {section.label}
                        </div>
                        {section.items.map(item => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                style={({ isActive }) => ({
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 10,
                                    padding: 'var(--s2) var(--s3)',
                                    borderRadius: 'var(--r1)',
                                    cursor: 'pointer',
                                    color: isActive ? 'var(--accent)' : 'var(--muted)',
                                    background: isActive ? 'var(--adim)' : 'transparent',
                                    border: isActive ? '1px solid rgba(0,229,204,.25)' : '1px solid transparent',
                                    boxShadow: isActive ? '0 0 15px rgba(0,229,204,.08)' : 'none',
                                    fontSize: '13px',
                                    fontWeight: isActive ? 700 : 500,
                                    textDecoration: 'none',
                                    transition: 'all .24s cubic-bezier(.4,0,.2,1)',
                                    marginBottom: 1,
                                })}
                                onMouseEnter={e => {
                                    if (!e.currentTarget.classList.contains('active')) {
                                        e.currentTarget.style.color = 'var(--text)'
                                        e.currentTarget.style.background = 'rgba(255,255,255,.03)'
                                    }
                                }}
                                onMouseLeave={e => {
                                    if (!e.currentTarget.classList.contains('active')) {
                                        e.currentTarget.style.color = 'var(--muted)'
                                        e.currentTarget.style.background = 'transparent'
                                    }
                                }}
                            >
                                <span style={{ fontSize: 13, width: 16, textAlign: 'center' }}>{item.icon}</span>
                                <span style={{ flex: 1 }}>
                                    {item.label}
                                    {item.to === '/bookmarks' && totalBookmarks > 0 && (
                                        <span style={{ marginLeft: 5, fontSize: 9, fontFamily: 'var(--fm)', color: 'var(--accent)' }}>
                                            ({totalBookmarks})
                                        </span>
                                    )}
                                </span>
                                {item.badge && (
                                    <span style={{
                                        fontFamily: 'var(--fm)',
                                        fontSize: 8.5,
                                        padding: '1px 5px',
                                        borderRadius: 10,
                                        fontWeight: 700,
                                        ...BADGE_STYLES[item.badgeCls],
                                    }}>
                                        {item.badge}
                                    </span>
                                )}
                            </NavLink>
                        ))}
                    </div>
                ))}
            </nav>

            {/* Footer */}
            <div style={{ padding: 'var(--s3) var(--s4)', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 'var(--s1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--s2)', fontSize: 10, color: 'var(--muted)', fontFamily: 'var(--fm)' }}>
                    <div style={{
                        width: 6, height: 6, borderRadius: '50%',
                        background: apiStatus === 'quota_exceeded' ? 'var(--red)' : 'var(--green)',
                        boxShadow: `0 0 5px ${apiStatus === 'quota_exceeded' ? 'var(--red)' : 'var(--green)'}`,
                        animation: 'blink 2.2s infinite',
                        flexShrink: 0,
                    }} />
                    <span style={{ fontWeight: 700, letterSpacing: 0.5 }}>{apiStatus === 'quota_exceeded' ? 'QUOTA EXCEEDED' : 'API READY'}</span>
                </div>
                <div style={{ fontFamily: 'var(--fm)', fontSize: 9, color: 'var(--dim)', fontWeight: 600 }}>
                    Usage: {quotaUsed.toLocaleString()} / 10,000 units
                </div>
            </div>
        </aside>
    )
}