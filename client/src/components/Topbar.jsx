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
                padding: '11px 22px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                position: 'sticky',
                top: 0,
                zIndex: 50,
                gap: 16,
            }}>
                <div>
                    <h1 style={{ fontFamily: 'var(--fd)', fontWeight: 700, fontSize: 17 }}>{title}</h1>
                    <p style={{ fontSize: 10, color: 'var(--muted)', fontFamily: 'var(--fm)', marginTop: 1 }}>{subtitle}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 9, flexShrink: 0 }}>
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        fontFamily: 'var(--fm)', fontSize: 10,
                        background: 'var(--elevated)', padding: '5px 10px',
                        borderRadius: 'var(--r)', border: '1px solid var(--border)',
                    }}>
                        ⚡ {quotaUsed.toLocaleString()} units
                        <div style={{ width: 72, height: 3, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${quotaPct}%`, background: 'var(--accent)', transition: 'width .5s', borderRadius: 2 }} />
                        </div>
                    </div>
                    <button
                        onClick={clearCache}
                        style={{
                            background: 'var(--elevated)', color: 'var(--text)', border: '1px solid var(--border)',
                            borderRadius: 'var(--r)', padding: '5px 10px', fontSize: 10,
                            fontFamily: 'var(--fd)', fontWeight: 700, cursor: 'pointer',
                        }}
                    >
                        🗑 Cache
                    </button>
                </div>
            </div>
        </>
    )
}