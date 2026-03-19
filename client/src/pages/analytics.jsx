import React from 'react'

export default function Analytics() {
  return (
    <div className="page fade-in">
      <header style={{ marginBottom: 'var(--s8)' }}>
        <h1 style={{ fontSize: 32, fontWeight: 900, letterSpacing: '-1px', margin: 0 }}>Growth Analytics</h1>
        <p style={{ color: 'var(--muted)', fontSize: 14 }}>Track your channel performance and identify what’s working.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--s6)', marginBottom: 'var(--s8)' }}>
        {[
          { label: 'Avg CTR', value: '8.2%', sub: 'Target: 10%', color: 'var(--accent)' },
          { label: 'Retention', value: '61%', sub: 'Target: 50%', color: 'var(--green)' },
          { label: 'Views (30d)', value: '1.2M', sub: '+12% vs last month', color: 'var(--text)' },
          { label: 'Growth Rate', value: '14%', sub: 'Steady momentum', color: 'var(--purple)' },
        ].map(m => (
          <div key={m.label} className="card" style={{ padding: 'var(--s5)' }}>
            <div className="slbl" style={{ marginBottom: 'var(--s1)' }}>{m.label}</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: m.color }}>{m.value}</div>
            <div style={{ fontSize: 10, color: 'var(--dim)' }}>{m.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr', gap: 'var(--s8)' }}>
        <div className="card">
          <div className="ch"><div className="ct">Video Performance Verdict</div></div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--elevated)' }}>
                {['Video', 'CTR', 'Retention', 'Verdict'].map(h => (
                  <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: 9, color: 'var(--muted)', letterSpacing: 1 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { title: 'AI tools for students', ctr: '8.2%', ret: '61%', v: 'Strong' },
                { title: 'History shorts #14', ctr: '12.4%', ret: '45%', v: 'Viral' },
                { title: 'Stoic daily guide', ctr: '4.1%', ret: '32%', v: 'Review' },
              ].map((r, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '14px 20px', fontSize: 13, fontWeight: 700 }}>{r.title}</td>
                  <td style={{ padding: '14px 20px' }} className="tm">{r.ctr}</td>
                  <td style={{ padding: '14px 20px' }} className="tm">{r.ret}</td>
                  <td style={{ padding: '14px 20px' }}>
                    <span className="tag" style={{ background: r.v === 'Review' ? 'var(--adim)' : 'var(--glass)', color: r.v === 'Review' ? 'var(--orange)' : 'var(--green)' }}>{r.v}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card shadow-md" style={{ background: 'var(--adim)', border: '1px solid var(--accent)', padding: 'var(--s6)' }}>
          <div className="slbl" style={{ color: 'var(--accent)', marginBottom: 'var(--s4)' }}>AI PERFORMANCE INSIGHTS</div>
          <div className="v-stack" style={{ gap: 'var(--s6)' }}>
            <div className="v-stack" style={{ gap: 'var(--s2)' }}>
              <div style={{ fontWeight: 800, color: 'var(--green)', fontSize: 13 }}>✅ WHAT’S WORKING:</div>
              <p style={{ fontSize: 12, margin: 0, opacity: 0.8 }}>Storytelling format combined with "AI tools" is driving 80% of your growth. Retention is significantly higher on listicles with yellow backgrounds.</p>
            </div>
            <div className="v-stack" style={{ gap: 'var(--s2)' }}>
              <div style={{ fontWeight: 800, color: 'var(--orange)', fontSize: 13 }}>❌ WHAT’S NOT:</div>
              <p style={{ fontSize: 12, margin: 0, opacity: 0.8 }}>Low-retention tutorials on general coding. CTR is dropping on "How-To" tags. Pivot to "Why" style content.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
