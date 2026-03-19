import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'
import { useBookmarkStore } from '../store/useBookmarkStore'

const MENU = [
  { id: 'dashboard',   label: 'Dashboard',     icon: '🏠', path: '/dashboard' },
  { id: 'opportunities', label: 'Opportunities', icon: '🔍', path: '/opportunities' },
  { id: 'ideas',       label: 'Ideas',         icon: '💡', path: '/ideas' },
  { id: 'production',  label: 'Production',    icon: '🎬', path: '/production' },
  { id: 'analytics',   label: 'Analytics',     icon: '📊', path: '/analytics' },
  { id: 'competitors', label: 'Competitors',   icon: '🧠', path: '/competitors' },
]

export default function Sidebar() {
  const { currentPage, setPage, apiStatus } = useAppStore()
  const { getTotalCount } = useBookmarkStore()
  const navigate = useNavigate()
  
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
      {/* Logo */}
      <div style={{ padding: 'var(--s6)', borderBottom: '1px solid var(--border)' }}>
        <div className="h-stack" style={{ gap: 'var(--s3)', cursor: 'pointer' }} onClick={() => { navigate('/dashboard'); setPage('dashboard') }}>
          <div style={{ 
            width: 48, height: 48, borderRadius: 'var(--r3)', 
            background: 'var(--accent-grad)', 
            display: 'grid', placeItems: 'center', 
            fontSize: 26, boxShadow: '0 8px 24px rgba(var(--accent-rgb), 0.3)' 
          }}>📡</div>
          <div className="v-stack" style={{ gap: 0 }}>
            <h1 style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-2px', margin: 0, color: 'var(--text)' }}>NicheRadar</h1>
            <span style={{ fontSize: 9, color: 'var(--accent)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: 3 }}>Growth OS v6</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: 'var(--s4)', display: 'flex', flexDirection: 'column' }} className="hide-scrollbar">
        <div className="slbl" style={{ paddingLeft: 'var(--s4)', marginBottom: 'var(--s2)', opacity: 0.6 }}>MAIN TERMINAL</div>
        <div className="v-stack" style={{ gap: '2px' }}>
          {MENU.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              onClick={() => setPage(item.id)}
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
                  {item.id === 'ideas' && totalBookmarks > 0 && (
                    <span style={{ fontSize: 10, color: 'var(--accent)', fontWeight: 800 }}>{totalBookmarks}</span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
      
      {/* Footer / Status */}
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