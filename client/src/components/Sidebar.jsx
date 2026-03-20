import React from 'react'
import { NavLink } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'
import { useQueueStore } from '../store/useQueueStore'

const SECTIONS = [
  {
    title: 'Home',
    items: [
      { id: 'dashboard', label: 'Growth Assistant', icon: '🏠', path: '/dashboard' },
    ]
  },
  {
    title: 'Intelligence',
    items: [
      { id: 'explorer', label: 'Niche Explorer', icon: '🔍', path: '/explorer' },
      { id: 'algsim', label: 'Algorithm Simulator', icon: '🎮', path: '/simulator' },
      { id: 'topicmap', label: 'Topic Map Engine', icon: '🗺️', path: '/topic-map' },
      { id: 'viral_ai', label: 'Viral Predictor', icon: '🤖', path: '/viral-predictor', badge: 'AI', badgeCls: 'ai' },
      { id: 'batch', label: 'Batch Pipeline', icon: '⚙️', path: '/batch' },
      { id: 'viral', label: 'Viral Gaps', icon: '⚡', path: '/viral-gaps', badge: 'HOT', badgeCls: 'hot' },
      { id: 'wins', label: 'Small Channel Wins', icon: '🏆', path: '/small-wins' },
    ]
  },
  {
    title: 'Production',
    items: [
      { id: 'factory', label: 'Content Factory', icon: '🏭', path: '/factory', badge: 'NEW', badgeCls: 'fac' },
      { id: 'queue', label: 'Production Queue', icon: '📋', path: '/queue' },
      { id: 'scheduler', label: 'Pub. Scheduler', icon: '📅', path: '/scheduler' },
    ]
  },
  {
    title: 'New Features',
    items: [
      { id: 'outliers', label: 'Outlier Engine', icon: '⚡', path: '/outliers', badge: 'NEW', badgeCls: 'hot' },
      { id: 'competitors', label: 'Competitor Studio', icon: '🎯', path: '/competitors', badge: 'NEW', badgeCls: 'fac' },
      { id: 'keywords', label: 'Keyword Research', icon: '🔑', path: '/keywords', badge: 'NEW', badgeCls: 'fac' },
      { id: 'bookmarks', label: 'Bookmarks', icon: '🔖', path: '/bookmarks' },
      { id: 'analyzer', label: 'Video Analyzer', icon: '🎬', path: '/analyzer' },
      { id: 'do-next', label: 'Do This Next', icon: '🚀', path: '/do-this-next' },
    ]
  },
  {
    title: 'Discovery',
    items: [
      { id: 'trending', label: 'Trending Feed', icon: '📈', path: '/trending' },
      { id: 'content-gaps', label: 'Content Gaps', icon: '💡', path: '/content-gaps' },
    ]
  },
  {
    title: 'System',
    items: [
      { id: 'cache', label: 'Cache & Storage', icon: '💾', path: '/cache' },
    ]
  }
]

export default function Sidebar() {
  const { apiStatus } = useAppStore()
  const { totalCount } = useQueueStore()
  const count = typeof totalCount === 'function' ? totalCount() : 0

  return (
    <aside className="sidebar">
      <div className="logo-wrap">
        <div className="logo">
          <div className="lm">📡</div>
          <div>
            <div className="ln">NicheRadar</div>
            <div className="lv">v6 · Factory</div>
          </div>
        </div>
      </div>

      <nav className="nav">
        {SECTIONS.map((section, idx) => (
          <React.Fragment key={idx}>
            <div className="nlbl">{section.title}</div>
            {section.items.map(item => (
              <NavLink
                key={item.id}
                to={item.path}
                className={({ isActive }) => `ni ${isActive ? 'on' : ''}`}
              >
                <span className="nico">{item.icon}</span>
                {item.label}
                {item.id === 'queue' && count > 0 && <span className="nbg fac">{count}</span>}
                {item.badge && <span className={`nbg ${item.badgeCls}`}>{item.badge}</span>}
              </NavLink>
            ))}
          </React.Fragment>
        ))}
      </nav>

      <div className="sfoot">
        <div className="astat">
          <div className={`dot ${apiStatus === 'ready' ? '' : 'e'}`}></div>
          <span>{apiStatus === 'ready' ? 'API Ready' : 'API Error'}</span>
        </div>
        <div className="cache-info">Cache: Active</div>
      </div>
    </aside>
  )
}