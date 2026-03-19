import React from 'react'

const GAPS = [
  { topic: 'Dark Stoicism', gap: 9.2, vel: '4.2K/hr', sat: 'Low', color: 'var(--accent)' },
  { topic: 'AI for Seniors', gap: 8.7, vel: '1.1K/hr', sat: 'V. Low', color: 'var(--purple)' },
  { topic: 'Forgotten Crusades', gap: 8.4, vel: '2.8K/hr', sat: 'Low', color: 'var(--green)' },
  { topic: 'The Science of Luck', gap: 7.9, vel: '950/hr', sat: 'Med', color: 'var(--yellow)' },
  { topic: 'Solo Dev Logs (AI)', gap: 7.5, vel: '1.4K/hr', sat: 'Med', color: 'var(--orange)' },
]

export default function Viral() {
  return (
    <div style={{ padding: 22 }}>
      <div className="tb" style={{ position: 'relative', background: 'transparent', border: 'none', padding: '0 0 20px 0' }}>
        <div className="tb-l">
          <h1>Viral Gaps</h1>
          <p>High demand topics with critically low content supply.</p>
        </div>
      </div>

      <div className="pred-grid">
        {GAPS.map((g, i) => (
          <div key={i} className="pred-card" style={{ borderLeft: `3px solid ${g.color}` }}>
            <div className="pc-kw">{g.topic}</div>
            <div className="pc-prob" style={{ color: g.color }}>{g.gap.toFixed(1)}</div>
            <div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '12px' }}>Viral Gap Score</div>
            <div className="v-stack" style={{ gap: '4px', fontSize: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Velocity</span><span className="ca">{g.vel}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Saturation</span><span className="chot">{g.sat}</span></div>
            </div>
            <button className="btn s" style={{ width: '100%', marginTop: '16px' }}>Analyze Deeply</button>
          </div>
        ))}
      </div>
    </div>
  )
}
