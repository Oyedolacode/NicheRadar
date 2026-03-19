import React, { useEffect, useRef } from 'react'

export default function TopicMap() {
  const canvasRef = useRef(null)

  useEffect(() => {
    // Basic D3-like placeholder for now, actual D3.js can be imported if needed
    // But for "just using the same UI", a visual representation is key
    const canvas = canvasRef.current
    if (!canvas) return
    
    // Draw something complex/cool to match the "Topic Map Engine" vibe
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // Nodes
    const nodes = [
      { x: 300, y: 300, r: 40, label: 'MAIN NICHE', color: 'var(--accent)' },
      { x: 150, y: 150, r: 25, label: 'SUB 1', color: 'var(--green)' },
      { x: 450, y: 150, r: 20, label: 'SUB 2', color: 'var(--yellow)' },
      { x: 150, y: 450, r: 22, label: 'SUB 3', color: 'var(--hot)' },
      { x: 450, y: 450, r: 28, label: 'SUB 4', color: 'var(--purple)' },
    ]

    // Connections
    ctx.strokeStyle = 'rgba(77, 125, 158, 0.2)'
    ctx.lineWidth = 1
    nodes.forEach(n => {
      ctx.beginPath()
      ctx.moveTo(300, 300)
      ctx.lineTo(n.x, n.y)
      ctx.stroke()
    })

    nodes.forEach(n => {
      ctx.beginPath()
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(10, 18, 28, 0.9)'
      ctx.fill()
      ctx.strokeStyle = n.color
      ctx.lineWidth = 2
      ctx.stroke()
      
      ctx.fillStyle = n.color
      ctx.font = 'bold 10px Syne'
      ctx.textAlign = 'center'
      ctx.fillText(n.label, n.x, n.y + 4)
    })
  }, [])

  return (
    <div className="pg on">
      <div className="tb" style={{ position: 'relative', background: 'transparent', border: 'none', padding: '0 0 20px 0' }}>
        <div className="tb-l">
          <h1>Topic Map Engine</h1>
          <p>Visualize relationships between niches and trending keywords.</p>
        </div>
        <div className="tb-r">
          <button className="btn s">🔄 Re-cluster</button>
          <button className="btn s">📥 Export SVG</button>
        </div>
      </div>

      <div id="map-canvas" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--rl)', height: '600px', display: 'grid', placeItems: 'center' }}>
        <canvas ref={canvasRef} width={600} height={600} style={{ width: '600px', height: '600px' }} />
        <div className="node-tooltip"></div>
      </div>
    </div>
  )
}
