import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useYouTube } from '../hooks/useYouTube'
import { useAppStore } from '../store/useAppStore'
import * as d3 from 'd3'

/* ── Predefined topic ecosystems ── */
const ECOSYSTEMS = {
    ai: { core: 'AI Tools', color: '#b57aff', subs: [{ name: 'AI for Students', kws: ['AI tools for students', 'AI homework helper', 'AI note taking'] }, { name: 'AI Productivity', kws: ['AI automation tools', 'ChatGPT productivity', 'AI workflow'] }, { name: 'AI Business', kws: ['AI side hustles', 'AI marketing tools', 'AI content creation'] }, { name: 'AI Coding', kws: ['AI coding assistant', 'GitHub Copilot explained', 'AI debugging'] }] },
    history: { core: 'History', color: '#ff5c35', subs: [{ name: 'Dark History', kws: ['dark history facts', 'disturbing history', 'shocking history'] }, { name: 'Ancient World', kws: ['roman empire history', 'ancient civilizations', 'greek mythology'] }, { name: 'History Shorts', kws: ['history shorts', 'history facts 60 seconds', 'quick history'] }, { name: 'Medieval', kws: ['medieval history', 'knights and castles', 'viking history'] }] },
    psychology: { core: 'Psychology', color: '#4d9fff', subs: [{ name: 'Dark Psychology', kws: ['dark psychology tactics', 'manipulation psychology', 'narcissism explained'] }, { name: 'Mind Tricks', kws: ['psychology facts', 'human behavior explained', 'cognitive biases'] }, { name: 'Self Help', kws: ['psychology self improvement', 'stoicism psychology', 'behavior change'] }, { name: 'Social', kws: ['social psychology', 'group behavior explained', 'persuasion science'] }] },
    finance: { core: 'Finance', color: '#00e676', subs: [{ name: 'Investing', kws: ['investing for beginners', 'stock market explained', 'index funds'] }, { name: 'Side Income', kws: ['passive income ideas', 'side hustle ideas', 'make money online'] }, { name: 'Budgeting', kws: ['budget tips', 'save money fast', 'frugal living'] }, { name: 'Freedom', kws: ['financial freedom', 'retire early', 'wealth building'] }] },
    science: { core: 'Science', color: '#ffd740', subs: [{ name: 'Space', kws: ['space facts mind-blowing', 'black holes explained', 'NASA discoveries'] }, { name: 'Biology', kws: ['biology facts nobody knows', 'human body mysteries', 'genetics explained'] }, { name: 'Physics', kws: ['quantum physics explained', 'physics paradoxes', 'Einstein theory'] }, { name: 'Experiments', kws: ['weird science experiments', 'chemistry reactions', 'science experiments gone wrong'] }] },
}

const CLUSTER_COLORS = ['#00e5cc', '#b57aff', '#ff5c35', '#ffd740', '#4d9fff', '#00e676', '#ff6b6b', '#ffa94d']

function getEcosystem(seed) {
    const b = seed.toLowerCase()
    for (const [k, v] of Object.entries(ECOSYSTEMS)) if (b.includes(k)) return v
    return {
        core: seed,
        color: '#00e5cc',
        subs: [
            { name: seed + ' Shorts', kws: [seed + ' shorts', seed + ' quick facts', seed + ' 60 seconds'] },
            { name: seed + ' Explained', kws: [seed + ' explained', seed + ' for beginners', 'what is ' + seed] },
            { name: seed + ' Advanced', kws: [seed + ' deep dive', seed + ' advanced', seed + ' expert'] },
            { name: seed + ' Stories', kws: [seed + ' stories', seed + ' documentary', seed + ' case studies'] },
        ],
    }
}

