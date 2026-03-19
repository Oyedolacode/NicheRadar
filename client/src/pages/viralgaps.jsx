import React, { useState } from 'react'
import { useYouTube } from '../hooks/useYouTube'
import { useAppStore } from '../store/useAppStore'
import { scoreInfo, fmt } from '../lib/formulas'
import { useNavigate } from 'react-router-dom'

const KWS = ['AI tools for students', 'history shorts', 'psychology facts', 'minecraft documentaries', 'stoicism explained', 'weird science facts', 'coding projects beginners', 'personal finance young adults', 'ancient civilizations', 'dark history facts']

export default function ViralGaps() {
    const { fetchAndEnrich } = useYouTube()
    const { toast, setLoading } = useAppStore()
    const navigate = useNavigate()
    const [results, setResults] = useState([])
    const [busy, setBusy] = useState(false)

    async function scan() {
        setBusy(true); setLoading(true); setResults([])
        const out = []
        for (const kw of KWS) {
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
        <div style={{ padding: 22 }}>
            <p style={{ fontSize: 12.5, color: '#7aadc8', marginBottom: 13, maxWidth: 560, lineHeight: 1.6 }}>
                Topics where <strong style={{ color: 'var(--accent)' }}>demand outpaces supply</strong>.
                Formula: <code style={{ fontFamily: 'var(--fm)', color: 'var(--yellow)', fontSize: 11 }}>(vel × trend) ÷ saturation</code>
            </p>
            <button className="btn hot" onClick={scan} disabled={busy} style={{ marginBottom: 20 }}>
                {busy ? '⏳ Scanning…' : '⚡ Scan Viral Gaps'}
            </button>

            {results.length === 0 && !busy && (
                <div className="empty"><div className="ei">⚡</div><h3>Click Scan to Begin</h3>
                    <p>Analyses 10 trending niches using the Viral Gap formula.</p></div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(235px,1fr))', gap: 11 }}>
                {results.map(r => {
                    const si = scoreInfo(r.opp)
                    return (
                        <div key={r.kw} onClick={() => navigate('/explorer', { state: { keyword: r.kw } })}
                            style={{ background: 'var(--surface)', border: `1px solid ${si.color}55`, borderRadius: 'var(--rl)', padding: 18, cursor: 'pointer', transition: 'all .2s' }}
                            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                            onMouseLeave={e => e.currentTarget.style.transform = ''}>
                            <div style={{ fontFamily: 'var(--fm)', fontSize: 8.5, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 5 }}>{r.kw.toUpperCase()}</div>
                            <div style={{ fontFamily: 'var(--fm)', fontSize: 32, fontWeight: 700, color: si.color, lineHeight: 1, marginBottom: 4 }}>{r.opp.toFixed(1)}</div>
                            <div style={{ fontFamily: 'var(--fd)', fontSize: 12.5, fontWeight: 700, marginBottom: 9 }}>{si.label}</div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 6 }}>
                                {[['Views', fmt(r.avgV)], ['Videos', r.sat], ['Gap', r.vg.toFixed(1)]].map(([l, v]) => (
                                    <div key={l} style={{ background: 'var(--elevated)', borderRadius: 5, padding: 6, textAlign: 'center' }}>
                                        <div style={{ fontFamily: 'var(--fm)', fontSize: 11.5, fontWeight: 700 }}>{v}</div>
                                        <div style={{ fontSize: 8, color: 'var(--muted)', textTransform: 'uppercase' }}>{l}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                })}
                {busy && KWS.slice(results.length).map(kw => (
                    <div key={kw} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--rl)', padding: 18 }}>
                        <div className="sk" style={{ height: 11, width: '55%', marginBottom: 9 }} />
                        <div className="sk" style={{ height: 38, width: 60, marginBottom: 7 }} />
                        <div className="sk" style={{ height: 14, marginBottom: 9 }} />
                    </div>
                ))}
            </div>
        </div>
    )
}