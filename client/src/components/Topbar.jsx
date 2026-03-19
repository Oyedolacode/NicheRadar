import React from 'react'
import { useLocation } from 'react-router-dom'
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
    '/queue': ['Production Queue', 'Kanban board tracking videos from idea to scheduled'],
    '/scheduler': ['Publishing Scheduler', '2-week content calendar with auto-schedule'],
    '/competitors': ['Competitor Studio', 'Track rivals, detect winning topics, find their gaps'],
    '/keywords': ['Keyword Research', 'Search volume estimation, difficulty score, keyword tree'],
    '/bookmarks': ['Bookmarks', 'Saved ideas, niches, videos, and competitors'],
    '/analyzer': ['Video Analyzer', 'Paste any YouTube URL → instant breakdown of why it worked'],
    '/do-this-next': ['Do This Next', 'AI-powered recommendation engine — your next best video'],
    '/trending': ['Trending Feed', 'Pre-loaded trending niches — click to analyse'],
    '/content-gaps': ['Content Gap Detector', 'Find popular topics missing entire content formats'],
    '/cache': ['Cache & Storage', 'Persistent cache reduces API quota by 70–90%'],
}

export default function TopBar() {
    const { pathname } = useLocation()
    const { quotaUsed, loading, clearCache } = useAppStore()
    const [title, subtitle] = PAGE_META[pathname] || ['NicheRadar', '']
    const quotaPct = Math.min(100, (quotaUsed / 10000) * 100)

    return (
        <>
            {/* Progress bar */}
            <div style={{ position: 'fixed', top: 0, left: 'var(--sidebar-w)', right: 0, height: 2, zIndex: 999 }}>
                <div style={{
                    height: '100%',
                    width: loading ? '75%' : '0%',
                    background: 'var(--accent)',
                    boxShadow: '0 0 8px var(--accent)',
                    transition: 'width .4s',
                }} />
            </div>

            {/* Top bar */}
            <div style={{
                background: 'var(--surface)',
                borderBottom: '1px solid var(--border)',
                padding: 'var(--s3) var(--s6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                position: 'sticky',
                top: 0,
                zIndex: 50,
                gap: 'var(--s4)',
                backdropFilter: 'blur(10px)',
            }}>
                <div>
                    <h1 style={{ fontFamily: 'var(--fd)', fontWeight: 800, fontSize: 18, color: 'var(--text)', letterSpacing: '-0.3px' }}>{title}</h1>
                    <p style={{ fontSize: 10, color: 'var(--muted)', fontFamily: 'var(--fm)', marginTop: 'var(--s1)', letterSpacing: '0.2px', textTransform: 'uppercase', fontWeight: 600 }}>{subtitle}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--s3)', flexShrink: 0 }}>
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: 'var(--s3)',
                        fontFamily: 'var(--fm)', fontSize: 11,
                        background: 'var(--elevated)', padding: 'var(--s2) var(--s4)',
                        borderRadius: 'var(--r1)', border: '1px solid var(--border)',
                        fontWeight: 700,
                    }}>
                        <span style={{ color: 'var(--accent)' }}>⚡</span> {quotaUsed.toLocaleString()}
                        <div style={{ width: 60, height: 4, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${quotaPct}%`, background: 'var(--accent)', transition: 'width .5s ease-out' }} />
                        </div>
                    </div>
                    <button
                        className="btn s"
                        onClick={clearCache}
                        style={{ fontSize: 10, fontWeight: 800 }}
                    >
                        🗑 CLEAR CACHE
                    </button>
                </div>
            </div>
        </>
    )
}