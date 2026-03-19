import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'

const PAGE_META = {
    '/explorer': ['Niche Explorer', 'Keyword → live analysis → opportunity score'],
    '/simulator': ['Algorithm Simulator', 'Pre-publishing video simulator — predict views before filming'],
    '/topic-map': ['Topic Map Engine', 'Interactive ecosystem graph — nodes, clusters, hidden niches'],
    '/viral-predictor': ['Viral AI Predictor', 'Multi-feature model predicts viral probability per niche'],
    '/batch': ['Batch Pipeline', 'Process multiple niches through the full 5-stage pipeline'],
    '/viral-gaps': ['Viral Gap Detector', 'Topics where demand outpaces creator supply'],
    '/small-wins': ['Small Channel Wins', 'Small creators beating the algorithm'],
    '/factory': ['Content Factory', 'Topic → ideas → titles → thumbnails → script → production'],
    '/clone-factory': ['Clone Factory', 'Scale proven formulas across niches and audiences'],
    '/queue': ['Production Queue', 'Kanban board tracking videos from idea to scheduled'],
    '/scheduler': ['Publishing Scheduler', '2-week content calendar with auto-schedule'],
    '/competitors': ['Competitor Studio', 'Track rivals, detect winning topics, find their gaps'],
    '/keywords': ['Keyword Research', 'Search volume estimation, difficulty score, keyword tree'],
    '/bookmarks': ['Bookmarks', 'Saved ideas, niches, videos, and competitors'],
    '/analyzer': ['Video Analyzer', 'Paste any YouTube URL → instant breakdown of why it worked'],
    '/do-this-next': ['Do This Next', 'AI-powered recommendation engine — your next best video'],
    '/winning-channels': ['Winning Channels', 'Find small channels winning big with high ratio/low subs'],
    '/trending': ['Trending Feed', 'Pre-loaded trending niches — click to analyse'],
    '/content-gaps': ['Content Gap Detector', 'Find popular topics missing entire content formats'],
    '/cache': ['Cache & Storage', 'Persistent cache reduces API quota by 70–90%'],
}

export default function Topbar() {
    const { pathname } = useLocation()
    const navigate = useNavigate()
    const { loading, quotaUsed } = useAppStore()
    const [title, desc] = PAGE_META[pathname] || ['NicheRadar', 'Advanced Intelligence']

    return (
        <header className="fade-in" style={{
            position: 'fixed',
            top: '24px',
            left: 'calc(var(--sidebar-w) + 64px)',
            right: '24px',
            height: 'var(--topbar-h)',
            background: 'var(--glass)',
            backdropFilter: 'blur(30px)',
            WebkitBackdropFilter: 'blur(30px)',
            borderRadius: 'var(--r3)',
            border: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            padding: '0 var(--s6)',
            zIndex: 900,
            boxShadow: 'var(--shadow-l)',
            transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
            <div className="h-stack" style={{ flex: 1, justifyContent: 'space-between' }}>
                <div className="v-stack" style={{ gap: 2 }}>
                    <div style={{ fontSize: 24, fontWeight: 900, fontFamily: 'var(--fd)', letterSpacing: '-1.5px', color: 'var(--text)' }}>
                        {title}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        {desc}
                    </div>
                </div>

                <div className="h-stack" style={{ gap: 'var(--s4)' }}>
                    <div className="card" style={{ padding: '10px 20px', borderRadius: 'var(--rl)', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', boxShadow: 'none' }}>
                        <div className="h-stack" style={{ gap: 10 }}>
                            <div style={{
                                width: 8, height: 8, borderRadius: '50%',
                                background: 'var(--accent)',
                                boxShadow: '0 0 12px var(--accent)',
                                animation: loading ? 'pulse 1.5s infinite' : 'none'
                            }} />
                            <span style={{ fontSize: 11, fontFamily: 'var(--fm)', fontWeight: 800, color: 'var(--accent)' }}>
                                {loading ? 'SYNCHRONIZING...' : 'SYSTEM: NOMINAL'}
                            </span>
                        </div>
                    </div>

                    <div className="v-stack" style={{ gap: 4, minWidth: 100 }}>
                        <div style={{ fontSize: 9, color: 'var(--dim)', fontWeight: 800, textAlign: 'right' }}>QUOTA: {quotaUsed.toLocaleString()}</div>
                        <div style={{ height: 4, width: '100%', background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${Math.min(100, (quotaUsed / 10000) * 100)}%`, background: 'var(--accent-grad)', transition: 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1)' }} />
                        </div>
                    </div>

                    <button className="btn s glass" style={{ borderRadius: 'var(--r2)', padding: '8px 16px' }} onClick={() => navigate('/cache')}>
                        ⚡ STATUS
                    </button>
                </div>
            </div>

            <style>{`
                @keyframes pulse {
                    0% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.4); opacity: 0.5; }
                    100% { transform: scale(1); opacity: 1; }
                }
            `}</style>
        </header>
    )
}