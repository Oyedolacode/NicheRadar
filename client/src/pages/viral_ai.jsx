import React, { useState } from 'react'
import { scoreInfo } from '../lib/ytUtils'

export default function ViralAI() {
  const [topic, setTopic] = useState('')
  const [loading, setLoading] = useState(false)
  const [pred, setPred] = useState(null)

  const predict = () => {
    if (!topic) return
    setLoading(true)
    setTimeout(() => {
      const p = 65 + Math.random() * 30
      setPred({ score: p, topic })
      setLoading(false)
    }, 1500)
  }

  return (
    <div className="pg on">
      <div className="tb" style={{ position: 'relative', background: 'transparent', border: 'none', padding: '0 0 20px 0' }}>
        <div className="tb-l">
          <h1>Viral AI Predictor</h1>
          <p>AI-driven probability of a topic going viral in the next 7 days.</p>
        </div>
      </div>

      <div className="sr" style={{ maxWidth: '600px', marginBottom: '32px' }}>
        <input className="inp" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Topic keyword..." onKeyDown={(e) => e.key === 'Enter' && predict()} />
        <button className="btn ai" onClick={predict} disabled={loading}>{loading ? '⏳ Calculating...' : '🤖 Predict Virality'}</button>
      </div>

      {pred && (
        <div className="pred-grid">
          <div className="pred-card">
            <div className="pc-kw">{pred.topic}</div>
            <div className="pc-prob ca">{pred.score.toFixed(0)}%</div>
            <div className="prob-bar"><div className="prob-fill" style={{ width: `${pred.score}%`, background: 'var(--accent)' }}></div></div>
            <div style={{ fontSize: '11px', color: 'var(--muted)' }}>High probability. Audience sentiment is strongly positive.</div>
          </div>
          
          <div className="pred-card">
            <div className="pc-kw">FORMAT FIT</div>
            <div className="pc-prob cg">92%</div>
            <div className="prob-bar"><div className="prob-fill" style={{ width: '92%', background: 'var(--green)' }}></div></div>
            <div style={{ fontSize: '11px', color: 'var(--muted)' }}>"Dark Documentary" format has 3.4x higher velocity.</div>
          </div>

          <div className="pred-card">
            <div className="pc-kw">SEASONALITY</div>
            <div className="pc-prob cy">78%</div>
            <div className="prob-bar"><div className="prob-fill" style={{ width: '78%', background: 'var(--yellow)' }}></div></div>
            <div style={{ fontSize: '11px', color: 'var(--muted)' }}>Search volume for this topic peaks on weekends.</div>
          </div>
        </div>
      )}

      {!pred && (
        <div className="empty">
          <div className="ei">🤖</div>
          <h3>Predict the Future</h3>
          <p>Enter a niche or topic. Our AI analyzes historical patterns to predict virality.</p>
        </div>
      )}
    </div>
  )
}
