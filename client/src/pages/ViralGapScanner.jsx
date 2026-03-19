import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useYouTube } from '../hooks/useYouTube'
import { useAppStore } from '../store/useAppStore'
import { scoreInfo, fmt } from '../lib/formulas'

const SEEDS = ['AI for entrepreneurs', 'stoicism daily', 'modern stoic', 'dark psychology', 'hidden history', 'science of luck', 'coding for non-coders', 'personal finance basics', 'ancient secrets', 'mystery facts']

export default function ViralGapScanner() {
    const { fetchAndEnrich } = useYouTube()
    const { toast, setLoading } = useAppStore()
    const navigate = useNavigate()
    const [results, setResults] = useState([])
    const [busy, setBusy] = useState(false)

    async function scan() {
        setBusy(true); setLoading(true); setResults([])
        const out = []
        for (const kw of SEEDS) {
            try {
                const r = await fetchAndEnrich(kw)
                const avgV = r.enriched.reduce((a, b) => a + b.views, 0) / Math.max(r.enriched.length, 1)
                out.push({ ...r, avgV })
                setResults([...out])
            } catch (e) { }
        }
        setBusy(false); setLoading(false)
        toast('Scan complete', 'ok')
    }

    return (
        <div>
            <button className="btn hot" onClick={scan} disabled={busy} style={{ marginBottom: 24 }}>
                {busy ? '⏳ Scanning…' : '⚡ Scan Viral Gaps'}
            </button>

            {results.length === 0 && !busy && (
                <div className="empty">
                    <div className="ei">⚡</div>
                    <h3>Start Viral Gap Scan</h3>
                    <p>Cross-references 10 niche topics to find the highest probability outliers.</p>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 12 }}>
                {results.map(r => {
                    const si = scoreInfo(r.opp)
                    return (
                        <div key={r.kw} onClick={() => navigate('/explorer', { state: { keyword: r.kw } })}
                            style={{ background: 'var(--surface)', border: `1px solid ${si.color}55`, borderRadius: 'var(--r2)', padding: 18, cursor: 'pointer', transition: 'all .2s' }}
                            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                            onMouseLeave={e => e.currentTarget.style.transform = ''}>
                            <div style={{ fontFamily: 'var(--fm)', fontSize: 9, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8 }}>{r.kw.toUpperCase()}</div>
                            <div style={{ fontFamily: 'var(--fm)', fontSize: 32, fontWeight: 700, color: si.color, lineHeight: 1, marginBottom: 3 }}>{r.opp.toFixed(1)}</div>
                            <div style={{ fontFamily: 'var(--fd)', fontSize: 13, fontWeight: 700, marginBottom: 12 }}>{si.label}</div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
                                {[['Views', fmt(r.avgV)], ['Videos', r.sat], ['Gap', r.vg.toFixed(1)]].map(([l, v]) => (
                                    <div key={l} style={{ background: 'var(--elevated)', borderRadius: 'var(--r1)', padding: 6, textAlign: 'center' }}>
                                        <div style={{ fontFamily: 'var(--fm)', fontSize: 10.5, fontWeight: 700 }}>{v}</div>
                                        <div style={{ fontSize: 8, color: 'var(--muted)', textTransform: 'uppercase', marginTop: 1 }}>{l}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
