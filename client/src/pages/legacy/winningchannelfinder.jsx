import React, { useState } from 'react'
import { useYouTube } from '../hooks/useYouTube'
import { useAppStore } from '../store/useAppStore'

export default function WinningChannelFinder() {
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
        
        // Apply User Filters Logic
        const isFastGrowing = a.ageDays < 180 && a.avgViews > 100000
        const isSmallWin = a.subs < 100000 && a.avgViews > 500000 && a.consistency > 0.5
        const isAlgoFav = a.ratio > 5

        return { ...a, signal, isFastGrowing, isSmallWin, isAlgoFav }
      })

      setResults(filtered)
      toast(`Analyzed ${filtered.length} channels`, 'ok')
    } catch (e) { toast(e.message, 'e') }
    finally { setBusy(false); setLoading(false) }
  }

  return (
    <div className="page fade-in">
      <div style={{ marginBottom: 'var(--s10)' }}>
        <h2 style={{ fontFamily: 'var(--fd)', fontSize: 32, fontWeight: 900, color: 'var(--text)', marginBottom: 'var(--s2)', letterSpacing: '-0.5px' }}>
          Winning Channel Finder
        </h2>
        <p style={{ fontSize: 16, color: 'var(--muted)', maxWidth: 600, lineHeight: 1.6 }}>
          Detect high-growth micro-channels stealing the algorithm. Analyze views-to-subs ratios and consistency to find your next clone opportunity.
        </p>
      </div>

      <div className="h-stack" style={{ gap: 'var(--s4)', marginBottom: 'var(--s10)', maxWidth: 800 }}>
        <input className="inp" style={{ flex: 1 }} value={topic} onChange={e => setTopic(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && find()} placeholder="Topic… AI, Stoicism, Minecraft" />
        <button className="btn hot" onClick={find} disabled={busy}>
          {busy ? '⏳ Scanning…' : '📡 Find Winners'}
        </button>
      </div>

      {results.length === 0 && !busy && (
        <div className="empty fade-in" style={{ padding: 'var(--s12) var(--s6)' }}>
          <div className="ei">🎯</div>
          <h3>Find the Goldmines</h3>
          <p>Search a niche to identify small channels performing like giants.</p>
        </div>
      )}

      {results.length > 0 && (
        <div className="v-stack" style={{ gap: 'var(--s8)' }}>
          <div className="card" style={{ overflow: 'visible', background: 'transparent', border: 'none' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr 1.2fr 1fr 1fr 1.2fr', gap: 'var(--s4)', padding: '0 var(--s4) var(--s4)', borderBottom: '1px solid var(--border)', fontSize: 11, fontFamily: 'var(--fm)', color: 'var(--dim)', textTransform: 'uppercase', letterSpacing: 1 }}>
              <div>Channel</div>
              <div>Subs</div>
              <div>Avg Views</div>
              <div>Ratio</div>
              <div>Consistency</div>
              <div>Signal</div>
            </div>
            <div className="v-stack" style={{ gap: 'var(--s3)', marginTop: 'var(--s4)' }}>
              {results.map(r => (
                <div key={r.channel.id} className="card hoverable" onClick={() => setSelected(r)}
                  style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr 1.2fr 1fr 1fr 1.2fr', gap: 'var(--s4)', padding: 'var(--s4) var(--s5)', alignItems: 'center', cursor: 'pointer', borderRadius: 'var(--r3)' }}>
                  <div className="h-stack" style={{ gap: 'var(--s3)' }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--border)', backgroundImage: `url(${r.channel.snippet?.thumbnails?.default?.url})`, backgroundSize: 'cover' }} />
                    <div style={{ fontWeight: 800, fontSize: 15 }}>{r.channel.snippet?.title}</div>
                  </div>
                  <div style={{ fontFamily: 'var(--fm)', fontSize: 13, color: 'var(--text)' }}>{(r.subs / 1000).toFixed(1)}k</div>
                  <div style={{ fontFamily: 'var(--fm)', fontSize: 13, color: 'var(--text)' }}>{(r.avgViews / 1000).toFixed(1)}k</div>
                  <div style={{ fontFamily: 'var(--fm)', fontSize: 13, fontWeight: 800, color: r.ratio > 5 ? 'var(--accent)' : 'var(--text)' }}>{r.ratio.toFixed(1)}x</div>
                  <div style={{ fontFamily: 'var(--fm)', fontSize: 13, color: 'var(--text)' }}>{Math.round(r.consistency * 100)}%</div>
                  <div>
                    <span className="pill" style={{ background: r.signal.includes('🔥') ? 'var(--hdim)' : r.signal.includes('🚀') ? 'var(--adim)' : 'var(--elevated)', color: r.signal.includes('🔥') ? 'var(--hot)' : r.signal.includes('🚀') ? 'var(--accent)' : 'var(--muted)', fontSize: 10, padding: '4px 10px', borderRadius: 6 }}>
                      {r.signal}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {selected && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'grid', placeItems: 'center', padding: 'var(--s8)' }}>
          <div className="card fade-in" style={{ width: '100%', maxWidth: 800, background: 'var(--surface)', borderRadius: 'var(--r3)', border: '1px solid var(--border)', position: 'relative', padding: 'var(--s8)' }}>
            <button onClick={() => setSelected(null)} style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', color: 'var(--muted)', fontSize: 24, cursor: 'pointer' }}>×</button>
            <div className="h-stack" style={{ gap: 'var(--s5)', marginBottom: 'var(--s8)' }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--border)', backgroundImage: `url(${selected.channel.snippet?.thumbnails?.high?.url})`, backgroundSize: 'cover' }} />
              <div>
                <h3 style={{ fontSize: 28, fontWeight: 900, color: 'var(--accent)' }}>{selected.channel.snippet?.title}</h3>
                <div className="h-stack" style={{ gap: 'var(--s3)', marginTop: 'var(--s2)' }}>
                  <span className="pill">Age: {selected.ageDays}d</span>
                  <span className="pill">Consistency: {Math.round(selected.consistency * 100)}%</span>
                  <span className="pill">Ratio: {selected.ratio.toFixed(1)}x</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--s8)' }}>
              <div>
                <div className="slbl">Why This Channel is Winning</div>
                <div className="card" style={{ padding: 'var(--s5)', background: 'var(--elevated)', borderRadius: 'var(--r2)', lineHeight: 1.8, fontSize: 13 }}>
                  <ul style={{ listStyle: 'none' }}>
                    <li>• {selected.subs < 100000 ? 'Small channel' : 'Established brand'} ({Math.round(selected.subs / 1000)}k subs)</li>
                    <li>• {selected.ratio > 5 ? 'Extreme algorithm pull' : 'Healthy reach'} ({selected.ratio.toFixed(1)}x ratio)</li>
                    <li>• {selected.consistency > 0.5 ? 'Predictable virality' : 'High volatility'} ({Math.round(selected.consistency * 100)}% consistency)</li>
                    <li>• {selected.ageDays < 365 ? 'Rising star (Under 1yr)' : 'Veteran creator'}</li>
                  </ul>
                  <div style={{ marginTop: 'var(--s4)', color: 'var(--accent)', fontWeight: 800 }}>👉 {selected.signal} Signal Detected</div>
                </div>
              </div>
              <div>
                <div className="slbl">Clone Opportunity</div>
                <div className="card" style={{ padding: 'var(--s5)', background: 'linear-gradient(135deg,rgba(0,229,204,.05),transparent)', border: '1px solid rgba(0,229,204,.15)', borderRadius: 'var(--r2)' }}>
                  <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 'var(--s2)' }}>RECOMMENDED VIDEO IDEA</div>
                  <div style={{ fontSize: 16, fontWeight: 800, lineHeight: 1.4, marginBottom: 'var(--s4)' }}>
                    "{selected.videos[0]?.title || 'Topic Analysis Required'}"
                  </div>
                  <div className="v-stack" style={{ gap: 'var(--s2)' }}>
                    <div style={{ fontSize: 12 }}><strong>Best Format:</strong> Storytelling / List</div>
                    <div style={{ fontSize: 12 }}><strong>Targeting:</strong> {topic} gaps</div>
                  </div>
                  <button className="btn hot" style={{ width: '100%', marginTop: 'var(--s5)' }} onClick={() => toast('Cloning strategy to draft...', 'ok')}>Clon Strategy</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
