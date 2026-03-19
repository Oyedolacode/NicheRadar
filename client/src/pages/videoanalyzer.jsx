import React, { useState } from 'react'
import { useYouTube } from '../hooks/useYouTube'
import { useAppStore } from '../store/useAppStore'
import { useBookmarkStore } from '../store/useBookmarkStore'
import { scoreInfo, oppScore, fmt, fmtP } from '../lib/formulas'

function extractVideoId(url) {
    const patterns = [
        /(?:v=|\/shorts\/|youtu\.be\/)([A-Za-z0-9_-]{11})/,
        /^([A-Za-z0-9_-]{11})$/,
    ]
    for (const p of patterns) { const m = url.match(p); if (m) return m[1] }
    return null
}

const WHY_FACTORS = [
    { key: 'ctr', label: 'High curiosity title', check: s => s.titleScore > 0.65 },
    { key: 'small', label: 'Small channel punching up', check: s => s.subs < 50000 && s.views > 100000 },
    { key: 'vel', label: 'Very fast velocity', check: s => s.vel > 1000 },
    { key: 'low', label: 'Low competition topic', check: s => s.sat && s.sat < 15 },
    { key: 'eng', label: 'High engagement rate', check: s => s.eng > 0.05 },
    { key: 'trend', label: 'Trending topic', check: s => s.trend && s.trend > 7 },
]

function scoreTitle(t) {
    if (!t) return 0
    let s = 0.35
    if (/\d/.test(t)) s += .15
    if (['best', 'top', 'must', 'secret', 'hidden', 'shocking', 'never', 'only', 'truth'].some(w => t.toLowerCase().includes(w))) s += .12
    if (/^(why|what|how|when|which|who)/i.test(t) || t.includes('?')) s += .10
    if (t.length >= 40 && t.length <= 62) s += .08
    if (/(ai|chatgpt|viral|exposed|truth|explained)/i.test(t)) s += .10
    return Math.min(0.99, Math.max(0.02, s))
}

