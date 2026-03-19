import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'
import { oppScore, scoreInfo } from '../lib/formulas'

export default function AlgoSimulator() {
    const location = useLocation()
    const { toast } = useAppStore()

    const [topic, setTopic] = useState(location.state?.topic || '')
    const [stats, setStats] = useState({ subs: 1000, uploadFreq: 2, avgViews: 500, quality: 7 })
    const [result, setResult] = useState(null)

    function run() {
        if (!topic.trim()) { toast('Enter a topic', 'e'); return }
        
        // Simulating some niche data (or use real data if we had it)
        const nicheVel = 50 + Math.random() * 200
        const nicheEng = 0.05 + Math.random() * 0.1
        const nicheTrend = 4 + Math.random() * 5
        const nicheSat = 10 + Math.random() * 20
        
        const baseScore = oppScore(nicheVel, nicheEng, nicheTrend, nicheSat)
        
        // Simulation logic: user stats + niche potential + quality
        const qualityMult = stats.quality / 5
        const channelMult = Math.log10(stats.subs + 10) / 4
        
        const predictedViews = Math.round(nicheVel * 24 * 7 * qualityMult * channelMult)
        const predictedSubs = Math.round(predictedViews * 0.01 * (stats.quality / 10))
        const viralProb = Math.min(99, Math.round(baseScore * stats.quality))

        setResult({
            views: predictedViews,
            subs: predictedSubs,
            prob: viralProb,
            score: baseScore,
            si: scoreInfo(baseScore)
        })
        toast('Simulation complete!', 'ok')
    }

    return (
        <div className="page fade-in">
            <div style={{ background: 'linear-gradient(135deg,rgba(77,159,255,.08),rgba(0,229,204,.05))', border: '1px solid rgba(77,159,255,.25)', borderRadius: 'var(--r3)', padding: 'var(--s6)', marginBottom: 'var(--s6)' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--s2)', background: 'rgba(77,159,255,.12)', border: '1px solid rgba(77,159,255,.25)', borderRadius: 100, padding: '4px 14px', fontFamily: 'var(--fm)', fontSize: 10, color: 'var(--blue)', marginBottom: 'var(--s3)', fontWeight: 700 }}>
                    <span style={{ width: 6, height: 6, background: 'var(--blue)', borderRadius: '50%', animation: 'blink 1.5s infinite' }} />
                    🎮 ALGORITHM SIMULATOR
                </div>
                <div style={{ fontFamily: 'var(--fd)', fontSize: 22, fontWeight: 800, marginBottom: 'var(--s2)' }}>Viral Prediction Engine</div>
                <div style={{ fontSize: 13, color: '#7aadc8', lineHeight: 1.6, maxWidth: 640 }}>Simulate the YouTube recommendation algorithm. Upload video metadata to predict impressions, CTR, and reach based on viral patterns.</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 380px) 1fr', gap: 20 }}>
                {/* Inputs */}
                <div className="card" style={{ padding: 20, border: '1px solid var(--border)', background: 'var(--surface)' }}>
                    <div className="slbl">Topic Potential</div>
                    <input className="inp" style={{ width: '100%', marginBottom: 15 }} value={topic} onChange={e => setTopic(e.target.value)} placeholder="Topic name…" />
                    
                    <div className="slbl">Channel Power</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: 'var(--fm)', fontSize: 10, color: 'var(--muted)' }}>
                            <span>SUBSCRIBERS</span>
                            <span>{stats.subs.toLocaleString()}</span>
                            <input type="range" min="0" max="1000000" step="1000" value={stats.subs} onChange={e => setStats({ ...stats, subs: +e.target.value })} style={{ width: '100%', marginTop: 4 }} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: 'var(--fm)', fontSize: 10, color: 'var(--muted)' }}>
                            <span>UPLOAD FREQUENCY (Videos/Week)</span>
                            <span>{stats.uploadFreq}</span>
                            <input type="range" min="0" max="14" step="1" value={stats.uploadFreq} onChange={e => setStats({ ...stats, uploadFreq: +e.target.value })} style={{ width: '100%', marginTop: 4 }} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: 'var(--fm)', fontSize: 10, color: 'var(--muted)' }}>
                            <span>VIDEO QUALITY / RETENTION</span>
                            <span>{stats.quality}/10</span>
                            <input type="range" min="1" max="10" step="1" value={stats.quality} onChange={e => setStats({ ...stats, quality: +e.target.value })} style={{ width: '100%', marginTop: 4 }} />
                        </div>
                    </div>
                    
                    <button className="btn sim" style={{ width: '100%' }} onClick={run}>Run Simulation</button>
                </div>

                {/* Results */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
                    {!result ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, border: '1px dashed var(--border)', borderRadius: 'var(--rl)', color: 'var(--dim)' }}>
                            <div style={{ fontSize: 32, marginBottom: 10 }}>🎮</div>
                            <div style={{ fontFamily: 'var(--fm)', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1.5 }}>Awaiting Input</div>
                        </div>
                    ) : (
                        <>
                            <div className="card" style={{ padding: 22, border: '1px solid var(--border)', background: 'var(--elevated)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                                    <div>
                                        <div style={{ fontFamily: 'var(--fm)', fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1 }}>PREDICTED OUTCOME</div>
                                        <div style={{ fontFamily: 'var(--fd)', fontSize: 18, fontWeight: 700 }}>"{topic}"</div>
                                    </div>
                                    <div style={{ background: result.si.color + '22', border: `1px solid ${result.si.color}`, borderRadius: 20, padding: '4px 12px', fontSize: 10, fontWeight: 700, color: result.si.color }}>{result.si.label} TOPIC</div>
                                </div>
                                
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                                    {[
                                        { l: 'Est. Views (7d)', v: result.views.toLocaleString(), sub: 'algorithmic push', color: 'var(--accent)' },
                                        { l: 'Est. Sub Gain', v: '+ ' + result.subs.toLocaleString(), sub: 'per new views', color: 'var(--green)' },
                                        { l: 'Viral Probability', v: result.prob + '%', sub: 'vs benchmark', color: 'var(--purple)' },
                                    ].map(res => (
                                        <div key={res.l} style={{ background: 'var(--surface)', padding: 15, borderRadius: 'var(--r)', border: '1px solid var(--border)' }}>
                                            <div style={{ fontFamily: 'var(--fm)', fontSize: 9, color: 'var(--muted)', marginBottom: 6 }}>{res.l}</div>
                                            <div style={{ fontSize: 20, fontWeight: 800, color: res.color }}>{res.v}</div>
                                            <div style={{ fontSize: 9.5, color: 'var(--dim)', marginTop: 2 }}>{res.sub}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="card" style={{ padding: 20, border: '1px solid var(--border)' }}>
                                <div className="slbl" style={{ marginBottom: 12 }}>Breakdown vs Niche Benchmark</div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                                    {[
                                        { label: 'Topic Opportunity', val: result.score.toFixed(1) + '/10', pct: result.score * 10, color: 'var(--accent)' },
                                        { label: 'Video Quality Multiplier', val: (stats.quality/5).toFixed(1) + 'x', pct: stats.quality * 10, color: 'var(--purple)' },
                                        { label: 'Channel Authority', val: (Math.log10(stats.subs + 10)/4 * 10).toFixed(1) + '/10', pct: Math.log10(stats.subs + 10)/4 * 100, color: 'var(--green)' },
                                    ].map(row => (
                                        <div key={row.label}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 5 }}>
                                                <span>{row.label}</span>
                                                <span style={{ fontFamily: 'var(--fm)', fontWeight: 700, color: row.color }}>{row.val}</span>
                                            </div>
                                            <div style={{ width: '100%', height: 4, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
                                                <div style={{ height: '100%', width: `${row.pct}%`, background: row.color, borderRadius: 2 }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                
                                <div style={{ marginTop: 20, padding: 12, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r)', fontSize: 11.5, color: 'var(--muted)', lineHeight: 1.5 }}>
                                    <strong style={{ color: 'var(--text)' }}>Simulation Summary:</strong> Given your currently channel power of {stats.subs.toLocaleString()} subscribers and a topic score of {result.score.toFixed(1)}, this video is likely to {result.prob > 60 ? 'break your channel average' : 'perform within standard expectations'}. Increasing video quality to {stats.quality + 1}/10 would result in approximately {Math.round(result.views * 0.2)} additional views.
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
