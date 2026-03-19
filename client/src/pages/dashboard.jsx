import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'
import { scoreInfo } from '../lib/formulas'

export default function Dashboard() {
  const { lastExplorerResult, toast } = useAppStore()
  const navigate = useNavigate()

  // Recommendation engine (80/20 rule: show the best opportunity)
  const rec = lastExplorerResult?.enriched?.[0] || null
  const si = rec ? scoreInfo(lastExplorerResult.opp) : null

  return (
    <div className="page fade-in">
      <header style={{ marginBottom: 'var(--s8)' }}>
        <h1 style={{ fontSize: 32, fontWeight: 900, letterSpacing: '-1px', margin: 0 }}>Command Center</h1>
        <p style={{ color: 'var(--muted)', fontSize: 14 }}>Welcome back. Here is your growth roadmap for today.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 'var(--s8)' }}>
        {/* SECTION A: WHAT TO DO NEXT */}
        <div className="v-stack" style={{ gap: 'var(--s6)' }}>
          <div className="card shadow-lg" style={{ 
            background: 'linear-gradient(135deg, rgba(var(--accent-rgb), 0.15), rgba(112, 0, 255, 0.1))',
            border: '2px solid var(--accent)',
            padding: 'var(--s8)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ position: 'absolute', top: -20, right: -20, fontSize: 120, opacity: 0.05, pointerEvents: 'none' }}>🎯</div>
            <div className="tag" style={{ background: 'var(--accent)', color: '#000', fontWeight: 900, marginBottom: 'var(--s4)', borderRadius: 4 }}>TOP RECOMMENDATION</div>
            
            {rec ? (
              <>
                <h2 style={{ fontSize: 28, fontWeight: 900, marginBottom: 'var(--s2)', lineHeight: 1.1 }}>
                  Create: "{rec.title.slice(0, 60)}..."
                </h2>
                <div className="h-stack" style={{ gap: 'var(--s6)', marginBottom: 'var(--s6)' }}>
                  <div className="v-stack" style={{ gap: 0 }}>
                    <span className="slbl">PROVEN TOPIC</span>
                    <span style={{ fontSize: 16, fontWeight: 700 }}>{lastExplorerResult.kw}</span>
                  </div>
                  <div className="v-stack" style={{ gap: 0 }}>
                    <span className="slbl">EXPECTED VIEWS</span>
                    <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--green)' }}>120k — 300k</span>
                  </div>
                  <div className="v-stack" style={{ gap: 0 }}>
                    <span className="slbl">CONFIDENCE</span>
                    <span style={{ fontSize: 16, fontWeight: 700, color: si.color }}>HIGH</span>
                  </div>
                </div>
                <div className="h-stack" style={{ gap: 'var(--s3)' }}>
                  <button className="btn sim" onClick={() => navigate('/production')}>🎬 Generate Script</button>
                  <button className="btn s" onClick={() => navigate('/opportunities')}>🔍 View Analytics</button>
                </div>
              </>
            ) : (
              <div className="v-stack" style={{ alignItems: 'center', padding: 'var(--s6) 0', textAlign: 'center' }}>
                <div style={{ fontSize: 48, marginBottom: 'var(--s4)' }}>🧬</div>
                <h3 style={{ margin: 0 }}>No Strategy Found</h3>
                <p style={{ color: 'var(--muted)', maxWidth: 300 }}>Run a niche scan in the Opportunities hub to generate your first growth roadmap.</p>
                <button className="btn sim" onClick={() => navigate('/opportunities')}>Scan New Niche</button>
              </div>
            )}
          </div>

          {/* SECTION B: RECENT VIRAL VIDEOS */}
          <div className="card">
            <div className="ch">
              <div className="ct">Signals from the Field</div>
              <div className="cm">Recent viral videos in your niche</div>
            </div>
            <div style={{ padding: 'var(--s4)' }} className="v-stack">
              {(lastExplorerResult?.enriched || []).slice(0, 3).map(v => (
                <div key={v.id} className="h-stack" style={{ padding: 'var(--s3)', borderBottom: '1px solid var(--border)', gap: 'var(--s4)' }}>
                  <img src={v.thumb} style={{ width: 100, borderRadius: 'var(--r2)' }} alt="" />
                  <div className="v-stack" style={{ gap: 2, flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{v.title.slice(0, 50)}...</div>
                    <div style={{ fontSize: 11, color: 'var(--muted)' }}>{v.views.toLocaleString()} views • {v.chan}</div>
                  </div>
                  <div className="tag" style={{ background: 'var(--adim)', color: 'var(--accent)' }}>9.2 Opp</div>
                </div>
              ))}
              {!lastExplorerResult && <div style={{ textAlign: 'center', padding: 'var(--s8)', color: 'var(--dim)' }}>Scan a niche to see viral signals.</div>}
            </div>
          </div>
        </div>

        {/* SIDEBAR DASHBOARD SECTIONS */}
        <div className="v-stack" style={{ gap: 'var(--s8)' }}>
          {/* SECTION C: TRENDING OPPORTUNITIES */}
          <div className="card">
            <div className="ch"><div className="ct">🔥 High Signal Niches</div></div>
            <div style={{ padding: 'var(--s4)' }} className="v-stack">
              {[
                { kw: 'AI Study Tools', opp: 9.2, trend: 'Rising' },
                { kw: 'History Shorts', opp: 8.7, trend: 'Exploding' },
                { kw: 'Stoic Habits',   opp: 7.9, trend: 'Steady' },
              ].map(n => (
                <div key={n.kw} className="h-stack" style={{ justifyContent: 'space-between', padding: 'var(--s3)', borderBottom: '1px solid var(--border)' }}>
                  <div className="v-stack" style={{ gap: 0 }}>
                    <span style={{ fontWeight: 700, fontSize: 14 }}>{n.kw}</span>
                    <span style={{ fontSize: 10, color: 'var(--muted)' }}>{n.trend}</span>
                  </div>
                  <div style={{ fontWeight: 800, color: 'var(--accent)' }}>{n.opp}</div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION D: CHANNEL SNAPSHOT */}
          <div className="card">
            <div className="ch"><div className="ct">📈 Pulse</div></div>
            <div style={{ padding: 'var(--s6)' }} className="v-stack">
              <div className="h-stack" style={{ justifyContent: 'space-between', marginBottom: 'var(--s4)' }}>
                <div className="v-stack" style={{ gap: 0 }}>
                  <span className="slbl">Subscribers</span>
                  <span style={{ fontSize: 18, fontWeight: 800 }}>12,400</span>
                </div>
                <div className="tag" style={{ color: 'var(--green)' }}>+4.2%</div>
              </div>
              <div className="h-stack" style={{ justifyContent: 'space-between' }}>
                <div className="v-stack" style={{ gap: 0 }}>
                  <span className="slbl">Views (7d)</span>
                  <span style={{ fontSize: 18, fontWeight: 800 }}>320k</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
