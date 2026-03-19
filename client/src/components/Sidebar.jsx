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
    const { totalCount } = useBookmarkStore()
    const totalBookmarks = totalCount()

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
            <div style={{ padding: '18px 15px 15px', borderBottom: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 34, height: 34, background: 'var(--accent)', borderRadius: 8, display: 'grid', placeItems: 'center', fontSize: 16, flexShrink: 0 }}>
                        📡
                    </div>
                    <div>
                        <div style={{ fontFamily: 'var(--fd)', fontWeight: 800, fontSize: 16, letterSpacing: '-.4px' }}>NicheRadar</div>
                        <div style={{ fontFamily: 'var(--fm)', fontSize: 9, color: 'var(--muted)', letterSpacing: '1.5px', textTransform: 'uppercase' }}>v6 · React</div>
                    </div>
                </div>
            </div>

            {/* Nav */}
            <nav style={{ flex: 1, padding: '11px 7px', display: 'flex', flexDirection: 'column', gap: 1 }}>
                {NAV.map(section => (
                    <div key={section.label}>
                        <div style={{ fontFamily: 'var(--fm)', fontSize: 9, textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--dim)', padding: '8px 9px 3px' }}>
                            {section.label}
                        </div>
                        {section.items.map(item => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                style={({ isActive }) => ({
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 8,
                                    padding: '8px 10px',
                                    borderRadius: 'var(--r)',
                                    cursor: 'pointer',
                                    color: isActive ? 'var(--accent)' : 'var(--muted)',
                                    background: isActive ? 'var(--adim)' : 'transparent',
                                    border: isActive ? '1px solid rgba(0,229,204,.18)' : '1px solid transparent',
                                    fontSize: 12.5,
                                    fontWeight: 500,
                                    textDecoration: 'none',
                                    transition: 'all .15s',
                                })}
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
            <div style={{ padding: 11, borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 10, color: 'var(--muted)', fontFamily: 'var(--fm)' }}>
                    <div style={{
                        width: 6, height: 6, borderRadius: '50%',
                        background: apiStatus === 'quota_exceeded' ? 'var(--red)' : 'var(--green)',
                        boxShadow: `0 0 5px ${apiStatus === 'quota_exceeded' ? 'var(--red)' : 'var(--green)'}`,
                        animation: 'blink 2.2s infinite',
                        flexShrink: 0,
                    }} />
                    <span>{apiStatus === 'quota_exceeded' ? 'Quota exceeded' : 'API Ready'}</span>
                </div>
                <div style={{ fontFamily: 'var(--fm)', fontSize: 9, color: 'var(--dim)' }}>
                    Quota: {quotaUsed.toLocaleString()} / 10,000 units
                </div>
            </div>
        </aside>
    )
}