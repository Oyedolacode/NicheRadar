import React, { useState, useEffect } from 'react'
import { fetchAndEnrich, scoreInfo, fmt, fmtP, oppScore, bdg, esc } from '../lib/ytUtils'
import { useAppStore } from '../store/useAppStore'

export default function Explorer() {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [filter, setFilter] = useState('all')
  const [sort, setSort] = useState({ col: 7, desc: true })
  const { setApiStatus } = useAppStore()

  const analyze = async (kw) => {
    const q = kw || query
    if (!q) return
    setLoading(true)
    try {
      const res = await fetchAndEnrich(q)
      setResults(res)
      setApiStatus('ready')
    } catch (err) {
      console.error(err)
      setApiStatus('error')
    } finally {
      setLoading(false)
    }
  }

  const handleSort = (col) => {
    const desc = sort.col === col ? !sort.desc : true
    setSort({ col, desc })
  }

  const filteredRows = results ? results.enriched.filter(v => {
    if (filter === 'all') return true
    const vs = oppScore(v.vel, v.eng, results.trend, results.sat)
    if (filter === 'massive') return vs >= 8
    if (filter === 'strong') return vs >= 6
    if (filter === 'small') return v.subs < 50000
    return true
  }) : []

  const sortedRows = [...filteredRows].sort((a, b) => {
    const getVal = (v) => {
      switch (sort.col) {
        case 0: return v.title
        case 1: return v.views
        case 2: return v.subs
        case 3: return v.vel
        case 4: return v.eng
        case 5: return v.cs
        case 6: return v.cp
        case 7: return oppScore(v.vel, v.eng, results.trend, results.sat)
        default: return 0
      }
    }
    const va = getVal(a), vb = getVal(b)
    return sort.desc ? (vb > va ? 1 : -1) : (va > vb ? 1 : -1)
  })

  const si = results ? scoreInfo(results.opp) : null

  return (
    <div className="pg on">
      <div className="slbl">Keyword</div>
      <div className="sr" style={{ maxWidth: '740px' }}>
        <input 
          className="inp" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="dark history, AI tools, psychology facts..." 
          onKeyDown={(e) => e.key === 'Enter' && analyze()}
        />
        <button className="btn" onClick={() => analyze()} disabled={loading}>
          {loading ? '⏳ Analyzing...' : '⚡ Analyze'}
        </button>
      </div>

      {!results && (
        <div className="empty">
          <div className="ei">📡</div>
          <h3>Ready to Hunt Niches</h3>
          <p>Enter a keyword. Engine fetches live YouTube data and scores opportunity.</p>
        </div>
      )}

      {results && (
        <div id="exRes">
          <div className="mg">
            <div className="mc lit"><div className="ml">Opportunity Score</div><div className="mv ca">{results.opp.toFixed(1)}</div><div className="ms">v2 formula</div></div>
            <div className="mc lit"><div className="ml">View Velocity</div><div className="mv">{fmt(results.avgVel)}/hr</div><div className="ms">views / hour</div></div>
            <div className="mc lit"><div className="ml">Engagement Rate</div><div className="mv cy">{fmtP(results.avgEng)}</div><div className="ms">(likes+cmts)/views</div></div>
            <div className="mc lit"><div className="ml">Content Saturation</div><div className="mv chot">{results.sat}</div><div className="ms">videos · 30d</div></div>
            <div className="mc lit"><div className="ml">Viral Gap Score</div><div className="mv cg">{results.vg.toFixed(2)}</div><div className="ms">demand ÷ supply</div></div>
          </div>

          <div className="hero">
            <div className="dial">
              <svg width="96" height="96" viewBox="0 0 96 96">
                <circle cx="48" cy="48" r="40" fill="none" stroke="var(--border)" strokeWidth="7.5" />
                <circle 
                  cx="48" cy="48" r="40" fill="none" stroke={si.color} strokeWidth="7.5" 
                  strokeDasharray="251" 
                  strokeDashoffset={251 - (results.opp / 10) * 251} 
                  strokeLinecap="round" 
                  style={{ transition: 'stroke-dashoffset 1.1s cubic-bezier(.4,0,.2,1), stroke .4s' }}
                />
              </svg>
              <div className="dtt"><div className="dn" style={{ color: si.color }}>{results.opp.toFixed(1)}</div><div className="ds">Score</div></div>
            </div>
            <div className="hb">
              <div className="ht">"{results.kw}" — {si.label} OPPORTUNITY</div>
              <div className="hd">{si.desc}</div>
              <div className="sbars">
                <div className="sb"><span>Trend</span><div className="sbt"><div className="sbf" style={{ width: `${results.trend * 10}%` }}></div></div><span>{results.trend.toFixed(1)}</span></div>
                <div className="sb"><span>Viral Gap</span><div className="sbt"><div className="sbf" style={{ width: `${results.vg * 10}%` }}></div></div><span>{results.vg.toFixed(1)}</span></div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="ch">
              <div className="ct">Video Intelligence Feed</div>
              <div style={{ display: 'flex', gap: '7px', alignItems: 'center' }}>
                <div className="cm">{sortedRows.length} videos</div>
                <select 
                  value={filter} 
                  onChange={(e) => setFilter(e.target.value)}
                  style={{ background: 'var(--elevated)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: 'var(--r)', padding: '3px 7px', fontFamily: 'var(--fm)', fontSize: '9.5px', cursor: 'pointer', outline: 'none' }}
                >
                  <option value="all">All</option>
                  <option value="massive">Massive only</option>
                  <option value="strong">Strong+</option>
                  <option value="small">Small channels</option>
                </select>
              </div>
            </div>
            <div className="tw">
              <table>
                <thead>
                  <tr>
                    <th onClick={() => handleSort(0)}>Video</th>
                    <th onClick={() => handleSort(1)}>Views</th>
                    <th onClick={() => handleSort(2)}>Subs</th>
                    <th onClick={() => handleSort(3)}>Velocity</th>
                    <th onClick={() => handleSort(4)}>Eng. Rate</th>
                    <th onClick={() => handleSort(5)}>Creator Success</th>
                    <th onClick={() => handleSort(6)}>Chan. Power</th>
                    <th onClick={() => handleSort(7)}>Score</th>
                    <th>Signal</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedRows.map(v => {
                    const vs = oppScore(v.vel, v.eng, results.trend, results.sat)
                    const sInfo = scoreInfo(vs)
                    const ago = Math.floor((Date.now() - new Date(v.pub)) / 864e5)
                    return (
                      <tr key={v.id} onClick={() => window.open(v.url, '_blank')}>
                        <td>
                          <span className="vtt">{v.title}</span>
                          <span className="vc">{v.chan} · {ago}d ago</span>
                        </td>
                        <td className="tm">{fmt(v.views)}</td>
                        <td className="tm">{fmt(v.subs)}</td>
                        <td className="tm">{fmt(v.vel)}/hr</td>
                        <td className="tm">{fmtP(v.eng)}</td>
                        <td className="tm">{v.cs.toFixed(2)}×</td>
                        <td className="tm">{v.cp < .1 ? '🔥 Low' : v.cp < 1 ? '✅ Med' : '⚪ High'}</td>
                        <td><span className={`sbdg ${bdg(vs)}`}>{vs.toFixed(1)}</span></td>
                        <td><span className={`pill ${sInfo.cls}`}>{sInfo.label}</span></td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
