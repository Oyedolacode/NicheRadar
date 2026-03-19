import React, { useState, useEffect } from 'react'
import { cKeys } from '../lib/ytUtils'

export default function Cache() {
  const [keys, setKeys] = useState([])

  useEffect(() => {
    setKeys(cKeys())
  }, [])

  const clear = () => {
    keys.forEach(k => localStorage.removeItem(k))
    setKeys([])
    alert('Cache cleared!')
  }

  return (
    <div style={{ padding: 22 }}>
      <div className="tb" style={{ position: 'relative', background: 'transparent', border: 'none', padding: '0 0 20px 0' }}>
        <div className="tb-l">
          <h1>Cache & Storage</h1>
          <p>Manage local data and API response persistence.</p>
        </div>
        <div className="tb-r">
          <button className="btn s" style={{ borderColor: 'var(--red)', color: 'var(--red)' }} onClick={clear}>🗑️ Flush All Cache</button>
        </div>
      </div>

      <div className="mg">
        <div className="mc lit"><div className="ml">Total Cache Items</div><div className="mv">{keys.length}</div><div className="ms">objects in localStorage</div></div>
        <div className="mc lit"><div className="ml">Storage Usage</div><div className="mv">~{(JSON.stringify(localStorage).length / 1024).toFixed(1)} KB</div><div className="ms">of 5MB quota</div></div>
        <div className="mc lit"><div className="ml">API Quota Index</div><div className="mv ca">92%</div><div className="ms">health status</div></div>
      </div>

      <div className="card">
        <div className="ch"><div className="ct">Active Cache Entries</div></div>
        <div className="tw">
          <table>
            <thead>
              <tr>
                <th>Key Name</th>
                <th>Type</th>
                <th>Age</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {keys.length === 0 && <tr><td colSpan="4" style={{ textAlign: 'center', color: 'var(--dim)' }}>No cache entries found.</td></tr>}
              {keys.map(k => (
                <tr key={k}>
                  <td className="tm">{k}</td>
                  <td>{k.includes('s_') ? 'Search Result' : k.includes('vs_') ? 'Video Stats' : 'Other'}</td>
                  <td className="tm">~5m ago</td>
                  <td><button className="btn s" style={{ padding: '2px 6px', fontSize: '10px' }} onClick={() => { localStorage.removeItem(k); setKeys(cKeys()) }}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}