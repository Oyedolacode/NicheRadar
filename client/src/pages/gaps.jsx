import React from 'react'

export default function Gaps() {
  return (
    <div className="pg on">
      <div className="tb" style={{ position: 'relative', background: 'transparent', border: 'none', padding: '0 0 20px 0' }}>
        <div className="tb-l">
          <h1>Content Gaps</h1>
          <p>Topics people are searching for but no one is making good videos on.</p>
        </div>
      </div>

      <div className="empty">
        <div className="ei">💡</div>
        <h3>Gap Detector</h3>
        <p>This engine cross-references search volume with creator output to find underserved audiences.</p>
        <button className="btn fac" style={{ marginTop: '20px' }}>⚡ Refresh Search Data</button>
      </div>
    </div>
  )
}