export default function VideoAnalyzer() {
    const { vidStats, chanStats } = useYouTube()
    const { toast, setLoading } = useAppStore()
    const { saveVideo, isNicheSaved } = useBookmarkStore()
    const [url, setUrl] = useState('')
    const [result, setResult] = useState(null)
    const [busy, setBusy] = useState(false)

    async function analyze() {
        const id = extractVideoId(url.trim())
        if (!id) { toast('Paste a valid YouTube URL or video ID', 'e'); return }
        setBusy(true); setLoading(true); setResult(null)
        try {
            const vData = await vidStats([id])
            const video = vData.items?.[0]
            if (!video) { toast('Video not found', 'e'); return }

            const views = +video.statistics?.viewCount || 0
            const likes = +video.statistics?.likeCount || 0
            const comments = +video.statistics?.commentCount || 0
            const pub = video.snippet?.publishedAt
            const chanId = video.snippet?.channelId
            const title = video.snippet?.title || ''
            const chan = video.snippet?.channelTitle || ''

            const cData = await chanStats([chanId])
            const subs = +cData.items?.[0]?.statistics?.subscriberCount || 0

            const vel = views / Math.max(1, (Date.now() - new Date(pub)) / 3_600_000)
            const eng = views > 0 ? (likes + comments) / views : 0
            const cs = views / Math.max(subs, 1)
            const titleScore = scoreTitle(title)
            const ago = Math.floor((Date.now() - new Date(pub)) / 86_400_000)

            const why = WHY_FACTORS.filter(f => f.check({ views, likes, comments, subs, vel, eng, cs, titleScore }))

            const vs = oppScore(vel, eng, 7, 20)
            const si = scoreInfo(vs)

            setResult({ id, title, chan, subs, views, likes, comments, vel, eng, cs, titleScore, ago, why, vs, si, pub, url: `https://youtube.com/watch?v=${id}`, thumb: video.snippet?.thumbnails?.high?.url })
            toast('Analysis complete', 'ok')
        } catch (e) { toast(e.message, 'e') }
        finally { setBusy(false); setLoading(false) }
    }

    return (
        <div style={{ padding: 22 }}>
            <p style={{ fontSize: 12.5, color: '#7aadc8', marginBottom: 16, maxWidth: 580, lineHeight: 1.6 }}>
                Paste any YouTube URL for an instant breakdown — topic classification, viral score, and <strong style={{ color: 'var(--text)' }}>why it worked</strong>.
            </p>
            <div style={{ display: 'flex', gap: 7, maxWidth: 700, marginBottom: 6 }}>
                <input className="inp" value={url} onChange={e => setUrl(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && analyze()}
                    placeholder="https://youtube.com/watch?v=... or paste a video ID" />
                <button className="btn" onClick={analyze} disabled={busy}>{busy ? '⏳' : '🎬'} Analyze</button>
            </div>
            <div style={{ fontSize: 10.5, color: 'var(--muted)', fontFamily: 'var(--fm)', marginBottom: 24 }}>
                Works with full URLs, short links (youtu.be), Shorts, and 11-character video IDs
            </div>

            {!result && !busy && (
                <div className="empty"><div className="ei">🎬</div><h3>Video Analyzer Ready</h3>
                    <p>Paste any YouTube URL to get an instant breakdown of why it worked.</p></div>
            )}

            {result && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    {/* Left: video info */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        <div className="card" style={{ overflow: 'hidden' }}>
                            {result.thumb && <img src={result.thumb} alt="" style={{ width: '100%', height: 180, objectFit: 'cover' }} />}
                            <div style={{ padding: '14px 16px' }}>
                                <div style={{ fontWeight: 700, fontSize: 14, lineHeight: 1.4, marginBottom: 6 }}>{result.title}</div>
                                <div style={{ fontFamily: 'var(--fm)', fontSize: 10, color: 'var(--muted)', marginBottom: 12 }}>{result.chan} · {result.ago}d ago</div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
                                    {[['Views', fmt(result.views), 'var(--hot)'], ['Subs', fmt(result.subs), 'var(--text)'], ['Likes', fmt(result.likes), 'var(--green)'], ['Comments', fmt(result.comments), 'var(--blue)'], ['Velocity', fmt(result.vel) + '/hr', 'var(--accent)'], ['Eng. Rate', fmtP(result.eng), 'var(--yellow)']].map(([l, v, c]) => (
                                        <div key={l} style={{ background: 'var(--elevated)', borderRadius: 'var(--r)', padding: '8px 10px', textAlign: 'center' }}>
                                            <div style={{ fontFamily: 'var(--fm)', fontSize: 13, fontWeight: 700, color: c }}>{v}</div>
                                            <div style={{ fontSize: 9, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: .5, marginTop: 2 }}>{l}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <button className="btn s" style={{ flex: 1, justifyContent: 'center' }} onClick={() => window.open(result.url, '_blank')}>▶ Watch</button>
                            <button className="btn s" style={{ flex: 1, justifyContent: 'center' }} onClick={() => { saveVideo({ title: result.title, chan: result.chan, url: result.url, views: result.views }); toast('Saved', 'ok') }}>🔖 Save</button>
                        </div>
                    </div>

                    {/* Right: analysis */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {/* Score */}
                        <div className="card" style={{ padding: '16px 18px' }}>
                            <div style={{ fontFamily: 'var(--fm)', fontSize: 9, textTransform: 'uppercase', letterSpacing: 2, color: 'var(--muted)', marginBottom: 8 }}>Video Score</div>
                            <div style={{ fontFamily: 'var(--fm)', fontSize: 42, fontWeight: 700, color: result.si.color, lineHeight: 1, marginBottom: 4 }}>{result.vs.toFixed(1)}</div>
                            <span className={`pill ${result.si.cls}`} style={{ marginBottom: 10, display: 'inline-flex' }}>{result.si.label}</span>
                            <div style={{ fontSize: 12, color: '#7aadc8', lineHeight: 1.55, marginTop: 8 }}>{result.si.desc}</div>
                        </div>

                        {/* Why it worked */}
                        <div className="card" style={{ padding: '16px 18px' }}>
                            <div style={{ fontFamily: 'var(--fm)', fontSize: 9, textTransform: 'uppercase', letterSpacing: 2, color: 'var(--muted)', marginBottom: 12 }}>Why It Worked</div>
                            {result.why.length === 0 ? (
                                <p style={{ fontSize: 12, color: 'var(--muted)' }}>No strong signals detected — average performance metrics.</p>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                    {result.why.map(f => (
                                        <div key={f.key} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '8px 11px', background: 'var(--elevated)', borderRadius: 'var(--r)', borderLeft: '3px solid var(--accent)' }}>
                                            <span style={{ fontSize: 15 }}>✅</span>
                                            <span style={{ fontSize: 12.5 }}>{f.label}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Title score */}
                        <div className="card" style={{ padding: '16px 18px' }}>
                            <div style={{ fontFamily: 'var(--fm)', fontSize: 9, textTransform: 'uppercase', letterSpacing: 2, color: 'var(--muted)', marginBottom: 8 }}>Title CTR Score</div>
                            <div style={{ fontFamily: 'var(--fm)', fontSize: 28, fontWeight: 700, color: result.titleScore >= .7 ? 'var(--green)' : result.titleScore >= .5 ? 'var(--yellow)' : 'var(--hot)', marginBottom: 8 }}>
                                {Math.round(result.titleScore * 100)}%
                            </div>
                            <div style={{ height: 5, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: `${result.titleScore * 100}%`, background: result.titleScore >= .7 ? 'var(--green)' : result.titleScore >= .5 ? 'var(--yellow)' : 'var(--hot)', transition: 'width 1s' }} />
                            </div>
                            <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 6 }}>
                                {result.titleScore >= .7 ? '🔥 Strong title — good CTR signal' : result.titleScore >= .5 ? '⚖️ Average title — room to improve' : '⚠️ Weak title — add numbers or power words'}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}