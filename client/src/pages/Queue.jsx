import React from 'react'
import { useQueueStore } from '../store/useQueueStore'

const COLS = [
  { id: 'ideas', label: 'Ideas / Backlog', emoji: '💡' },
  { id: 'script', label: 'Scripting', emoji: '📝' },
  { id: 'recording', label: 'Recording', emoji: '🎥' },
  { id: 'editing', label: 'Editing', emoji: '🎬' },
  { id: 'scheduled', label: 'Scheduled', emoji: '📅' }
]

export default function Queue() {
  const { kanban, moveCard, removeCard, clearQueue } = useQueueStore()

  // Use the store's data directly
  const data = kanban

  const move = (id, from, to) => {
    moveCard(id, from, to)
  }

  const remove = (id, col) => {
    removeCard(id, col)
  }

  return (
    <div className="page fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginBottom: 20 }}>
        <button className="btn s" onClick={() => { if (confirm('Clear all?')) clearQueue() }}>🗑️ Clear Board</button>
      </div>

      <div className="kanban">
        {COLS.map(col => (
          <div key={col.id} className="kanban-col">
            <div className="kanban-col-hd">
              <div className="kanban-col-title">{col.emoji} {col.label}</div>
              <div className="kanban-count">{data[col.id]?.length || 0}</div>
            </div>
            <div className="kanban-cards">
              {data[col.id]?.map(card => (
                <div key={card.id} className="kanban-card">
                  <div style={{ fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>{card.title}</div>
                  <div style={{ fontSize: '9px', color: 'var(--muted)', display: 'flex', justifyContent: 'space-between' }}>
                    <span>{card.topic}</span>
                    <span>{card.created}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '4px', marginTop: '10px' }}>
                    {COLS.indexOf(col) > 0 && <button className="btn s" style={{ padding: '2px 6px', fontSize: '10px' }} onClick={() => move(card.id, col.id, COLS[COLS.indexOf(col) - 1].id)}>←</button>}
                    {COLS.indexOf(col) < COLS.length - 1 && <button className="btn s" style={{ padding: '2px 6px', fontSize: '10px' }} onClick={() => move(card.id, col.id, COLS[COLS.indexOf(col) + 1].id)}>→</button>}
                    <button className="btn s" style={{ padding: '2px 6px', fontSize: '10px', marginLeft: 'auto', borderColor: 'var(--red)', color: 'var(--red)' }} onClick={() => remove(card.id, col.id)}>×</button>
                  </div>
                </div>
              ))}
              {data[col.id]?.length === 0 && (
                <div style={{ border: '1px dashed var(--border)', borderRadius: 'var(--r)', padding: '20px', textAlign: 'center', fontSize: '10px', color: 'var(--dim)' }}>
                  Empty
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
