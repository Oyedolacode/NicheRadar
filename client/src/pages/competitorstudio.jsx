import React, { useState } from 'react'
import { useYouTube } from '../hooks/useYouTube'
import { useAppStore } from '../store/useAppStore'
import { useBookmarkStore } from '../store/useBookmarkStore'
import { fmt, fmtP, scoreInfo, oppScore } from '../lib/formulas'
import { useNavigate } from 'react-router-dom'

export default function CompetitorStudio() {
    const { fetchAndEnrich } = useYouTube()
    const { toast, setLoading } = useAppStore()
    const { competitors, saveCompetitor, removeCompetitor } = useBookmarkStore()
    const navigate = useNavigate()
    const [input, setInput] = useState('')
    const [analysis, setAnalysis] = useState(null)
    const [busy, setBusy] = useState(false)

    async function analyze() {
        const kw = input.trim()
        if (!kw) { toast('Enter a channel name or topic', 'e'); return }
        setBusy(true); setLoading(true); setAnalysis(null)
        try {
            const r = await fetchAndEnrich(kw)
            if (!r.enriched.length) { toast('No data found', 'w'); return }

            // Group by channel
            const byChannel = {}
            r.enriched.forEach(v => {
                if (!byChannel[v.chan]) byChannel[v.chan] = { chan: v.chan, chanId: v.chanId, videos: [], subs: v.subs }
                byChannel[v.chan].videos.push(v)
            })

            const channels = Object.values(byChannel)
                .filter(c => c.videos.length >= 2)
                .map(c => {
                    const avgViews = c.videos.reduce((a, b) => a + b.views, 0) / c.videos.length
                    const avgEng = c.videos.reduce((a, b) => a + b.eng, 0) / c.videos.length
                    const topVid = [...c.videos].sort((a, b) => b.views - a.views)[0]
                    const flop = [...c.videos].sort((a, b) => a.views - b.views)[0]
                    const winningTopics = c.videos.filter(v => v.views > avgViews * 1.5).map(v => v.title.split(' ').slice(0, 5).join(' ') + '…')
                    const failingTopics = c.videos.filter(v => v.views < avgViews * 0.5).map(v => v.title.split(' ').slice(0, 5).join(' ') + '…')
                    return { ...c, avgViews, avgEng, topVid, flop, winningTopics: winningTopics.slice(0, 3), failingTopics: failingTopics.slice(0, 3) }
                })
                .sort((a, b) => b.avgViews - a.avgViews)
                .slice(0, 8)

            setAnalysis({ kw, channels, sat: r.sat, trend: r.trend })
            toast('Competitor analysis complete', 'ok')
        } catch (e) { toast(e.message, 'e') }
        finally { setBusy(false); setLoading(false) }
    }

    return (
        <div className="page fade-in">
            <div style={{ background: 'linear-gradient(135deg,rgba(0,184,212,.08),rgba(0,229,204,.05))', border: '1px solid rgba(0,184,212,.25)', borderRadius: 'var(--r3)', padding: 'var(--s6)', marginBottom: 'var(--s6)' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--s2)', background: 'rgba(0,184,212,.12)', border: '1px solid rgba(0,184,212,.25)', borderRadius: 100, padding: '4px 14px', fontFamily: 'var(--fm)', fontSize: 10, color: 'var(--blue)', marginBottom: 'var(--s3)', fontWeight: 700 }}>
                    <span style={{ width: 6, height: 6, background: 'var(--blue)', borderRadius: '50%', boxShadow: '0 0 6px var(--blue)', animation: 'blink 1.5s infinite' }} />
                    👥 COMPETITOR STUDIO
                </div>
                <div style={{ fontFamily: 'var(--fd)', fontSize: 22, fontWeight: 800, marginBottom: 'var(--s2)' }}>Spy on the Best</div>
                <div style={{ fontSize: 13, color: '#7aadc8', lineHeight: 1.6, maxWidth: 640 }}>Deep-dive into any channel's strategy. Analyze their most successful videos, posting frequency, and audience retention hooks.</div>
            </div>

            <div style={{ display: 'flex', gap: 'var(--s2)', maxWidth: 700, marginBottom: 'var(--s6)' }}>
                <input className="inp" value={input} onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && analyze()}
                    placeholder="Topic or niche… AI tools, dark history, stoicism" />
                <button className="btn fac" onClick={analyze} disabled={busy}>{busy ? '⏳ Analyzing…' : '🎯 Analyze'}</button>
            </div>

            {!analysis && !busy && (
                <div className="empty"><div className="ei">🎯</div><h3>Competitor Studio Ready</h3>
                    <p>Enter a topic to see who dominates it, what's working for them, and where their gaps are.</p></div>
            )}

            {analysis && (
                <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
                        <div style={{ fontFamily: 'var(--fd)', fontWeight: 700, fontSize: 16 }}>"{analysis.kw}" — {analysis.channels.length} competitors</div>
                        <span className="pill strong">{analysis.sat} videos / 30d</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {analysis.channels.map((c, i) => (
                            <div key={c.chan} className="card">
                                <div className="ch">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--elevated)', display: 'grid', placeItems: 'center', fontFamily: 'var(--fm)', fontWeight: 700, fontSize: 12, flexShrink: 0, color: 'var(--accent)' }}>#{i + 1}</div>
                                        <div>
                                            <div className="ct">{c.chan}</div>
                                            <div className="cm">{fmt(c.subs)} subs · {c.videos.length} recent videos</div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                                        <button className="btn s" style={{ fontSize: '10.5px', padding: '5px 10px' }}
                                            onClick={() => { saveCompetitor({ channelTitle: c.chan, subs: c.subs, avgViews: c.avgViews }); toast('Competitor saved', 'ok') }}>
                                            🔖 Track
                                        </button>
                                        <button className="btn fac" style={{ fontSize: '10.5px', padding: '5px 10px' }}
                                            onClick={() => navigate('/factory', { state: { topic: analysis.kw } })}>
                                            🏭 Make Better
                                        </button>
                                    </div>
                                </div>
                                <div style={{ padding: '14px 17px', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, borderBottom: '1px solid var(--border)' }}>
                                    {[['Avg Views', fmt(c.avgViews), 'var(--hot)'], ['Subs', fmt(c.subs), 'var(--text)'], ['Avg Eng.', fmtP(c.avgEng), 'var(--yellow)'], ['Videos', c.videos.length, 'var(--accent)']].map(([l, v, color]) => (
                                        <div key={l} style={{ textAlign: 'center' }}>
                                            <div style={{ fontFamily: 'var(--fm)', fontSize: 18, fontWeight: 700, color }}>{v}</div>
                                            <div style={{ fontSize: 9.5, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: .5, marginTop: 2 }}>{l}</div>
                                        </div>
                                    ))}
                                </div>
                                <div style={{ padding: '14px 17px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                    <div>
                                        <div style={{ fontFamily: 'var(--fm)', fontSize: 9, textTransform: 'uppercase', letterSpacing: 1.5, color: 'var(--green)', marginBottom: 8, fontWeight: 700 }}>✅ Winning Topics</div>
                                        {c.winningTopics.length ? c.winningTopics.map((t, i) => (
                                            <div key={i} style={{ fontSize: 11.5, padding: '5px 9px', background: 'rgba(0,230,118,.06)', borderRadius: 'var(--r)', borderLeft: '2px solid var(--green)', marginBottom: 5 }}>{t}</div>
                                        )) : <div style={{ fontSize: 11, color: 'var(--muted)' }}>Not enough data</div>}
                                    </div>
                                    <div>
                                        <div style={{ fontFamily: 'var(--fm)', fontSize: 9, textTransform: 'uppercase', letterSpacing: 1.5, color: 'var(--red)', marginBottom: 8, fontWeight: 700 }}>❌ Failing Topics</div>
                                        {c.failingTopics.length ? c.failingTopics.map((t, i) => (
                                            <div key={i} style={{ fontSize: 11.5, padding: '5px 9px', background: 'rgba(255,68,68,.06)', borderRadius: 'var(--r)', borderLeft: '2px solid var(--red)', marginBottom: 5 }}>{t}</div>
                                        )) : <div style={{ fontSize: 11, color: 'var(--muted)' }}>Not enough data</div>}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}