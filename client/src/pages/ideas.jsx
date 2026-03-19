import React from 'react'
import { useBookmarkStore } from '../store/useBookmarkStore'
import { useNavigate } from 'react-router-dom'

export default function Ideas() {
  const { bookmarks, removeNiche } = useBookmarkStore()
  const navigate = useNavigate()

  return (
    <div className="page fade-in">
      <header style={{ marginBottom: 'var(--s8)' }}>
        <h1 style={{ fontSize: 32, fontWeight: 900, letterSpacing: '-1px', margin: 0 }}>Idea Lab</h1>
        <p style={{ color: 'var(--muted)', fontSize: 14 }}>Manage your high-signal content ideas and saved niches.</p>
      </header>

      {!bookmarks.length ? (
        <div className="empty">
          <div className="ei">💡</div>
          <h3>No ideas saved yet</h3>
          <p>Scan opportunities and bookmark potential winners to see them here.</p>
          <button className="btn sim" onClick={() => navigate('/opportunities')}>Find Opportunities</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--s6)' }}>
          {bookmarks.map(b => (
            <div key={b.kw} className="card shadow-md h-stack" style={{ padding: 'var(--s5)', justifyContent: 'space-between' }}>
              <div className="v-stack" style={{ gap: 'var(--s1)' }}>
                <div style={{ fontSize: 16, fontWeight: 800 }}>{b.kw}</div>
                <div className="h-stack" style={{ gap: 'var(--s4)' }}>
                  <span className="slbl" style={{ marginBottom: 0 }}>Opp: {b.opp.toFixed(1)}</span>
                  <span className="slbl" style={{ marginBottom: 0 }}>Gap: {b.vg.toFixed(2)}</span>
                </div>
              </div>
              <div className="h-stack" style={{ gap: 'var(--s2)' }}>
                <button className="btn sim" style={{ padding: '6px 12px', fontSize: 11 }} onClick={() => navigate('/production', { state: { kw: b.kw } })}>🎬 Produce</button>
                <button className="btn s" style={{ padding: '6px 10px', fontSize: 11 }} onClick={() => removeNiche(b.kw)}>🗑️</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
