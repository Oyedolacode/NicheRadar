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
            { to: '/clone-factory', icon: '🧬', label: 'Clone Factory', badge: 'HOT', badgeCls: 'hot' },
            { to: '/queue', icon: '📋', label: 'Production Queue' },
            { to: '/scheduler', icon: '📅', label: 'Pub. Scheduler' },
        ],
    },
    {
        label: 'Core Systems',
        items: [
            { to: '/competitors', icon: '🎯', label: 'Competitor Studio' },
            { to: '/keywords', icon: '🔑', label: 'Keyword Research' },
            { to: '/bookmarks', icon: '🔖', label: 'Saved Bookmarks' },
            { to: '/analyzer', icon: '🎬', label: 'Video Analyzer' },
            { to: '/do-this-next', icon: '🚀', label: 'Do This Next' },
        ],
    },
    {
        label: 'Discovery',
        items: [
            { to: '/winning-channels', icon: '🏆', label: 'Winning Channels' },
            { to: '/trending', icon: '📈', label: 'Trending Feed' },
            { to: '/content-gaps', icon: '💡', label: 'Content Gaps' },
        ],
    },
    {
        label: 'Settings',
        items: [
            { to: '/cache', icon: '💾', label: 'Infrastructure & Cache' },
        ],
    },
]

const BADGE_STYLES = {
    hot: { background: 'var(--hot)', color: '#fff' },
    ai: { background: 'var(--purple)', color: '#fff' },
    fac: { background: 'var(--accent-grad)', color: '#000' },
}

export default function Sidebar() {
    const { apiStatus } = useAppStore()
    const { getTotalCount } = useBookmarkStore()
    const totalBookmarks = typeof getTotalCount === 'function' ? getTotalCount() : 0

    return (
        <aside className="fade-in" style={{
            width: 'var(--sidebar-w)',
            height: 'calc(100vh - 48px)',
            position: 'fixed',
            left: '24px',
            top: '24px',
            background: 'var(--glass)',
            backdropFilter: 'blur(40px)',
            webkitBackdropFilter: 'blur(40px)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--r4)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            zIndex: 1000,
            boxShadow: 'var(--shadow-xl)',
            transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
            <div style={{ padding: 'var(--s6)', borderBottom: '1px solid var(--border)' }}>
                <div className="h-stack" style={{ gap: 'var(--s3)' }}>
                    <div style={{ 
                        width: 48, height: 48, borderRadius: 'var(--r3)', 
                        background: 'var(--accent-grad)', 
                        display: 'grid', placeItems: 'center', 
                        fontSize: 26, boxShadow: '0 8px 24px rgba(var(--accent-rgb), 0.3)' 
                    }}>📡</div>
                    <div className="v-stack" style={{ gap: 0 }}>
                        <h1 style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-2px', margin: 0, color: 'var(--text)' }}>NicheRadar</h1>
                        <span style={{ fontSize: 9, color: 'var(--accent)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: 3 }}>Intelligence v6</span>
                    </div>
                </div>
            </div>

            <nav style={{ flex: 1, overflowY: 'auto', padding: 'var(--s4)', display: 'flex', flexDirection: 'column' }} className="hide-scrollbar">
                {NAV.map((group, gi) => (
                    <div key={gi} style={{ marginBottom: 'var(--s6)' }}>
                        <div className="slbl" style={{ paddingLeft: 'var(--s4)', marginBottom: 'var(--s2)', opacity: 0.6 }}>{group.label}</div>
                        <div className="v-stack" style={{ gap: '2px' }}>
                            {group.items.map((item, ii) => (
                                <NavLink
                                    key={ii}
                                    to={item.to}
                                    style={({ isActive }) => ({
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '16px',
                                        padding: '12px 20px',
                                        borderRadius: 'var(--r2)',
                                        fontSize: '14px',
                                        fontWeight: isActive ? 800 : 500,
                                        color: isActive ? 'var(--text)' : 'var(--muted)',
                                        textDecoration: 'none',
                                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                        background: isActive ? 'rgba(255,255,255,0.06)' : 'transparent',
                                        border: '1px solid',
                                        borderColor: isActive ? 'var(--border)' : 'transparent',
                                        position: 'relative',
                                        overflow: 'hidden'
                                    })}
                                >
                                    {({ isActive }) => (
                                        <>
                                            {isActive && <div style={{ position: 'absolute', left: 0, top: '25%', bottom: '25%', width: 3, background: 'var(--accent)', borderRadius: '0 4px 4px 0' }} />}
                                            <span style={{ fontSize: 18, filter: isActive ? 'none' : 'grayscale(1) opacity(0.5)' }}>{item.icon}</span>
                                            <span style={{ flex: 1 }}>{item.label}</span>
                                            {item.to === '/bookmarks' && totalBookmarks > 0 && (
                                                <span style={{ fontSize: 10, color: 'var(--accent)', fontWeight: 800 }}>{totalBookmarks}</span>
                                            )}
                                            {item.badge && (
                                                <span className="pill" style={{ 
                                                    fontSize: 8, 
                                                    borderRadius: 6,
                                                    padding: '2px 6px',
                                                    ...BADGE_STYLES[item.badgeCls] 
                                                }}>{item.badge}</span>
                                            )}
                                        </>
                                    )}
                                </NavLink>
                            ))}
                        </div>
                    </div>
                ))}
            </nav>
            
            <div style={{ padding: 'var(--s4) var(--s6)', borderTop: '1px solid var(--border)', background: 'rgba(0,0,0,0.2)' }}>
                <div className="h-stack" style={{ gap: 'var(--s3)' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: apiStatus === 'ready' ? 'var(--green)' : 'var(--red)', boxShadow: `0 0 10px ${apiStatus === 'ready' ? 'var(--green)' : 'var(--red)'}` }} />
                    <div className="v-stack" style={{ gap: 0 }}>
                        <div style={{ fontSize: 10, fontWeight: 900, color: 'var(--text)' }}>AI NODE: {apiStatus.toUpperCase()}</div>
                        <div style={{ fontSize: 9, color: 'var(--dim)', fontWeight: 700 }}>latency: 42ms</div>
                    </div>
                </div>
            </div>
        </aside>
    )
}