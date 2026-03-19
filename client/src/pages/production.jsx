import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

export default function Production() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const [tab, setTab] = useState('pipeline')

  // Kanban logic: If source is Idea/Seed, start in "Idea" column
  const initialItems = state?.kw ? [{ title: state.kw, due: 'Mar 24', status: 'ready', type: 'Topic' }] : []
  if (state?.seed) initialItems.push({ title: state.seed.title, due: 'Mar 25', status: 'hot', type: 'Clone' })

  const COLUMNS = [
    { id: 'idea', label: '💡 Production Ready', items: initialItems },
    { id: 'script', label: '✍️ Scripting', items: [] },
    { id: 'recording', label: '🎬 Recording', items: [] },
    { id: 'final', label: '✅ Published', items: [] },
  ]

  return (
    <div className="page fade-in">
      <header style={{ marginBottom: 'var(--s8)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div className="v-stack" style={{ gap: 'var(--s1)' }}>
          <h1 style={{ fontSize: 32, fontWeight: 900, letterSpacing: '-1.5px', margin: 0 }}>Production Pipeline</h1>
          <p style={{ color: 'var(--muted)', fontSize: 14 }}>Transform concepts into high-velocity content.</p>
        </div>
        <div className="h-stack" style={{ gap: 'var(--s2)', background: 'rgba(255,255,255,0.03)', padding: 6, borderRadius: '100px', border: '1px solid var(--border)' }}>
          {['pipeline', 'factory', 'calendar'].map(t => (
            <button key={t} className={`chip ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}
                    style={{ background: tab === t ? 'var(--adim)' : '', borderColor: tab === t ? 'var(--accent)' : '' }}>
              {t.toUpperCase()}
            </button>
          ))}
        </div>
      </header>

      {tab === 'pipeline' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--s5)', minHeight: '70vh' }}>
          {COLUMNS.map(col => (
            <div key={col.id} className="v-stack" style={{ gap: 'var(--s4)' }}>
              <div className="slbl" style={{ textAlign: 'center', background: 'var(--glass)', padding: 'var(--s3)', borderRadius: 'var(--r2)', border: '1px solid var(--border)' }}>{col.label}</div>
              <div style={{ flex: 1, background: 'rgba(255,255,255,0.02)', border: '1px dashed var(--border)', borderRadius: 'var(--r3)', padding: 'var(--s4)' }} className="v-stack">
                {col.items.map((item, i) => (
                  <div key={i} className="card shadow-md" style={{ padding: 'var(--s5)', border: '1px solid var(--border)', background: 'var(--surface)' }}>
                    <div className="h-stack" style={{ justifyContent: 'space-between', marginBottom: 'var(--s2)' }}>
                       <span className="tag" style={{ color: item.status === 'hot' ? 'var(--hot)' : 'var(--accent)', fontWeight: 800 }}>{item.type}</span>
                       <span className="slbl" style={{ marginBottom: 0, opacity: 0.5 }}>DUE {item.due}</span>
                    </div>
                    <div style={{ fontWeight: 900, fontSize: 14, marginBottom: 'var(--s4)', lineHeight: 1.4 }}>{item.title}</div>
                    
                    <div className="v-stack" style={{ gap: 'var(--s2)' }}>
                      <button className="btn sim s w-100" style={{ padding: '8px', fontSize: 11 }}>✍️ Generate AI Script</button>
                      <button className="btn s w-100" style={{ padding: '8px', fontSize: 11 }}>📋 Outline</button>
                    </div>
                  </div>
                ))}
                {!col.items.length && <div style={{ textAlign: 'center', opacity: 0.1, fontSize: 11, marginTop: 40, fontWeight: 900 }}>EMPTY SEGMENT</div>}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab !== 'pipeline' && (
        <div className="empty">
          <div className="ei">⚙️</div>
          <h3>System Integration</h3>
          <p>The {tab} engine is active but currently being unified for the Growth OS overhaul.</p>
          <button className="btn sim" onClick={() => setTab('pipeline')}>Return to Pipeline</button>
        </div>
      )}
    </div>
  )
}
