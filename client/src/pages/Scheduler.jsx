import React from 'react'
import { useQueueStore } from '../store/useQueueStore'

export default function Scheduler() {
  const {
    schedule, scheduleVideo, togglePublished, autoSchedule, clearSchedule
  } = useQueueStore()

  const today = new Date()

  // Helper to get items for a specific date from the store
  const getItemsForDate = (date) => {
    const key = date.toISOString().slice(0, 10)
    return schedule[key] || []
  }

  const days = React.useMemo(() => {
    const dts = []
    for (let i = 0; i < 14; i++) {
      const d = new Date()
      d.setDate(today.getDate() + i)
      dts.push(d)
    }
    return dts
  }, [])

  return (
    <div>

      <div className="sched-grid">
        {days.map((d, i) => {
          const dKey = d.toISOString().slice(0, 10)
          const isToday = d.toDateString() === today.toDateString()
          const dayName = d.toLocaleDateString('en-US', { weekday: 'short' })
          const dayNum = d.getDate()
          const dayItems = getItemsForDate(d)

          return (
            <div key={i} className={`sched-day ${isToday ? 'active-day' : ''}`}>
              <div className="sched-day-name">{dayName}</div>
              <div className={`sched-day-num ${isToday ? 'today' : ''}`}>{dayNum}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {dayItems.map((it, idx) => (
                  <div key={idx} 
                    onClick={() => togglePublished(dKey, it.id)}
                    style={{ 
                      background: it.published ? 'var(--green)' : 'var(--orange)', 
                      color: 'var(--bg)', 
                      fontSize: '8px', 
                      padding: '2px 4px', 
                      borderRadius: '3px', 
                      fontWeight: 700,
                      cursor: 'pointer',
                      opacity: it.published ? 0.7 : 1
                    }}>
                    {it.title.slice(0, 15)}...
                  </div>
                ))}
                <div
                  onClick={() => {
                    const title = prompt('Video title:')
                    if (!title) return
                    scheduleVideo(dKey, { title })
                  }}
                  style={{ fontSize: 9, color: 'var(--dim)', cursor: 'pointer', textAlign: 'center', padding: '4px', border: '1px dashed var(--border)', borderRadius: 3, marginTop: 4 }}
                >
                  + Add
                </div>
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
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(schedule).length === 0 && <tr><td colSpan="4" style={{ textAlign: 'center', color: 'var(--dim)' }}>No videos scheduled.</td></tr>}
              {Object.entries(schedule).map(([date, items]) => 
                items.map((it, i) => (
                  <tr key={`${date}-${i}`}>
                    <td className="tm">{date}</td>
                    <td>{it.title}</td>
                    <td className="tm">{it.time}</td>
                    <td>
                      <span className={`pill ${it.published ? 'ok' : 'moderate'}`}>
                        {it.published ? 'Published' : 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
