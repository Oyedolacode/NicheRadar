import React from 'react'

export default function Analytics() {
  return (
    <div className="page fade-in">
      <header style={{ marginBottom: 'var(--s8)' }}>
        <h1 style={{ fontSize: 32, fontWeight: 900, letterSpacing: '-1,5px', margin: 0 }}>Growth Verdicts</h1>
        <p style={{ color: 'var(--muted)', fontSize: 14 }}>AI-driven analysis of what is driving your channel forward.</p>
      </header>

      {/* 🚀 1. HIGH LEVEL METRIC CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--s6)', marginBottom: 'var(--s8)' }}>
        {[
          { label: 'System Retention', value: '64%', trend: '+8.2%', status: 'Viral', color: 'var(--accent)' },
          { label: 'CTR Average', value: '11.4%', trend: '+1.4%', status: 'Strong', color: 'var(--green)' },
          { label: 'View Velocity', value: '840/hr', trend: '+14%', status: 'Steady', color: 'var(--purple)' },
          { label: 'Growth Efficiency', value: '1.8x', trend: 'Peak', status: 'Hot', color: 'var(--hot)' },
        ].map(m => (
          <div key={m.label} className="card shadow-sm" style={{ padding: 'var(--s5)', border: '1px solid var(--border)' }}>
            <div className="slbl" style={{ marginBottom: 'var(--s1)' }}>{m.label}</div>
            <div style={{ fontSize: 24, fontWeight: 900, color: m.color }}>{m.value}</div>
            <div className="h-stack" style={{ justifyContent: 'space-between', marginTop: 'var(--s2)' }}>
               <span style={{ fontSize: 10, color: 'var(--green)', fontWeight: 800 }}>{m.trend}</span>
               <span className="pill" style={{ fontSize: 8, background: 'var(--elevated)', color: 'var(--dim)' }}>{m.status}</span>
            </div>
          </div>
        ))}
      </div>

      {/* 🧠 2. THE VERDICT ENGINE */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 'var(--s8)' }}>
        
        {/* Left: Performance Table */}
        <div className="card shadow-md">
           <div className="ch"><div className="ct">Content Performance Digest</div></div>
           <div style={{ padding: 'var(--s4)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--elevated)' }}>
                    {['Topic', 'Score', 'Verdict', 'Next'].map(h => (
                      <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 9, color: 'var(--muted)', letterSpacing: 1.5 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { t: 'AI Study Tools', s: '92', v: 'VIRAL', n: 'DOUBLE DOWN', c: 'var(--accent)' },
                    { t: 'History Shorts', s: '78', v: 'STRONG', n: 'CONTINUE', c: 'var(--green)' },
                    { t: 'Stoic Habits',   s: '42', v: 'RISKY', n: 'PIVOT', c: 'var(--hot)' },
                  ].map((r, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                       <td style={{ padding: '16px', fontSize: 13, fontWeight: 900 }}>{r.t}</td>
                       <td style={{ padding: '16px', fontWeight: 800, color: r.c }}>{r.s}</td>
                       <td style={{ padding: '16px' }}>
                          <span className="tag" style={{ color: r.c }}>{r.v}</span>
                       </td>
                       <td style={{ padding: '16px' }}>
                          <button className="btn s" style={{ fontSize: 9, padding: '4px 8px' }}>{r.n}</button>
                       </td>
                    </tr>
                  ))}
                </tbody>
              </table>
           </div>
        </div>

        {/* Right: AI Intelligence Reports */}
        <div className="v-stack" style={{ gap: 'var(--s6)' }}>
           <div className="card shadow-md" style={{ background: 'var(--adim)', border: '1.5px solid var(--accent)', padding: 'var(--s6)' }}>
              <div className="h-stack" style={{ gap: 'var(--s3)', marginBottom: 'var(--s4)' }}>
                 <div style={{ fontSize: 24 }}>🧠</div>
                 <div style={{ fontWeight: 900, fontSize: 13, color: 'var(--accent)' }}>AI STRATEGIC VERDICT</div>
              </div>
              <div className="v-stack" style={{ gap: 'var(--s4)' }}>
                 <div className="v-stack" style={{ gap: 'var(--s1)' }}>
                    <div style={{ fontSize: 11, fontWeight: 900, color: 'var(--text)' }}>✅ WHAT'S DRIVING GROWTH:</div>
                    <p style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.5, margin: 0 }}>
                       "How-to" listicles in the AI Niche are Currently seeing a 14% higher CTR than storytelling formats. Focus on "Problem/Solution" thumbnails.
                    </p>
                 </div>
                 <div className="v-stack" style={{ gap: 'var(--s1)' }}>
                    <div style={{ fontSize: 11, fontWeight: 900, color: 'var(--hot)' }}>⚠️ WHAT'S STALLING:</div>
                    <p style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.5, margin: 0 }}>
                       General vlog-style intros are losing 40% of viewers in the first 10s. **Pivot**: Instant hook starts are required for the "Stoic" niche.
                    </p>
                 </div>
              </div>
           </div>

           <div className="card" style={{ padding: 'var(--s6)', background: 'var(--elevated)' }}>
              <div style={{ fontSize: 11, fontWeight: 900, marginBottom: 'var(--s2)', color: 'var(--dim)' }}>RECOMMENDED ACTION</div>
              <p style={{ fontSize: 13, margin: 0, fontWeight: 700 }}>
                 Move "AI Study Tools" to High-Priority Production. 
              </p>
           </div>
        </div>

      </div>
    </div>
  )
}