export default function TopicMap() {
    const navigate = useNavigate()
    const location = useLocation()
    const { toast } = useAppStore()
    const svgRef = useRef(null)
    const simRef = useRef(null)

    const [seed, setSeed] = useState(location.state?.topic || '')
    const [selected, setSelected] = useState(null)
    const [built, setBuilt] = useState(false)
    const [showLabels, setShowLabels] = useState(true)

    function buildMap(seedKw) {
        if (!seedKw.trim()) { toast('Enter a seed topic', 'e'); return }
        const eco = getEcosystem(seedKw)
        const nodes = []
        const links = []

        // Core node
        nodes.push({ id: 0, label: eco.core, type: 'core', cluster: -1, size: 28, color: eco.color || CLUSTER_COLORS[0], opp: 8 })

        let nid = 1
        eco.subs.forEach((sub, ci) => {
            const clr = CLUSTER_COLORS[(ci + 1) % CLUSTER_COLORS.length]
            const subId = nid++
            nodes.push({ id: subId, label: sub.name, type: 'cluster', cluster: ci, size: 18, color: clr, opp: 5 + Math.random() * 3.5 })
            links.push({ source: 0, target: subId, strength: .7 })
            sub.kws.slice(0, 3).forEach(kw => {
                const leafId = nid++
                const leafOpp = 2 + Math.random() * 7
                const isGap = leafOpp > 7
                nodes.push({ id: leafId, label: kw, type: 'leaf', cluster: ci, size: isGap ? 12 : 8, color: isGap ? '#ff5c35' : clr, kw, isGap, opp: leafOpp })
                links.push({ source: subId, target: leafId, strength: .4 })
            })
        })

        renderD3(nodes, links)
        setBuilt(true)
        setSelected(null)
        toast('Map built — ' + nodes.length + ' nodes', 'ok')
    }

    function renderD3(nodes, links) {
        const el = svgRef.current
        if (!el) return

        // Clear previous
        d3.select(el).selectAll('*').remove()
        if (simRef.current) simRef.current.stop()

        const W = el.clientWidth || 900
        const H = el.clientHeight || 520

        const svg = d3.select(el).attr('viewBox', `0 0 ${W} ${H}`)
        const g = svg.append('g')

        // Zoom
        const zoom = d3.zoom().scaleExtent([.25, 4]).on('zoom', e => g.attr('transform', e.transform))
        svg.call(zoom)

        // Glow filter
        const defs = svg.append('defs')
        const f = defs.append('filter').attr('id', 'glow').attr('x', '-50%').attr('y', '-50%').attr('width', '200%').attr('height', '200%')
        f.append('feGaussianBlur').attr('stdDeviation', '3').attr('result', 'blur')
        const merge = f.append('feMerge')
        merge.append('feMergeNode').attr('in', 'blur')
        merge.append('feMergeNode').attr('in', 'SourceGraphic')

        // Force simulation
        const sim = d3.forceSimulation(nodes)
            .force('link', d3.forceLink(links).id(d => d.id).distance(d => d.strength > .5 ? 110 : 55).strength(d => d.strength))
            .force('charge', d3.forceManyBody().strength(d => d.type === 'core' ? -500 : d.type === 'cluster' ? -200 : -80))
            .force('center', d3.forceCenter(W / 2, H / 2))
            .force('collision', d3.forceCollide().radius(d => d.size + 8))
        simRef.current = sim

        // Links
        const link = g.append('g').selectAll('line').data(links).join('line')
            .attr('stroke', 'rgba(0,229,204,.1)')
            .attr('stroke-width', d => d.strength > .5 ? 1.5 : .7)
            .attr('stroke-dasharray', d => d.strength < .5 ? '3,2' : 'none')

        // Nodes
        const node = g.append('g').selectAll('g').data(nodes).join('g')
            .attr('cursor', 'pointer')
            .call(
                d3.drag()
                    .on('start', (e, d) => { if (!e.active) sim.alphaTarget(.3).restart(); d.fx = d.x; d.fy = d.y })
                    .on('drag', (e, d) => { d.fx = e.x; d.fy = e.y })
                    .on('end', (e, d) => { if (!e.active) sim.alphaTarget(0); d.fx = null; d.fy = null })
            )

        // Gap pulse ring
        node.filter(d => d.isGap)
            .append('circle')
            .attr('r', d => d.size + 5)
            .attr('fill', 'none')
            .attr('stroke', '#ff5c35')
            .attr('stroke-width', 1.5)
            .attr('stroke-dasharray', '3,2')
            .attr('opacity', .5)
            .attr('filter', 'url(#glow)')

        // Main circle
        node.append('circle')
            .attr('r', d => d.size)
            .attr('fill', d => d.color + '22')
            .attr('stroke', d => d.color)
            .attr('stroke-width', d => d.type === 'core' ? 2.5 : 1.5)
            .attr('filter', d => d.type === 'core' || d.isGap ? 'url(#glow)' : 'none')

        // Labels
        node.append('text')
            .attr('text-anchor', 'middle')
            .attr('dy', d => d.type === 'leaf' ? -d.size - 4 : 4)
            .attr('font-size', d => d.type === 'core' ? 12 : d.type === 'cluster' ? 10 : 8)
            .attr('font-family', 'Syne, sans-serif')
            .attr('font-weight', d => d.type !== 'leaf' ? 700 : 400)
            .attr('fill', d => d.type === 'core' ? 'var(--accent)' : d.type === 'cluster' ? d.color : 'rgba(200,228,255,.6)')
            .attr('pointer-events', 'none')
            .text(d => d.label.length > 22 ? d.label.slice(0, 20) + '…' : d.label)

        // Score labels on clusters
        node.filter(d => d.type === 'cluster')
            .append('text')
            .attr('text-anchor', 'middle')
            .attr('dy', d => d.size + 13)
            .attr('font-size', 8)
            .attr('font-family', 'JetBrains Mono, monospace')
            .attr('fill', 'rgba(200,228,255,.4)')
            .attr('pointer-events', 'none')
            .text(d => d.opp.toFixed(1))

        // Click handler
        node.on('click', (e, d) => {
            e.stopPropagation()
            setSelected(d)
        })

        // Tick
        sim.on('tick', () => {
            link
                .attr('x1', d => d.source.x).attr('y1', d => d.source.y)
                .attr('x2', d => d.target.x).attr('y2', d => d.target.y)
            node.attr('transform', d => `translate(${d.x},${d.y})`)
        })

        // Deselect on canvas click
        svg.on('click', () => setSelected(null))
    }

    // Cleanup on unmount
    useEffect(() => () => { if (simRef.current) simRef.current.stop() }, [])

    // Auto-build if topic passed via navigation state
    useEffect(() => {
        if (location.state?.topic) buildMap(location.state.topic)
    }, [])

    return (
        <div className="page fade-in" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 80px)' }}>
            {/* Controls */}
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12, flexWrap: 'wrap' }}>
                <input className="inp" value={seed} onChange={e => setSeed(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && buildMap(seed)}
                    placeholder="Seed topic… AI tools, history, psychology"
                    style={{ maxWidth: 340 }} />
                <button className="btn" onClick={() => buildMap(seed)}>🗺️ Build Map</button>
                <button className="btn s" onClick={() => { if (simRef.current) { d3.select(svgRef.current).selectAll('g').attr('transform', null); simRef.current.alpha(0.3).restart() } }}>⊹ Reset</button>
                <button className="btn s" onClick={() => {
                    setShowLabels(p => {
                        d3.select(svgRef.current).selectAll('text').style('display', p ? 'none' : '')
                        return !p
                    })
                }}>🏷️ Labels</button>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: 12, alignItems: 'center' }}>
                    {[['#00e5cc', 'Core'], ['#b57aff', 'Cluster'], ['#ff5c35', 'Gap']].map(([c, l]) => (
                        <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 5, fontFamily: 'var(--fm)', fontSize: 10, color: 'var(--muted)' }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: c }} />{l}
                        </div>
                    ))}
                </div>
            </div>

            {/* Canvas */}
            <div style={{ flex: 1, position: 'relative', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--rl)', overflow: 'hidden', minHeight: 480 }}>
                {!built && (
                    <div className="empty" style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <div className="ei">🗺️</div>
                        <h3>Build a Topic Ecosystem Map</h3>
                        <p>Enter a seed topic to generate an interactive niche graph with cluster detection and gap signals.</p>
                    </div>
                )}
                <svg ref={svgRef} style={{ width: '100%', height: '100%' }} />

                {/* Selected node panel */}
                {selected && (
                    <div style={{ position: 'absolute', top: 16, right: 16, width: 260, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--rl)', padding: 18, boxShadow: '0 10px 30px rgba(0,0,0,.5)', animation: 'fadeIn .2s ease' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                            <div style={{ fontFamily: 'var(--fm)', fontSize: 9, textTransform: 'uppercase', letterSpacing: 2, color: 'var(--muted)' }}>Node Details</div>
                            <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: 14, lineHeight: 1 }}>✕</button>
                        </div>
                        <div style={{ fontFamily: 'var(--fd)', fontWeight: 700, fontSize: 16, color: selected.color, marginBottom: 6 }}>{selected.label}</div>
                        <div style={{ fontSize: 11.5, color: 'var(--muted)', marginBottom: 12, lineHeight: 1.5 }}>
                            Type: {selected.type}
                            {selected.isGap && <span style={{ marginLeft: 8, color: '#ff5c35', fontWeight: 700 }}>⚡ Gap Detected</span>}
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
                            <div style={{ background: 'var(--elevated)', borderRadius: 'var(--r)', padding: '8px 10px', textAlign: 'center' }}>
                                <div style={{ fontFamily: 'var(--fm)', fontSize: 18, fontWeight: 700, color: selected.color }}>{selected.opp.toFixed(1)}</div>
                                <div style={{ fontSize: 8, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: .5, marginTop: 2 }}>Opportunity</div>
                            </div>
                            <div style={{ background: 'var(--elevated)', borderRadius: 'var(--r)', padding: '8px 10px', textAlign: 'center' }}>
                                <div style={{ fontFamily: 'var(--fm)', fontSize: 18, fontWeight: 700, color: selected.isGap ? '#ff5c35' : 'var(--muted)' }}>{selected.isGap ? 'YES' : 'NO'}</div>
                                <div style={{ fontSize: 8, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: .5, marginTop: 2 }}>Gap Signal</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            <button className="btn" style={{ width: '100%', justifyContent: 'center', fontSize: 11, padding: '8px' }}
                                onClick={() => navigate('/explorer', { state: { keyword: selected.kw || selected.label } })}>
                                🔍 Analyze in Explorer
                            </button>
                            <button className="btn fac" style={{ width: '100%', justifyContent: 'center', fontSize: 11, padding: '8px' }}
                                onClick={() => navigate('/factory', { state: { topic: selected.kw || selected.label } })}>
                                🏭 Send to Factory
                            </button>
                        </div>
                    </div>
                )}

                {/* Legend bottom */}
                {built && (
                    <div style={{ position: 'absolute', bottom: 14, left: 14, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {[['⚡', 'Gap nodes pulse orange — click any node to analyse or send to Factory', 'rgba(0,0,0,.5)']].map(([icon, text, bg]) => (
                            <div key={text} style={{ background: bg, border: '1px solid var(--border)', borderRadius: 20, padding: '4px 10px', fontSize: 10, color: 'var(--muted)', fontFamily: 'var(--fm)', backdropFilter: 'blur(8px)' }}>
                                {icon} {text}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}