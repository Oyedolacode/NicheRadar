import React, { useState } from 'react'
import { useScheduleStore } from '../store/useScheduleStore'
import { useAppStore } from '../store/useAppStore'
import { useNavigate } from 'react-router-dom'

export default function Scheduler() {
    const { slots, scheduleVideo, unschedule, clearSchedule } = useScheduleStore()
    const { toast } = useAppStore()
    const navigate = useNavigate()

    const [modal, setModal] = useState(false)
    const [newItem, setNewItem] = useState({ title: '', topic: '', date: new Date().toISOString().split('T')[0] })

    function handleAdd() {
        if (!newItem.title.trim()) { toast('Enter a title', 'e'); return }
        scheduleVideo({ title: newItem.title, topic: newItem.topic }, newItem.date)
        setModal(false)
        setNewItem({ title: '', topic: '', date: new Date().toISOString().split('T')[0] })
        toast('Video scheduled!', 'ok')
    }

    // Sort slots by date
    const sorted = [...slots].sort((a, b) => new Date(a.publishAt).getTime() - new Date(b.publishAt).getTime())

    return (
        <div className="page fade-in">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--s6)' }}>
                <div>
                    <h2 style={{ fontFamily: 'var(--fd)', fontSize: 24, fontWeight: 800, color: 'var(--text)' }}>Publishing Scheduler</h2>
                    <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 'var(--s1)' }}>Optimize your post timing for maximum reach</p>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn fac" onClick={() => setModal(true)}>📅 Schedule Video</button>
                    {slots.length > 0 && <button className="btn s" style={{ color: 'var(--red)' }} onClick={() => { if (confirm('Clear schedule?')) clearSchedule() }}>🗑 Clear</button>}
                </div>
            </div>

            {!slots.length ? (
                <div className="empty">
                    <div className="ei">📅</div>
                    <h3>Calendar is Empty</h3>
                    <p>Start scheduling your finished videos to see them in your content calendar.</p>
                    <button className="btn fac" style={{ marginTop: 15 }} onClick={() => setModal(true)}>Add First Video</button>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 15 }}>
                    {sorted.map(s => {
                        const date = new Date(s.publishAt)
                        const diff = Math.ceil((date.getTime() - Date.now()) / 86_400_000)
                        
                        return (
                            <div key={s.id} className="card" style={{ padding: 18, border: '1px solid var(--border)', background: 'var(--surface)', display: 'flex', gap: 16 }}>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: 62, background: 'var(--elevated)', borderRadius: 'var(--r)', border: '1px solid var(--border)', flexShrink: 0 }}>
                                    <div style={{ fontFamily: 'var(--fm)', fontSize: 8, textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 2 }}>{date.toLocaleString('default', { month: 'short' })}</div>
                                    <div style={{ fontFamily: 'var(--fd)', fontSize: 22, fontWeight: 900, color: 'var(--accent)' }}>{date.getDate()}</div>
                                    <div style={{ fontFamily: 'var(--fm)', fontSize: 7, color: 'var(--dim)', marginTop: 2 }}>{date.getFullYear()}</div>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontFamily: 'var(--fm)', fontSize: 9, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 4 }}>{s.topic || 'No Topic'}</div>
                                    <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.4, marginBottom: 8 }}>{s.title}</div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <div style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, background: diff < 0 ? 'rgba(255,68,68,.1)' : 'rgba(0,229,204,.1)', color: diff < 0 ? 'var(--red)' : 'var(--accent)', border: `1px solid ${diff < 0 ? 'rgba(255,68,68,.2)' : 'rgba(0,229,204,.2)'}` }}>
                                            {diff < 0 ? 'Passed' : diff === 0 ? 'Today' : `In ${diff} days`}
                                        </div>
                                        <button className="btn s" style={{ fontSize: 8, padding: '3px 8px', marginLeft: 'auto' }} onClick={() => unschedule(s.id)}>Remove</button>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* Simple Add Modal */}
            {modal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(4,8,14,.85)', zIndex: 1000, display: 'grid', placeItems: 'center', backdropFilter: 'blur(4px)' }}>
                    <div className="card" style={{ width: 440, padding: 25, border: '1px solid var(--border)', background: 'var(--surface)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 18 }}>
                            <h3 style={{ fontFamily: 'var(--fd)', fontSize: 18, fontWeight: 800 }}>Schedule Content</h3>
                            <button style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: 20 }} onClick={() => setModal(false)}>✕</button>
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                            <div>
                                <label style={{ display: 'block', fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 6, fontFamily: 'var(--fm)' }}>Video Title</label>
                                <input className="inp" style={{ width: '100%' }} value={newItem.title} onChange={e => setNewItem({ ...newItem, title: e.target.value })} placeholder="e.g. 5 AI Habits that Save Time" />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 6, fontFamily: 'var(--fm)' }}>Topic (Optional)</label>
                                <input className="inp" style={{ width: '100%' }} value={newItem.topic} onChange={e => setNewItem({ ...newItem, topic: e.target.value })} placeholder="e.g. AI Productivity" />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 6, fontFamily: 'var(--fm)' }}>Publish Date</label>
                                <input className="inp" type="date" style={{ width: '100%' }} value={newItem.date} onChange={e => setNewItem({ ...newItem, date: e.target.value })} />
                            </div>
                            <button className="btn fac" style={{ width: '100%', marginTop: 8 }} onClick={handleAdd}>Confirm Date</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
