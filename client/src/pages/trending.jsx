import React from 'react'

const TRENDS = [
  { topic: 'Stoic Mornings', growth: '+240%', val: '9.2', color: 'var(--accent)' },
  { topic: 'AI Video Editing', growth: '+180%', val: '8.7', color: 'var(--purple)' },
  { topic: 'Forgotten Lore', growth: '+120%', val: '7.9', color: 'var(--green)' },
  { topic: 'Dark History', growth: '+95%', val: '8.1', color: 'var(--hot)' },
]

export default function Trending() {
  return (
    <div className="pg on">
      <div className="tb" style={{ position: 'relative', background: 'transparent', border: 'none', padding: '0 0 20px 0' }}>
        <div className="tb-l">
          <h1>Trending Feed</h1>
          <p>Real-time momentum data across all analyzed niches.</p>
        </div>
      </div>

      <div className="mg">
        {TRENDS.map((t, i) => (
          <div key={i} className="mc lit">
            <div className="ml">{t.topic}</div>
            <div className="mv" style={{ color: t.color }}>{t.growth}</div>
            <div className="ms">Momentum: {t.val}/10</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="ch"><div className="ct">Emerging Signals</div></div>
        <div className="tw">
          <table>
            <thead>
              <tr>
                <th>Keyword</th>
                <th>Volume</th>
                <th>Velocity</th>
                <th>Competition</th>
                <th>Signal</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>stoic habits</td><td className="tm">45K</td><td className="tm cg">2.1K/h</td><td><span className="pill v-mod">Low</span></td><td><span className="pill v-high">Rising</span></td></tr>
              <tr><td>ai animation</td><td className="tm">120K</td><td className="tm cg">8.4K/h</td><td><span className="pill v-high">High</span></td><td><span className="pill v-mod">Stable</span></td></tr>
              <tr><td>unsolved lore</td><td className="tm">12K</td><td className="tm cy">400/h</td><td><span className="pill v-mod">V. Low</span></td><td><span className="pill v-high">Viral Gap</span></td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
