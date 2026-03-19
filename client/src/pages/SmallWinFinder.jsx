import React, { useState } from 'react'
import { useYouTube } from '../hooks/useYouTube'
import { useAppStore } from '../store/useAppStore'
import { fmt } from '../lib/formulas'

export default function SmallWinFinder() {
  const { search, getChannelAnalysis } = useYouTube()
  const { toast, setLoading } = useAppStore()
  const [topic, setTopic] = useState('')
  const [results, setResults] = useState([])
  const [busy, setBusy] = useState(false)
  const [selected, setSelected] = useState(null)

  async function find() {
    if (!topic.trim()) { toast('Enter a topic', 'e'); return }
    setBusy(true); setLoading(true); setResults([])
    try {
      const sData = await search(topic, 15)
      const chanIds = [...new Set((sData.items || []).map(i => i.snippet?.channelId).filter(Boolean))]
      
      const analyses = await Promise.all(chanIds.slice(0, 10).map(async id => {
        try { return await getChannelAnalysis(id) } catch { return null }
      }))

      const filtered = analyses.filter(Boolean).map(a => {
        let signal = '⚠️ Medium'
        if (a.ratio > 5) signal = '🚀 Strong'
        if (a.ratio > 10 && a.consistency > 0.4) signal = '🔥 Exploding'
        return { ...a, signal }
      })

      setResults(filtered)
      toast(`Analyzed ${filtered.length} channels`, 'ok')
    } catch (e) { toast(e.message, 'e') }
    finally { setBusy(false); setLoading(false) }
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontFamily: 'var(--fd)', fontSize: 28, fontWeight: 900, color: 'var(--text)', marginBottom: 8 }}>
          Winning Channel Finder
        </h2>
        <p style={{ fontSize: 14, color: 'var(--muted)', maxWidth: 600, lineHeight: 1.6 }}>
          Detect small channels getting 10x+ more views than subscribers. Find your next clone opportunity.
        </p>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 32, maxWidth: 800 }}>
        <input className="inp" style={{ flex: 1 }} value={topic} onChange={e => setTopic(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && find()} placeholder="Topic… AI, Stoicism, Minecraft" />
        <button className="btn hot" onClick={find} disabled={busy}>
          {busy ? '⏳ Scanning…' : '📡 Find Winners'}
        </button>
      </div>

      {results.length === 0 && !busy && (
        <div className="empty">
          <div className="ei">🎯</div>
          <h3>Find the Goldmines</h3>
          <p>Search a niche to identify small channels performing like giants.</p>
        </div>
      )}

      {results.length > 0 && (
        <div className="card" style={{ padding: 0 }}>
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: 'var(--elevated)', borderBottom: '1px solid var(--border)' }}>
                            {['Channel', 'Subs', 'Avg Views', 'Ratio', 'Consistency', 'Signal'].map(h => (
                                <th key={h} style={{ padding: 12, textAlign: 'left', fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase' }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {results.map(r => (
                            <tr key={r.channel.id} style={{ borderBottom: '1px solid var(--border)', cursor: 'pointer' }} onClick={() => setSelected(r)}>
                                <td style={{ padding: 12 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--border)', backgroundImage: `url(${r.channel.snippet?.thumbnails?.default?.url})`, backgroundSize: 'cover' }} />
                                        <div style={{ fontWeight: 700, fontSize: 13 }}>{r.channel.snippet?.title}</div>
                                    </div>
                                </td>
                                <td style={{ padding: 12, fontFamily: 'var(--fm)', fontSize: 12 }}>{fmt(r.subs)}</td>
                                <td style={{ padding: 12, fontFamily: 'var(--fm)', fontSize: 12 }}>{fmt(r.avgViews)}</td>
                                <td style={{ padding: 12, fontFamily: 'var(--fm)', fontSize: 13, fontWeight: 800, color: r.ratio > 5 ? 'var(--accent)' : 'var(--text)' }}>{r.ratio.toFixed(1)}x</td>
                                <td style={{ padding: 12, fontFamily: 'var(--fm)', fontSize: 12 }}>{Math.round(r.consistency * 100)}%</td>
                                <td style={{ padding: 12 }}>
                                    <span className={`pill ${r.ratio > 10 ? 'hot' : r.ratio > 5 ? 'v-high' : ''}`} style={{ fontSize: 9 }}>
                                        {r.signal}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      )}

      {selected && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'grid', placeItems: 'center', padding: 20 }}>
          <div className="card" style={{ width: '100%', maxWidth: 700, position: 'relative', padding: 24 }}>
            <button onClick={() => setSelected(null)} style={{ position: 'absolute', top: 15, right: 15, background: 'none', border: 'none', color: 'var(--muted)', fontSize: 22, cursor: 'pointer' }}>×</button>
            <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--border)', backgroundImage: `url(${selected.channel.snippet?.thumbnails?.high?.url})`, backgroundSize: 'cover' }} />
              <div>
                <h3 style={{ fontSize: 24, fontWeight: 900, color: 'var(--accent)', marginBottom: 4 }}>{selected.channel.snippet?.title}</h3>
                <div style={{ display: 'flex', gap: 8 }}>
                  <span className="pill">Age: {selected.ageDays}d</span>
                  <span className="pill">Ratio: {selected.ratio.toFixed(1)}x</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div className="card" style={{ padding: 15, background: 'var(--elevated)' }}>
                    <div className="slbl" style={{ marginBottom: 10 }}>Analysis</div>
                    <ul style={{ listStyle: 'none', fontSize: 12, lineHeight: 1.8, color: 'var(--muted)' }}>
                        <li>• {selected.ratio > 5 ? '🔥 Extreme algorithm favorite' : '✅ Healthy reach'}</li>
                        <li>• {selected.consistency > 0.5 ? '⭐ High performance consistency' : '📈 Volatile growth'}</li>
                        <li>• {selected.ageDays < 365 ? '🚀 New channel winner' : '🏛️ Established brand'}</li>
                    </ul>
                </div>
                <div className="card" style={{ padding: 15, border: '1px solid var(--accent)' }}>
                    <div className="slbl" style={{ marginBottom: 10 }}>Clone Strategy</div>
                    <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>"{selected.videos[0]?.title || 'Idea generation needed'}"</div>
                    <button className="btn hot" style={{ width: '100%' }} onClick={() => toast('Cloning strategy...', 'ok')}>Clon Strategy</button>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
