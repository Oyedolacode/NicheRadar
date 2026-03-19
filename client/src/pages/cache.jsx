import React, { useState, useEffect } from 'react'
import { useCache } from '../hooks/useCache'
import { useAppStore } from '../store/useAppStore'

export default function Cache() {
    const { cKeys, cClear, cSize, cGet } = useCache()
    const { toast, quotaUsed } = useAppStore()
    const [keys, setKeys] = useState([])
    const [hits, setHits] = useState(0)
    const [bytes, setBytes] = useState(0)

    function refresh() {
        const k = cKeys()
        setKeys(k)
        setBytes(cSize())
    }

    useEffect(() => { refresh() }, [])

    function clear() {
        cClear()
        refresh()
        toast('Cache cleared', 'ok')
    }

    function exportData() {
        const all = {}
        cKeys().forEach(k => { try { all[k.replace('nr6_', '')] = JSON.parse(localStorage.getItem(k)) } catch (e) { } })
        const a = document.createElement('a')
        a.href = URL.createObjectURL(new Blob([JSON.stringify(all, null, 2)], { type: 'application/json' }))
        a.download = 'niche-radar-cache.json'
        a.click()
        toast('Cache exported', 'ok')
    }

    const searchKeys = keys.filter(k => k.includes('_s_'))

    return (
        <div style={{ padding: 22 }}>
            <div className="slbl">Cache Statistics</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 16, maxWidth: 660 }}>
                {[
                    { val: String(keys.length), label: 'Cached Entries', cls: 'ca' },
                    { val: (bytes / 1024).toFixed(1) + ' KB', label: 'Storage Used', cls: 'cg' },
                    { val: quotaUsed.toLocaleString(), label: 'Quota Used', cls: 'cy' },
                ].map(s => (
                    <div key={s.label} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--rl)', padding: '13px 15px' }}>
                        <div style={{ fontFamily: 'var(--fm)', fontSize: 21, fontWeight: 700, marginBottom: 2, color: `var(--${s.cls.replace('c', '')})` || 'var(--text)' }}>{s.val}</div>
                        <div style={{ fontSize: 10, color: 'var(--muted)' }}>{s.label}</div>
                    </div>
                ))}
            </div>
            <div style={{ display: 'flex', gap: 7, marginBottom: 18 }}>
                <button className="btn" onClick={refresh}>🔄 Refresh</button>
                <button className="btn s" onClick={clear}>🗑 Clear Cache</button>
                <button className="btn s" onClick={exportData}>📤 Export JSON</button>
            </div>

            <div className="card" style={{ marginBottom: 14 }}>
                <div className="ch"><div className="ct">Cached Keywords</div><div className="cm">24h TTL</div></div>
                <div style={{ padding: 13 }}>
                    {searchKeys.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: 20, color: 'var(--muted)', fontFamily: 'var(--fm)', fontSize: 11.5 }}>No cached keywords</div>
                    ) : (
                        searchKeys.map(k => {
                            try {
                                const d = JSON.parse(localStorage.getItem(k))
                                const age = Math.floor((Date.now() - d.t) / 60000)
                                const label = k.replace('nr6_s_', '').split('_40')[0]
                                const ttlLeft = Math.round((86400000 - (Date.now() - d.t)) / 3600000)
                                return (
                                    <div key={k} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--s2) var(--s3)', borderRadius: 'var(--r)', background: 'var(--elevated)', marginBottom: 'var(--s1)', fontSize: 11.5, fontFamily: 'var(--fm)' }}>
                                        <span>{label}</span>
                                        <span style={{ fontSize: 9.5, color: 'var(--muted)' }}>{age < 60 ? age + 'm' : Math.floor(age / 60) + 'h'} ago · {ttlLeft}h left</span>
                                    </div>
                                )
                            } catch (e) { return null }
                        })
                    )}
                </div>
            </div>

            <div className="card">
                <div className="ch"><div className="ct">System Notes</div></div>
                <div style={{ padding: 14, fontSize: 11.5, color: '#7aadc8', lineHeight: 1.85, fontFamily: 'var(--fm)' }}>
                    <div><span style={{ color: 'var(--orange)' }}>v6:</span> Full React + Express architecture — CORS permanently resolved</div>
                    <div><span style={{ color: 'var(--accent)' }}>AI generation:</span> Runs through /api/ai proxy — API key never touches the browser</div>
                    <div><span style={{ color: 'var(--accent)' }}>YouTube proxy:</span> /api/youtube proxy with server-side 5-min cache</div>
                    <div><span style={{ color: 'var(--accent)' }}>Bookmarks:</span> Persist in localStorage via Zustand persist middleware</div>
                    <div><span style={{ color: 'var(--accent)' }}>Cache TTL:</span> 24 hours — reduces YouTube API quota by 70–90%</div>
                </div>
            </div>
        </div>
    )
}