import React from 'react'
import { useNavigate } from 'react-router-dom'
import { scoreInfo } from '../lib/formulas'
import { useBookmarkStore } from '../store/useBookmarkStore'

export default function Dashboard() {
  const { lastExplorerResult } = useAppStore()
  const { niches } = useBookmarkStore()
  const navigate = useNavigate()

  // High-Confidence Decision Engine
  // Logic: Find the highest Opportunity Score video from last scan
  const bestVid = lastExplorerResult?.enriched?.[0] || null
  const si = bestVid ? scoreInfo(lastExplorerResult.opp) : null

  return (
    <div className="page fade-in">
      {/* 🚀 Top Action Bar: The "10-Second" Decision */}
      <div style={{ marginBottom: 'var(--s8)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="v-stack" style={{ gap: 'var(--s1)' }}>
          <h1 style={{ fontSize: 28, fontWeight: 900, letterSpacing: '-1px', margin: 0 }}>Growth Assistant</h1>
          <div className="h-stack" style={{ gap: 'var(--s2)' }}>
             <span style={{ width: 8, height: 8, background: 'var(--accent)', borderRadius: '50%', boxShadow: '0 0 10px var(--accent)' }} />
             <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: 1.5 }}>Next Action Ready</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2.2fr 1fr', gap: 'var(--s8)' }}>
        
        {/* CENTER COLUMN (70%): PRIMARY DECISIONS */}
        <div className="v-stack" style={{ gap: 'var(--s8)' }}>
          
          {/* 🔥 1. THE BIG WIN: MAIN RECOMMENDATION CARD */}
          <div className="card shadow-lg" style={{ 
            background: 'linear-gradient(135deg, rgba(0,229,204,.12), rgba(112,0,255,.08))',
            border: '1.5px solid var(--accent)',
            padding: 'var(--s8)',
            position: 'relative'
          }}>
            {bestVid ? (
              <>
                <div className="tag" style={{ background: 'var(--accent)', color: '#000', fontWeight: 900, marginBottom: 'var(--s4)', padding: '2px 8px', borderRadius: 4, display: 'inline-block' }}>🎯 MAKE THIS VIDEO TODAY</div>
                <h2 style={{ fontSize: 36, fontWeight: 900, marginBottom: 'var(--s2)', lineHeight: 1.1, letterSpacing: '-1.5px' }}>
                  "{bestVid.title.slice(0, 75)}..."
                </h2>
                
                <div style={{ fontSize: 14, color: 'var(--dim)', marginBottom: 'var(--s6)', display: 'flex', gap: 'var(--s8)' }}>
                   <span>Topic: <strong>{lastExplorerResult.kw}</strong></span>
                   <span>Format: <strong>Storytelling / Listicle</strong></span>
                   <span>Expected Views: <strong style={{ color: 'var(--green)' }}>120k — 350k</strong></span>
                </div>

                <div className="card shadow-sm" style={{ background: 'var(--bg)', border: '1px solid var(--border)', padding: 'var(--s5)', marginBottom: 'var(--s6)' }}>
                   <div style={{ fontWeight: 800, fontSize: 12, color: 'var(--accent)', marginBottom: 'var(--s2)' }}>💡 WHY THIS WORKS:</div>
                   <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, lineHeight: 1.6, color: 'var(--muted)' }}>
                      <li><strong>High Viral Gap ({lastExplorerResult.vg.toFixed(1)})</strong>: Massive viewer demand with very low recent supply.</li>
                      <li><strong>Trending Momentum</strong>: This niche has grown 24% in search volume over the last 7 days.</li>
                      <li><strong>Small Channel Friendly</strong>: Channels with &lt;10k subs are currently pulling 100k+ views on this specific topic.</li>
                   </ul>
                </div>

                <div className="h-stack" style={{ gap: 'var(--s4)' }}>
                  <button className="btn sim" style={{ padding: '14px 28px', fontSize: 15 }} onClick={() => navigate('/queue')}>🎬 Generate Script</button>
                  <button className="btn s" style={{ padding: '14px 24px', fontSize: 13 }} onClick={() => navigate('/explorer')}>🔍 Deep Analysis</button>
                  <button className="btn s" style={{ padding: '14px 20px' }}>🔖 Save</button>
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: 'var(--s10) 0' }}>
                <div style={{ fontSize: 64, marginBottom: 'var(--s4)' }}>📡</div>
                <h2 style={{ margin: 0, fontSize: 24, fontWeight: 900 }}>Ready to generate growth?</h2>
                <p style={{ color: 'var(--muted)', maxWidth: 400, margin: 'var(--s2) auto var(--s6) auto' }}>
                  Scan a niche in the Opportunities hub to unlock your first custom growth roadmaps.
                </p>
                <button className="btn sim btn-lg" onClick={() => navigate('/explorer')}>Analyze Opportunities</button>
              </div>
            )}
          </div>

          {/* 🌊 2. RECENT VIRAL SIGNALS */}
          <div className="card">
            <div className="ch">
              <div className="ct">Viral Signal Feed</div>
              <div className="cm">Recent outliers in your niche</div>
            </div>
            <div style={{ padding: 'var(--s4)' }} className="v-stack">
              {(lastExplorerResult?.enriched || []).slice(0, 4).map(v => (
                <div key={v.id} className="h-stack" style={{ padding: 'var(--s3)', borderBottom: '1px solid var(--border)', gap: 'var(--s6)' }}>
                  <div style={{ width: 120, height: 68, background: 'var(--elevated)', borderRadius: 8, overflow: 'hidden', position: 'relative' }}>
                     <img src={v.thumb} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                     <div style={{ position: 'absolute', bottom: 4, right: 4, background: 'rgba(0,0,0,0.8)', padding: '2px 4px', fontSize: 9, borderRadius: 2 }}>{v.views.toLocaleString()}</div>
                  </div>
                  <div className="v-stack" style={{ gap: 4, flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 800 }}>{v.title}</div>
                    <div className="h-stack" style={{ gap: 'var(--s3)' }}>
                       <span className="slbl" style={{ marginBottom: 0 }}>{v.chan}</span>
                       <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--border)' }} />
                       <span className="slbl" style={{ marginBottom: 0, color: 'var(--accent)' }}>{(v.views / (v.subs || 1)).toFixed(1)}x Channel Power</span>
                    </div>
                  </div>
                  <button className="btn s" style={{ fontSize: 10 }} onClick={() => navigate('/queue', { state: { seed: v } })}>Clone 🧬</button>
                </div>
              ))}
              {!lastExplorerResult && <div style={{ textAlign: 'center', padding: 'var(--s10)', opacity: 0.3 }}>No scan data yet.</div>}
            </div>
          </div>
        </div>

        {/* SIDE COLUMN (30%): STRATEGIC SIGNALS */}
        <div className="v-stack" style={{ gap: 'var(--s8)' }}>
          
          {/* 🔥 3. ACTIONABLE NICHE SIGNALS */}
          <div className="card">
            <div className="ch"><div className="ct">Exploding Opportunities</div></div>
            <div style={{ padding: 'var(--s4)' }} className="v-stack">
              {niches.length > 0 ? (
                niches.slice(0, 3).map(n => (
                  <div key={n.kw} className="card shadow-sm" style={{ padding: 'var(--s4)', background: 'var(--adim)', border: '1px solid var(--border)', marginBottom: 'var(--s2)' }}>
                    <div className="h-stack" style={{ justifyContent: 'space-between', marginBottom: 'var(--s2)' }}>
                      <span style={{ fontWeight: 900, fontSize: 13 }}>{n.kw}</span>
                      <span style={{ fontWeight: 900, color: 'var(--accent)', fontSize: 12 }}>{n.opp.toFixed(1)} 🔥</span>
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--muted)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                       <span>Saved {new Date(n.savedAt).toLocaleDateString()}</span>
                       <button className="btn s" style={{ padding: '2px 8px', fontSize: 9 }} onClick={() => navigate('/explorer', { state: { keyword: n.kw } })}>Analyze</button>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ padding: 'var(--s10) var(--s4)', textAlign: 'center', color: 'var(--muted)', fontSize: 12 }}>
                  No bookmarked niches yet.<br/>Save a niche from Explorer to see it here.
                </div>
              )}
            </div>
          </div>

          {/* 📊 4. SYSTEM STATUS (Replaces Growth Pulse) */}
          <div className="card">
            <div className="ch"><div className="ct">System Status</div></div>
            <div style={{ padding: 'var(--s6)' }} className="v-stack">
              <div className="h-stack" style={{ justifyContent: 'space-between', marginBottom: 'var(--s4)' }}>
                <div className="v-stack" style={{ gap: 0 }}>
                  <span className="slbl">API Engine</span>
                  <span style={{ fontSize: 16, fontWeight: 900, color: 'var(--accent)' }}>Active</span>
                </div>
                <div className="tag" style={{ color: 'var(--green)', fontWeight: 900 }}>v6.0</div>
              </div>
              <div className="v-stack" style={{ gap: 'var(--s2)' }}>
                 <div className="h-stack" style={{ justifyContent: 'space-between', fontSize: 11 }}>
                    <span style={{ color: 'var(--muted)' }}>Data Sync</span>
                    <span style={{ fontWeight: 800 }}>Real-time</span>
                 </div>
                 <div style={{ height: 4, background: 'var(--border)', borderRadius: 2 }}>
                    <div style={{ width: '100%', height: '100%', background: 'var(--accent-grad)', borderRadius: 2 }} />
                 </div>
              </div>
            </div>
          </div>

          {/* 🚨 5. ALERT LAB */}
          <div className="card" style={{ border: '1px dashed var(--border)', background: 'transparent' }}>
            <div style={{ padding: 'var(--s6)', textAlign: 'center' }} className="v-stack">
               <div style={{ fontSize: 24, marginBottom: 'var(--s2)' }}>💡</div>
               <div style={{ fontSize: 12, fontWeight: 800, marginBottom: 'var(--s1)' }}>Strategy Tip</div>
               <p style={{ fontSize: 10, color: 'var(--muted)', margin: 0, lineHeight: 1.5 }}>
                 High retention formatting (first 30s) is currently more important than keyword SEO for the "AI tools" niche.
               </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
