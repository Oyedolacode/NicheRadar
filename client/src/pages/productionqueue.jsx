import React from 'react'
import { useQueueStore } from '../store/useQueueStore'
import { useAppStore } from '../store/useAppStore'
import { useNavigate } from 'react-router-dom'

const STATUS_CONFIG = {
    backlog: { label: 'Backlog', icon: '📥', color: 'var(--muted)', bg: 'rgba(77,125,158,.1)' },
    scripting: { label: 'Scripting', icon: '📝', color: 'var(--orange)', bg: 'rgba(255,159,67,.1)' },
    producing: { label: 'Producing', icon: '🎬', color: 'var(--accent)', bg: 'rgba(0,229,204,.1)' },
    finished: { label: 'Finished', icon: '✅', color: 'var(--green)', bg: 'rgba(0,230,118,.1)' },
}

export default function ProductionQueue() {
    const { items, updateStatus, removeItem, clearQueue } = useQueueStore()
    const { toast } = useAppStore()
    const navigate = useNavigate()

    const groups = {
        backlog: items.filter(i => i.status === 'backlog'),
        scripting: items.filter(i => i.status === 'scripting'),
        producing: items.filter(i => i.status === 'producing'),
        finished: items.filter(i => i.status === 'finished'),
    }

    function move(id, status) {
        updateStatus(id, status)
        toast(`Moved to ${STATUS_CONFIG[status].label}`, 'ok')
    }

    return (
        <div style={{ padding: 22 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div>
                    <h2 style={{ fontFamily: 'var(--fd)', fontSize: 22, fontWeight: 800 }}>Production Queue</h2>
                    <p style={{ fontSize: 13, color: 'var(--muted)' }}>Track your videos from idea to finish line</p>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn s" onClick={() => navigate('/factory')}>🏭 Open Factory</button>
                    {items.length > 0 && <button className="btn s" style={{ color: 'var(--red)' }} onClick={() => { if (confirm('Clear all items?')) clearQueue() }}>🗑 Clear All</button>}
                </div>
            </div>

            {!items.length ? (
                <div className="empty">
                    <div className="ei">📋</div>
                    <h3>Queue is Empty</h3>
                    <p>Use the Content Factory to generate ideas and add them here to start production.</p>
                    <button className="btn fac" style={{ marginTop: 15 }} onClick={() => navigate('/factory')}>Go to Factory</button>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
                    {Object.entries(STATUS_CONFIG).map(([status, config]) => (
                        <div key={status} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 4px', marginBottom: 2 }}>
                                <span style={{ fontSize: 16 }}>{config.icon}</span>
                                <span style={{ fontFamily: 'var(--fm)', fontSize: 10, textTransform: 'uppercase', letterSpacing: 1.5, fontWeight: 700, color: config.color }}>{config.label}</span>
                                <span style={{ marginLeft: 'auto', fontSize: 10, background: 'var(--elevated)', padding: '2px 7px', borderRadius: 10, color: 'var(--muted)' }}>{groups[status].length}</span>
                            </div>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minHeight: 100, padding: 10, background: 'rgba(255,255,255,.02)', borderRadius: 'var(--rl)', border: '1px dashed var(--border)' }}>
                                {groups[status].map(item => (
                                    <div key={item.id} className="card" style={{ padding: 14, margin: 0, border: '1px solid var(--border)', background: 'var(--surface)' }}>
                                        <div style={{ fontFamily: 'var(--fm)', fontSize: 9, color: 'var(--muted)', marginBottom: 6, textTransform: 'uppercase' }}>{item.topic}</div>
                                        <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.4, marginBottom: 12 }}>{item.title}</div>
                                        
                                        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                                            {status !== 'backlog' && <button className="btn s" style={{ fontSize: 9, padding: '4px 8px' }} onClick={() => move(item.id, 'backlog')}>🔙 Back</button>}
                                            {status === 'backlog' && <button className="btn s" style={{ fontSize: 9, padding: '4px 8px', borderColor: 'var(--orange)' }} onClick={() => move(item.id, 'scripting')}>📝 Script</button>}
                                            {status === 'scripting' && <button className="btn s" style={{ fontSize: 9, padding: '4px 8px', borderColor: 'var(--accent)' }} onClick={() => move(item.id, 'producing')}>🎬 Produce</button>}
                                            {status === 'producing' && <button className="btn s" style={{ fontSize: 9, padding: '4px 8px', borderColor: 'var(--green)' }} onClick={() => move(item.id, 'finished')}>✅ Finish</button>}
                                            <button className="btn s" style={{ fontSize: 9, padding: '4px 8px', marginLeft: 'auto' }} onClick={() => { if(confirm('Remove?')) removeItem(item.id) }}>✕</button>
                                        </div>
                                    </div>
                                ))}
                                {groups[status].length === 0 && (
                                    <div style={{ textAlign: 'center', padding: '20px 0', fontSize: 11, color: 'var(--dim)', fontFamily: 'var(--fm)' }}>No items in {config.label.toLowerCase()}</div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
