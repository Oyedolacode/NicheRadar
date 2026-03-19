import React, { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'

const SAMPLE_NODES = [
    { id: 'AI', x: 200, y: 200, r: 40, color: 'var(--purple)', label: 'AI' },
    { id: 'Students', x: 280, y: 120, r: 25, color: '#4d9fff', label: 'Students' },
    { id: 'Productivity', x: 320, y: 240, r: 30, color: '#00e5cc', label: 'Productivity' },
    { id: 'Coding', x: 120, y: 280, r: 28, color: '#ff9f43', label: 'Coding' },
    { id: 'History', x: 500, y: 300, r: 35, color: '#ff5c35', label: 'History' },
    { id: 'Roman', x: 580, y: 240, r: 20, color: '#ff5c35', label: 'Roman' },
    { id: 'Medieval', x: 560, y: 380, r: 22, color: '#ff5c35', label: 'Medieval' },
    { id: 'Stoicism', x: 450, y: 150, r: 28, color: '#ff9f43', label: 'Stoicism' },
]

const LINKS = [
    { source: 'AI', target: 'Students' },
    { source: 'AI', target: 'Productivity' },
    { source: 'AI', target: 'Coding' },
    { source: 'History', target: 'Roman' },
    { source: 'History', target: 'Medieval' },
    { source: 'History', target: 'Stoicism' },
    { source: 'Productivity', target: 'Stoicism' },
]

export default function TopicMap() {
    const location = useLocation()
    const navigate = useNavigate()
    const { toast } = useAppStore()
    const [topic, setTopic] = useState(location.state?.topic || '')
    const [selected, setSelected] = useState(null)
    const svgRef = useRef(null)

    return (
        <div className="page fade-in" style={{ height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--s6)' }}>
                <div>
                    <h2 style={{ fontFamily: 'var(--fd)', fontSize: 24, fontWeight: 800, color: 'var(--text)' }}>Topic Map Engine</h2>
                    <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 'var(--s1)' }}>Interactive landscape of related niches and signals</p>
                </div>
                <div style={{ display: 'flex', gap: 7, maxWidth: 400 }}>
                    <input className="inp" value={topic} onChange={e => setTopic(e.target.value)} placeholder="Topic name…" />
                    <button className="btn s" onClick={() => toast('Map updated', 'ok')}>Generate Map</button>
                </div>
            </div>

            <div style={{ flex: 1, position: 'relative', background: 'var(--surface)', borderRadius: 'var(--rl)', border: '1px solid var(--border)', overflow: 'hidden' }}>
                {/* SVG Graph Placeholder */}
                <svg width="100%" height="100%" style={{ background: 'radial-gradient(circle at center, #0a121c 0%, #04080e 100%)' }}>
                    <defs>
                        <filter id="glow">
                            <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                            <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
                        </filter>
                    </defs>
                    
                    {/* Links */}
                    {LINKS.map((link, i) => {
                        const s = SAMPLE_NODES.find(n => n.id === link.source)
                        const t = SAMPLE_NODES.find(n => n.id === link.target)
                        return <line key={i} x1={s.x} y1={s.y} x2={t.x} y2={t.y} stroke="var(--border)" strokeWidth="1" strokeDasharray="4 4" />
                    })}

                    {/* Nodes */}
                    {SAMPLE_NODES.map(node => (
                        <g key={node.id} cursor="pointer" onClick={() => setSelected(node)} transform={`translate(${node.x},${node.y})`}>
                            <circle r={node.r} fill={node.color} opacity="0.1" stroke={node.color} strokeWidth="1" filter="url(#glow)" />
                            <circle r={node.r * 0.7} fill={node.color} opacity="0.8" />
                            <text dy=".35em" textAnchor="middle" style={{ fill: '#fff', fontSize: 10, fontFamily: 'var(--fm)', fontWeight: 700, pointerEvents: 'none' }}>{node.label}</text>
                        </g>
                    ))}
                </svg>

                {/* Info Panel */}
                {selected && (
                    <div className="card" style={{ position: 'absolute', top: 20, right: 20, width: 280, padding: 20, border: '1px solid var(--border)', background: 'var(--surface)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 15 }}>
                            <div style={{ fontFamily: 'var(--fm)', fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase' }}>NODE DETAILS</div>
                            <button style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer' }} onClick={() => setSelected(null)}>✕</button>
                        </div>
                        <h3 style={{ fontFamily: 'var(--fd)', fontSize: 18, fontWeight: 800, color: selected.color, marginBottom: 8 }}>{selected.label}</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            <div style={{ fontSize: 12, color: '#7aadc8' }}>Located in the primary cluster. High semantic relevance to {LINKS.filter(l => l.source === selected.id).length} other niches.</div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                                <div style={{ background: 'var(--elevated)', padding: 10, borderRadius: 6, textAlign: 'center' }}>
                                    <div style={{ fontSize: 8, color: 'var(--muted)', marginBottom: 2 }}>SIZE</div>
                                    <div style={{ fontFamily: 'var(--fm)', fontWeight: 700, color: 'var(--accent)' }}>{Math.round(selected.r * 1.5)}K</div>
                                </div>
                                <div style={{ background: 'var(--elevated)', padding: 10, borderRadius: 6, textAlign: 'center' }}>
                                    <div style={{ fontSize: 8, color: 'var(--muted)', marginBottom: 2 }}>DENSITY</div>
                                    <div style={{ fontFamily: 'var(--fm)', fontWeight: 700, color: 'var(--orange)' }}>High</div>
                                </div>
                            </div>
                            <button className="btn s" style={{ width: '100%', marginTop: 5 }} onClick={() => navigate('/explorer', { state: { kw: selected.label } })}>🔍 Explore Niche</button>
                        </div>
                    </div>
                )}

                <div style={{ position: 'absolute', bottom: 20, left: 20, display: 'flex', gap: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, color: 'var(--muted)', background: 'rgba(0,0,0,0.4)', padding: '5px 10px', borderRadius: 20, border: '1px solid var(--border)' }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)' }} /> Primary Niche
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, color: 'var(--muted)', background: 'rgba(0,0,0,0.4)', padding: '5px 10px', borderRadius: 20, border: '1px solid var(--border)' }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--orange)' }} /> Growing Cluster
                    </div>
                </div>
            </div>
        </div>
    )
}
