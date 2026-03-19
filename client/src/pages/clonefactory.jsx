import React, { useState, useEffect } from 'react'
import { useYouTube } from '../hooks/useYouTube'
import { useAppStore } from '../store/useAppStore'

export default function CloneFactory() {
  const { getChannelBlueprint, chanStats } = useYouTube()
  const { toast, setLoading } = useAppStore()
  const [handle, setHandle] = useState('')
  const [channels, setChannels] = useState([])
  const [activeBlueprint, setActiveBlueprint] = useState(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    fetch('/api/data/clones')
      .then(res => res.json())
      .then(data => setChannels(Array.isArray(data) ? data : []))
      .catch(e => console.error('Failed to fetch clones', e))
  }, [])

  async function deploy(s) {
    const newItem = {
      name: s.idea,
      subs: '—',
      views: 'Calculating...',
      signal: '⚠️ New Clone',
      type: s.type
    }
    toast(`Deploying ${s.type} clone...`, 'ok')
    try {
      const res = await fetch('/api/data/clones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem)
      })
      const saved = await res.json()
      setChannels(prev => [saved, ...prev])
    } catch (e) { toast('Save failed', 'e') }
  }

  async function extract() {
    if (!handle.trim()) { toast('Enter Channel ID', 'e'); return }
    setBusy(true); setLoading(true)
    try {
      const blueprint = await getChannelBlueprint(handle)
      setActiveBlueprint({ id: handle, ...blueprint })
      toast('Blueprint Extracted', 'ok')
    } catch (e) { toast(e.message, 'e') }
    finally { setBusy(false); setLoading(false) }
  }

  return (
    <div className="page fade-in">
      <div style={{ marginBottom: 'var(--s10)' }}>
        <h2 style={{ fontFamily: 'var(--fd)', fontSize: 32, fontWeight: 900, color: 'var(--text)', marginBottom: 'var(--s2)', letterSpacing: '-0.5px' }}>
          Clone Factory
        </h2>
        <p style={{ fontSize: 16, color: 'var(--muted)', maxWidth: 600, lineHeight: 1.6 }}>
          Systematically replicate proven content models. Deconstruct viral blueprints and scale formulas across multiple audiences and niches.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr', gap: 'var(--s8)', alignItems: 'start' }}>
        {/* Left: Input & Blueprint */}
        <div className="v-stack" style={{ gap: 'var(--s6)' }}>
          <div className="card" style={{ padding: 'var(--s6)', background: 'var(--elevated)', borderRadius: 'var(--r3)' }}>
            <div className="slbl">Channel Blueprint Extractor</div>
            <div className="v-stack" style={{ gap: 'var(--s4)' }}>
              <input className="inp" value={handle} onChange={e => setHandle(e.target.value)}
                placeholder="Channel ID (UC...)" onKeyDown={e => e.key === 'Enter' && extract()} />
              <button className="btn fac" style={{ width: '100%' }} onClick={extract} disabled={busy}>
                {busy ? '🧬 Analyzing DNA…' : '🧪 Extract Blueprint'}
              </button>
            </div>
          </div>

          {activeBlueprint && (
            <div className="card fade-in" style={{ padding: 'var(--s6)', borderRadius: 'var(--r3)', borderLeft: '4px solid var(--accent)' }}>
              <div className="slbl">Current Blueprint</div>
              <div className="v-stack" style={{ gap: 'var(--s5)' }}>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--dim)', textTransform: 'uppercase', marginBottom: 'var(--s2)' }}>Top Topics</div>
                  <div className="h-stack" style={{ flexWrap: 'wrap', gap: '8px' }}>
                    {activeBlueprint.topics.map(t => <span key={t} className="chip">{t}</span>)}
                  </div>
                </div>
                <div className="h-stack" style={{ justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--dim)', textTransform: 'uppercase' }}>Primary Format</div>
                    <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--accent)' }}>{activeBlueprint.format}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--dim)', textTransform: 'uppercase' }}>Frequency</div>
                    <div style={{ fontWeight: 800, fontSize: 15 }}>{activeBlueprint.frequency} vids/wk</div>
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--dim)', textTransform: 'uppercase', marginBottom: 'var(--s2)' }}>Title Hooks</div>
                  <div className="v-stack" style={{ gap: '4px' }}>
                    {activeBlueprint.hooks.map((h, i) => (
                      <div key={i} style={{ fontSize: 12, color: 'var(--muted)', background: 'var(--bg)', padding: '6px 12px', borderRadius: 'var(--r1)' }}>
                        "{h}..."
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Opportunities & Dashboard */}
        <div className="v-stack" style={{ gap: 'var(--s8)' }}>
          {activeBlueprint ? (
            <div className="v-stack fade-in" style={{ gap: 'var(--s6)' }}>
              <div className="slbl">Clone Opportunities</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--s4)' }}>
                {activeBlueprint.suggestions.map((s, i) => (
                  <div key={i} className="card hoverable" style={{ padding: 'var(--s5)', borderRadius: 'var(--r2)', background: 'var(--bg)' }}>
                    <div className="pill" style={{ marginBottom: 'var(--s2)', background: 'var(--adim)', color: 'var(--accent)', fontSize: 9 }}>{s.type}</div>
                    <div style={{ fontWeight: 900, fontSize: 15, marginBottom: 'var(--s2)', lineHeight: 1.3 }}>{s.idea}</div>
                    <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.5 }}>{s.desc}</div>
                    <button className="btn s" style={{ marginTop: 'var(--s4)', width: '100%' }} 
                      onClick={() => deploy(s)}>
                      Deploy Clone
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="card" style={{ padding: 'var(--s10)', textAlign: 'center', border: '1px dashed var(--border)', background: 'transparent' }}>
              <div style={{ fontSize: 40, marginBottom: 'var(--s4)' }}>🧬</div>
              <h3 style={{ fontFamily: 'var(--fd)', fontWeight: 800 }}>Blueprint Engine Idle</h3>
              <p style={{ fontSize: 13, color: 'var(--dim)', marginTop: 'var(--s2)' }}>Extract a winning channel blueprint to see scale opportunities.</p>
            </div>
          )}

          <div className="v-stack" style={{ gap: 'var(--s4)', marginTop: 'var(--s6)' }}>
            <div className="slbl">Multi-Channel Network Dashboard</div>
            <div className="card" style={{ padding: 'var(--s6)', borderRadius: 'var(--r3)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ textAlign: 'left', fontSize: 10, color: 'var(--dim)', textTransform: 'uppercase', letterSpacing: 1 }}>
                    <th style={{ paddingBottom: 'var(--s4)' }}>Channel Name</th>
                    <th style={{ paddingBottom: 'var(--s4)' }}>Subs</th>
                    <th style={{ paddingBottom: 'var(--s4)' }}>Avg Views</th>
                    <th style={{ paddingBottom: 'var(--s4)' }}>Signal</th>
                    <th style={{ paddingBottom: 'var(--s4)' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {channels.map(c => (
                    <tr key={c.id} style={{ borderTop: '1px solid var(--border)', fontSize: 13 }}>
                      <td style={{ padding: 'var(--s4) 0', fontWeight: 800 }}>{c.name}</td>
                      <td>{c.subs}</td>
                      <td>{c.views}</td>
                      <td>
                        <span className="pill" style={{ background: c.signal.includes('🔥') ? 'var(--hdim)' : 'var(--adim)', color: c.signal.includes('🔥') ? 'var(--hot)' : 'var(--accent)' }}>
                          {c.signal}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button className="btn s" onClick={() => setHandle(c.id)}>blueprint</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
