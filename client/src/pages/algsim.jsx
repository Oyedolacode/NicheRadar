import React, { useState } from 'react'

export default function AlgSim() {
  const [inputs, setInputs] = useState({ 
    vel: 50, 
    eng: 5, 
    sat: 10,
    trend: 5,
    ctr: 8,
    avd: 40 
  })

  // Sim Logic
  const sim = () => {
    const v = inputs.vel, e = inputs.eng / 100, s = inputs.sat, t = inputs.trend
    const ctr = inputs.ctr / 100, avd = inputs.avd / 100
    
    const raw = (v * (1 + e * 10) * t) / Math.max(s,1)
    const score = Math.min(10, Math.log10(raw + 1) * 2.85)

    // Distribution Prediction
    const dist = Math.min(100, (score * 10) * (ctr / 0.08) * (avd / 0.40))
    
    return { score, dist }
  }

  const { score, dist } = sim()

  return (
    <div className="pg on">
      <div className="tb" style={{ position: 'relative', background: 'transparent', border: 'none', padding: '0 0 20px 0' }}>
        <div className="tb-l">
          <h1>Algorithm Simulator</h1>
          <p>Predict how the YouTube algorithm will treat your video metrics.</p>
        </div>
      </div>

      <div style={{ display: 'grid', grid_template_columns: '1fr 1.5fr', gap: '24px' }}>
        <div className="card" style={{ padding: '20px' }}>
          <div className="slbl">Simulator Inputs</div>
          <div className="v-stack" style={{ gap: '16px' }}>
            <div className="inp-group">
              <label className="slbl">View Velocity (V/hr)</label>
              <input type="range" min="0" max="5000" value={inputs.vel} onChange={(e) => setInputs({...inputs, vel: +e.target.value})} style={{ width: '100%' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--muted)' }}><span>0</span><span>{inputs.vel}</span><span>5000</span></div>
            </div>
            <div className="inp-group">
              <label className="slbl">Engagement Rate (%)</label>
              <input type="range" min="0" max="25" step="0.1" value={inputs.eng} onChange={(e) => setInputs({...inputs, eng: +e.target.value})} style={{ width: '100%' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--muted)' }}><span>0%</span><span>{inputs.eng}%</span><span>25%</span></div>
            </div>
            <div className="inp-group">
              <label className="slbl">Content Saturation</label>
              <input type="range" min="1" max="50" value={inputs.sat} onChange={(e) => setInputs({...inputs, sat: +e.target.value})} style={{ width: '100%' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--muted)' }}><span>1</span><span>{inputs.sat}</span><span>50</span></div>
            </div>
            <div className="inp-group">
              <label className="slbl">Trend Momentum</label>
              <input type="range" min="1" max="10" step="0.1" value={inputs.trend} onChange={(e) => setInputs({...inputs, trend: +e.target.value})} style={{ width: '100%' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--muted)' }}><span>1</span><span>{inputs.trend}</span><span>10</span></div>
            </div>
            <div className="inp-group">
              <label className="slbl">Target CTR (%)</label>
              <input type="range" min="1" max="20" step="0.1" value={inputs.ctr} onChange={(e) => setInputs({...inputs, ctr: +e.target.value})} style={{ width: '100%' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--muted)' }}><span>1%</span><span>{inputs.ctr}%</span><span>20%</span></div>
            </div>
          </div>
        </div>

        <div className="v-stack" style={{ gap: '20px' }}>
          <div className="card" style={{ padding: '24px', textAlign: 'center' }}>
            <div className="slbl">Predicted Performance</div>
            <div style={{ fontSize: '64px', fontWeight: 900, color: 'var(--accent)', lineHeight: 1 }}>{score.toFixed(1)}</div>
            <div style={{ fontSize: '10px', color: 'var(--muted)', marginTop: '8px', letterSpacing: '2px' }}>OPPORTUNITY SCORE</div>
            
            <div style={{ marginTop: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '8px' }}>
                <span>Distribution Confidence</span>
                <span style={{ color: 'var(--green)' }}>{dist.toFixed(0)}%</span>
              </div>
              <div style={{ height: '8px', background: 'var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ height: '100%', background: 'var(--accent)', width: `${dist}%`, transition: 'width 0.4s' }}></div>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: '20px' }}>
            <div className="slbl">Simulation Log</div>
            <div style={{ fontFamily: 'var(--fm)', fontSize: '11px', color: '#7aadc8', lineHeight: '1.6' }}>
              <div>[SYSTEM] Velocity factor: {(inputs.vel / 500).toFixed(2)}x</div>
              <div>[SYSTEM] Engagement multiplier: {(1 + inputs.eng / 10).toFixed(2)}x</div>
              <div>[SYSTEM] Saturation penalty: {(1 / inputs.sat).toFixed(2)}x</div>
              <div style={{ borderTop: '1px solid var(--border)', margin: '8px 0', paddingTop: '8px' }}>
                {score >= 8 ? '🟢 MASSIVE: Recommendation: Full production priority.' : 
                 score >= 6 ? '🟡 STRONG: Recommendation: Invest in high quality thumbnails.' :
                 '🔴 MODERATE: Recommendation: Pivot or niche down further.'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
