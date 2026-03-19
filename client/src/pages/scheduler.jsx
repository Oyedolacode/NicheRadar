import React, { useState, useEffect } from 'react'

export default function Scheduler() {
  const [items, setItems] = useState([])
  const today = new Date()
  
  useEffect(() => {
    const saved = localStorage.getItem('nr5_sched')
    if (saved) setItems(JSON.parse(saved))
  }, [])

  const save = (newItems) => {
    setItems(newItems)
    localStorage.setItem('nr5_sched', JSON.stringify(newItems))
  }

  const getDays = () => {
    const days = []
    for (let i = 0; i < 14; i++) {
      const d = new Date()
      d.setDate(today.getDate() + i)
      days.push(d)
    }
    return days
  }

  const days = getDays()

  return (
    <div className="pg on">
      <div className="tb" style={{ position: 'relative', background: 'transparent', border: 'none', padding: '0 0 20px 0' }}>
        <div className="tb-l">
          <h1>Publishing Scheduler</h1>
          <p>2-week content calendar and automation.</p>
        </div>
      </div>

      <div className="sched-grid">
        {days.map((d, i) => {
          const isToday = d.toDateString() === today.toDateString()
          const dayName = d.toLocaleDateString('en-US', { weekday: 'short' })
          const dayNum = d.getDate()
          const dayItems = items.filter(it => it.date === d.toDateString())

          return (
            <div key={i} className={`sched-day ${isToday ? 'active-day' : ''}`}>
              <div className="sched-day-name">{dayName}</div>
              <div className={`sched-day-num ${isToday ? 'today' : ''}`}>{dayNum}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {dayItems.map((it, idx) => (
                  <div key={idx} style={{ background: 'var(--accent)', color: 'var(--bg)', fontSize: '8px', padding: '2px 4px', borderRadius: '3px', fontWeight: 700 }}>
                    {it.title.slice(0, 15)}...
                  </div>
                ))}
                {dayItems.length === 0 && <div style={{ height: '30px' }}></div>}
              </div>
            </div>
          )
        })}
      </div>

      <div className="card">
        <div className="ch"><div className="ct">Upcoming Releases</div></div>
        <div className="tw">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Video Title</th>
                <th>Platform</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && <tr><td colSpan="4" style={{ textAlign: 'center', color: 'var(--dim)' }}>No videos scheduled.</td></tr>}
              {items.map((it, i) => (
                <tr key={i}>
                  <td className="tm">{it.date}</td>
                  <td>{it.title}</td>
                  <td className="tm">YouTube</td>
                  <td><span className="pill v-mod">Pending</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
