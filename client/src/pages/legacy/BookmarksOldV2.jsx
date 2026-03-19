import React from 'react'
import { useBookmarkStore } from '../store/useBookmarkStore'
import { useNavigate } from 'react-router-dom'

export default function Bookmarks() {
  const { niches, removeNiche } = useBookmarkStore()
  const navigate = useNavigate()

  return (
    <div className="page fade-in">
      <header style={{ marginBottom: 'var(--s8)' }}>
        <h1 style={{ fontSize: 32, fontWeight: 900, letterSpacing: '-1px', margin: 0 }}>Strategy Lab</h1>
        <p style={{ color: 'var(--muted)', fontSize: 14 }}>Your high-signal niches and content blueprints.</p>
      </header>

      {!niches.length ? (
        <div className="empty">
          <div className="ei">💡</div>
          <h3 style={{ fontSize: 20, fontWeight: 900 }}>Your strategy lab is empty</h3>
          <p style={{ color: 'var(--muted)', maxWidth: 350, margin: 'var(--s2) 0 var(--s6) 0' }}>
            When you find a winning niche in the Opportunities hub, save it here to build your production roadmap.
          </p>
          <button className="btn sim" onClick={() => navigate('/explorer')}>Find Opportunities</button>
        </div>
      ) : (
        <div className="v-stack" style={{ gap: 'var(--s6)' }}>
          {niches.map(b => (
            <div key={b.kw} className="card shadow-md" style={{ padding: 'var(--s6)', border: '1.5px solid var(--border)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr 1fr', gap: 'var(--s8)', alignItems: 'center' }}>
                
                {/* 1. The Niche */}
                <div className="v-stack" style={{ gap: 'var(--s1)' }}>
                  <div className="h-stack" style={{ gap: 'var(--s2)' }}>
                     <div style={{ width: 6, height: 6, background: 'var(--accent)', borderRadius: '50%' }} />
                     <span className="slbl" style={{ marginBottom: 0 }}>Niche Identified</span>
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 900 }}>{b.kw}</div>
                  <div className="h-stack" style={{ gap: 'var(--s4)', marginTop: 4 }}>
                    <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--accent)' }}>{b.opp.toFixed(1)} Score</span>
                    <span style={{ fontSize: 12, color: 'var(--muted)' }}>{b.vg.toFixed(2)} Viral Gap</span>
                  </div>
                </div>

                {/* 2. Strategy Memo */}
                <div className="v-stack" style={{ gap: 'var(--s2)', padding: 'var(--s3)', background: 'var(--elevated)', borderRadius: 'var(--r2)', border: '1px dashed var(--border)' }}>
                   <div style={{ fontSize: 11, fontWeight: 900, color: 'var(--dim)' }}>STRATEGY MEMO</div>
                   <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5 }}>
                      Target small channels winning big. Replicate the listicle format with "Secrets" hooks.
                   </div>
                </div>

                {/* 3. Actions */}
                <div className="h-stack" style={{ justifyContent: 'flex-end', gap: 'var(--s3)' }}>
                  <button className="btn sim" style={{ padding: '12px 24px', fontSize: 14 }} onClick={() => navigate('/production', { state: { kw: b.kw } })}>🎬 Produce</button>
                  <button className="btn s" style={{ padding: '12px 18px' }} onClick={() => removeNiche(b.kw)}>🗑️</button>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
