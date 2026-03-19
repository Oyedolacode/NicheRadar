import React, { useState } from 'react'

export default function Batch() {
  const [list, setList] = useState('')
  const [status, setStatus] = useState('idle')

  const runBatch = () => {
    if (!list) return
    setStatus('running')
    setTimeout(() => setStatus('done'), 3000)
  }

  return (
    <div style={{ padding: 22 }}>
      <div className="tb" style={{ position: 'relative', background: 'transparent', border: 'none', padding: '0 0 20px 0' }}>
        <div className="tb-l">
          <h1>Batch Pipeline</h1>
          <p>Scan and analyze multiple niches at once.</p>
        </div>
      </div>

      <div className="card" style={{ padding: '24px' }}>
        <div className="slbl">Enter Keywords (one per line)</div>
        <textarea 
          className="inp" 
          value={list}
          onChange={(e) => setList(e.target.value)}
          placeholder="dark history&#10;stoicism&#10;AI tools&#10;minecraft lore" 
          style={{ minHeight: '200px', marginBottom: '16px', fontFamily: 'var(--fm)', resize: 'vertical' }}
        />
        <button className="btn" onClick={runBatch} disabled={status === 'running'}>
          {status === 'running' ? '🚀 Processing Batch...' : '🔥 Start Pipeline'}
        </button>
      </div>

      {status === 'done' && (
        <div className="card" style={{ marginTop: '20px' }}>
          <div className="ch"><div className="ct">Batch Results</div><div className="cm">4 completed</div></div>
          <div className="tw">
            <table>
              <thead>
                <tr>
                  <th>Topic</th>
                  <th>Opp. Score</th>
                  <th>Viral Gap</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>dark history</td><td className="tm cg">8.4</td><td className="tm cg">9.1</td><td><span className="pill v-mod">Analyzed</span></td></tr>
                <tr><td>stoicism</td><td className="tm cy">6.2</td><td className="tm cy">5.4</td><td><span className="pill v-mod">Analyzed</span></td></tr>
                <tr><td>AI tools</td><td className="tm chot">9.5</td><td className="tm chot">12.2</td><td><span className="pill v-mod">Analyzed</span></td></tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
