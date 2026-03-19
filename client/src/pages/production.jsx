import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

export default function Production() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const [tab, setTab] = useState('kanban')

  // Kanban mock data or real queue
  const COLUMNS = [
    { id: 'ideas', label: '💡 Ideas', items: state?.kw ? [{ title: state.kw, due: 'Mar 22' }] : [] },
    { id: 'script', label: '✍️ Scripting', items: [] },
    { id: 'editing', label: '🎬 Editing', items: [] },
    { id: 'published', label: '✅ Published', items: [] },
  ]

  return (
    <div className="page fade-in">
      <header style={{ marginBottom: 'var(--s8)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: 32, fontWeight: 900, letterSpacing: '-1px', margin: 0 }}>Production Pipeline</h1>
          <p style={{ color: 'var(--muted)', fontSize: 14 }}>Track your content from initial idea to final publication.</p>
        </div>
        <div className="h-stack" style={{ gap: 'var(--s2)', background: 'var(--elevated)', padding: 4, borderRadius: 'var(--r2)', border: '1px solid var(--border)' }}>
          {['kanban', 'factory', 'scheduler'].map(t => (
            <button key={t} className={`chip ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}
                    style={{ background: tab === t ? 'var(--adim)' : '', borderColor: tab === t ? 'var(--accent)' : '' }}>
              {t.toUpperCase()}
            </button>
          ))}
        </div>
      </header>

      {tab === 'kanban' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--s4)', minHeight: '60vh' }}>
          {COLUMNS.map(col => (
            <div key={col.id} className="v-stack" style={{ gap: 'var(--s3)' }}>
              <div className="slbl" style={{ textAlign: 'center', background: 'var(--glass)', padding: 'var(--s2)', borderRadius: 'var(--r1)' }}>{col.label}</div>
              <div style={{ flex: 1, background: 'rgba(0,0,0,0.1)', border: '1px dashed var(--border)', borderRadius: 'var(--r2)', padding: 'var(--s3)' }} className="v-stack">
                {col.items.map((item, i) => (
                  <div key={i} className="card shadow-sm" style={{ padding: 'var(--s4)', border: '1px solid var(--border)' }}>
                    <div style={{ fontWeight: 800, fontSize: 13, marginBottom: 4 }}>{item.title}</div>
                    <div className="h-stack" style={{ justifyContent: 'space-between' }}>
                      <span className="slbl" style={{ marginBottom: 0 }}>DUE: {item.due}</span>
                      <span style={{ fontSize: 10, opacity: 0.5 }}>⚡</span>
                    </div>
                  </div>
                ))}
                {!col.items.length && <div style={{ textAlign: 'center', opacity: 0.2, fontSize: 10, marginTop: 20 }}>DRAG & DROP</div>}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'factory' && (
        <div className="empty">
          <div className="ei">🏭</div>
          <h3>Content Factory</h3>
          <p>The automated AI generation engine is being integrated into this unified portal.</p>
          <button className="btn sim" onClick={() => setTab('kanban')}>Back to Kanban</button>
        </div>
      )}

      {tab === 'scheduler' && (
        <div className="empty">
          <div className="ei">📅</div>
          <h3>Publisher Scheduler</h3>
          <p>Your publication calendar and automated posting triggers.</p>
          <button className="btn sim" onClick={() => setTab('kanban')}>Back to Kanban</button>
        </div>
      )}
    </div>
  )
}
