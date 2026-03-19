import React from 'react'

const WINS = [
  { chan: 'Mental Journey', subs: '12K', video: '5 Habits of Marcus Aurelius', views: '450K', ratio: '37.5x', color: 'var(--green)' },
  { chan: 'History Uncut', subs: '4.2K', video: 'The Real Reason Rome Fell', views: '120K', ratio: '28.5x', color: 'var(--purple)' },
  { chan: 'AI Architect', subs: '8.5K', video: 'I Replaced Myself with AI', views: '210K', ratio: '24.7x', color: 'var(--accent)' },
  { chan: 'Coding With Zen', subs: '25K', video: 'Stop Learning Java', views: '480K', ratio: '19.2x', color: 'var(--yellow)' },
]

export default function Wins() {
  return (
    <div className="pg on">
      <div className="tb" style={{ position: 'relative', background: 'transparent', border: 'none', padding: '0 0 20px 0' }}>
        <div className="tb-l">
          <h1>Small Channel Wins</h1>
          <p>Small channels getting 10x+ more views than subscribers.</p>
        </div>
      </div>

      <div className="card">
        <div className="ch"><div className="ct">Top Outperformers (Last 24h)</div><div className="cm">4 found</div></div>
        <div className="tw">
          <table>
            <thead>
              <tr>
                <th>Channel</th>
                <th>Subscribers</th>
                <th>Winning Video</th>
                <th>Views</th>
                <th>Outperform Ratio</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {WINS.map((w, i) => (
                <tr key={i}>
                  <td>
                    <div style={{ fontWeight: 700 }}>{w.chan}</div>
                    <div style={{ fontSize: '9px', color: 'var(--muted)' }}>Philosophy / Education</div>
                  </td>
                  <td className="tm">{w.subs}</td>
                  <td>{w.video}</td>
                  <td className="tm ca">{w.views}</td>
                  <td><span className="pill v-high" style={{ background: 'rgba(255, 159, 67, .1)', color: 'var(--orange)' }}>{w.ratio}</span></td>
                  <td><button className="btn s">View Channel</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
