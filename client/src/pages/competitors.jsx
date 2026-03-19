import React from 'react'

export default function Competitors() {
  return (
    <div className="page fade-in">
      <header style={{ marginBottom: 'var(--s8)' }}>
        <h1 style={{ fontSize: 32, fontWeight: 900, letterSpacing: '-1px', margin: 0 }}>Competitor Studio</h1>
        <p style={{ color: 'var(--muted)', fontSize: 14 }}>Analyze winning channels and extract their high-performance blueprints.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 'var(--s6)', marginBottom: 'var(--s8)' }}>
        {[
          { name: 'AI Study Hub', subs: '42k', avgViews: '620k', signal: 'Exploding', color: 'var(--hot)' },
          { name: 'History Explained', subs: '120k', avgViews: '450k', signal: 'Steady', color: 'var(--accent)' },
          { name: 'Stoic Mindset', subs: '15k', avgViews: '210k', signal: 'Rising', color: 'var(--green)' },
        ].map(c => (
          <div key={c.name} className="card shadow-md" style={{ padding: 'var(--s6)' }}>
            <div className="h-stack" style={{ justifyContent: 'space-between', marginBottom: 'var(--s4)' }}>
              <div style={{ fontSize: 18, fontWeight: 900 }}>{c.name}</div>
              <div className="tag" style={{ background: 'var(--adim)', color: c.color, padding: '2px 8px', borderRadius: 4 }}>{c.signal}</div>
            </div>
            <div className="h-stack" style={{ gap: 'var(--s8)' }}>
              <div className="v-stack" style={{ gap: 0 }}><span className="slbl">SUBS</span><span style={{ fontWeight: 800 }}>{c.subs}</span></div>
              <div className="v-stack" style={{ gap: 0 }}><span className="slbl">AVG VIEWS</span><span style={{ fontWeight: 800 }}>{c.avgViews}</span></div>
            </div>
            <div style={{ marginTop: 'var(--s6)', borderTop: '1px solid var(--border)', paddingTop: 'var(--s4)' }}>
              <button className="btn s w-100" style={{ background: 'var(--elevated)' }}>View Blueprint 🧬</button>
            </div>
          </div>
        ))}
      </div>

      <div className="card shadow-md" style={{ background: 'var(--adim)', border: '1px solid var(--accent)', padding: 'var(--s6)' }}>
        <div className="h-stack" style={{ gap: 'var(--s4)', marginBottom: 'var(--s4)' }}>
          <div style={{ fontSize: 24 }}>🧠</div>
          <h3 style={{ margin: 0 }}>Strategic Extraction</h3>
        </div>
        <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>Identify channels with high <strong>Views-to-Subs</strong> ratios (Signal > 5x) to find topics that the algorithm is currently favoring. Use the "Clone Factory" method to replicate these proven models with your own unique execution.</p>
      </div>
    </div>
  )
}
