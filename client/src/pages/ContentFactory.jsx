import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useYouTube } from '../hooks/useYouTube'
import { useAppStore } from '../store/useAppStore'
import { useQueueStore } from '../store/useQueueStore'
import { scoreInfo, compLevel, fmt } from '../lib/formulas'

// ── Local generators (no API needed) ────────
const TOPIC_DB = {
    ai: { hooks: ['Most people use AI completely wrong', 'I tested every AI tool so you don\'t have to', 'The AI tool that replaced my entire workflow'], formats: ['list', 'howto', 'comparison', 'secrets'] },
    history: { hooks: ['This event was erased from history books', 'The real story nobody told you', 'History class never taught you this'], formats: ['documentary', 'facts', 'mystery', 'dark'] },
    psychology: { hooks: ['Your brain is lying to you', 'Why smart people make terrible decisions', 'This trick controls people without them knowing'], formats: ['explained', 'facts', 'tactics', 'case study'] },
    stoicism: { hooks: ['Marcus Aurelius had one daily habit that changed everything', 'Stoics knew something modern people forgot', 'One rule that eliminates 80% of stress'], formats: ['explained', 'lessons', 'habits', 'philosophy'] },
    finance: { hooks: ['I saved $10K in 6 months doing this', 'Why you\'re still broke despite working hard', 'The money rule the rich follow silently'], formats: ['beginners', 'strategy', 'mistakes', 'habits'] },
    science: { hooks: ['This breaks every rule of physics', 'Scientists discovered something impossible', 'This discovery changed how we see reality'], formats: ['explained', 'experiments', 'facts', 'discoveries'] },
}
function getDB(t) { const b = t.toLowerCase(); for (const [k, v] of Object.entries(TOPIC_DB)) if (b.includes(k)) return v; return { hooks: ['Nobody is talking about this', 'I tried this for 30 days', 'The truth about ' + t], formats: ['explained', 'facts', 'tips', 'guide'] } }
function randPick(a) { return a[Math.floor(Math.random() * a.length)] }

function generateIdeas(topic) {
    const db = getDB(topic)
    const types = ['List', 'HowTo', 'Curiosity', 'Story', 'Facts', 'Comparison', 'Documentary', 'Secrets', 'Tutorial', 'Mistakes', 'Controversy', 'Warning']
    const prefixes = ['5', '7', '10', 'The', 'Why', 'How', 'I tried', 'Stop making these', 'The truth about', 'What nobody tells you about']
    const suffixes = ['nobody talks about', 'that actually work', 'explained', '(shocking)', 'in 30 days', 'that changed everything', 'for beginners', 'mistakes', 'secrets revealed', 'you need to know']
    return types.map((type, i) => ({
        title: `${prefixes[i % prefixes.length]} ${topic} ${suffixes[i % suffixes.length]}`.trim(),
        angle: `A ${type.toLowerCase()} format exploring ${topic}`,
        hook: db.hooks[i % db.hooks.length],
        type,
        viralScore: Math.round(5 + Math.random() * 4.5)
    })).slice(0, 12)
}

function generateTitles(topic) {
    const pw = ['secretly', 'exposed', 'truth', 'hidden', 'shocking', 'nobody knows', 'must know']
    return [
        { t: `5 ${topic} ${randPick(['secrets', 'facts', 'tips', 'hacks'])} nobody talks about`, type: 'List', ctr: 85 },
        { t: `The truth about ${topic} (${randPick(['shocking', 'most won\'t believe this'])})`, type: 'Curiosity', ctr: 82 },
        { t: `How to master ${topic} in 30 days (step by step)`, type: 'HowTo', ctr: 79 },
        { t: `Why everyone is wrong about ${topic}`, type: 'Controversy', ctr: 83 },
        { t: `I tested ${topic} for 30 days — here's what happened`, type: 'Story', ctr: 77 },
        { t: `5 ${topic} mistakes that are holding you back`, type: 'Mistakes', ctr: 81 },
        { t: `The complete ${topic} guide for beginners 2025`, type: 'Tutorial', ctr: 72 },
        { t: `${topic.charAt(0).toUpperCase() + topic.slice(1)} exposed (honest review)`, type: 'Explainer', ctr: 74 },
        { t: `What nobody tells you about ${topic} (until it's too late)`, type: 'Warning', ctr: 86 },
        { t: `Stop wasting time on ${topic} — do this instead`, type: 'Action', ctr: 80 },
    ].map(t => ({ ...t, ctr: Math.min(99, Math.max(55, t.ctr + Math.round((Math.random() - .5) * 10))) }))
}

function generateThumbs(topic) {
    return [
        { concept: 'Shocked face with bold text overlay', layout: 'center focus', textOverlay: topic.toUpperCase().slice(0, 12) + ' SECRET', emoji: '😱', style: 'shocking', bg: 'linear-gradient(135deg,#1a0505,#4a0a0a)' },
        { concept: 'Before/after split comparison', layout: 'before-after', textOverlay: 'BEFORE vs AFTER', emoji: '🔄', style: 'educational', bg: 'linear-gradient(135deg,#051a2e,#0a1a10)' },
        { concept: 'Bold number with topic visual', layout: 'left-right split', textOverlay: '5 HIDDEN FACTS', emoji: '💡', style: 'curious', bg: 'linear-gradient(135deg,#1a1500,#3a3000)' },
        { concept: 'Curious face with question marks', layout: 'center focus', textOverlay: 'WHY??', emoji: '🤔', style: 'entertaining', bg: 'linear-gradient(135deg,#1a0a2e,#2d1060)' },
    ]
}

function generateScript(topic, title, length) {
    const db = getDB(topic)
    const dur = { short: '60 seconds', medium: '8–12 minutes', long: '20–30 minutes' }
    const nSections = length === 'short' ? 1 : length === 'medium' ? 3 : 5
    return {
        hook: `"${db.hooks[0]}"\n\n[Pause 2 seconds, eye contact with camera]\n\n"In the next ${dur[length]}, I'll show you exactly what this means for ${topic} — and it will completely change how you approach it."`,
        intro: `Welcome back! Today we're diving deep into ${topic}. Quick overview of what we'll cover: [3 main points]. By the end you'll have a clear action plan.`,
        sections: Array.from({ length: nSections }, (_, i) => ({
            title: `Key Point ${i + 1}`,
            content: `Here's what most people miss about ${topic} — [specific insight ${i + 1}]. Let me show you exactly how this works with a real example: [concrete scenario with specifics]...`,
            duration: length === 'short' ? '10–15s' : length === 'medium' ? '2–3 min' : '4–5 min'
        })),
        examples: `Real example: [Specific person or scenario]\n\nHere's exactly what happened: [Story with concrete numbers/results]\n\nKey lesson: [One-sentence takeaway tied to your main point]`,
        conclusion: `To summarize:\n\n1. ${topic} works best when you [key insight 1]\n2. Biggest mistake is [mistake] — instead do [solution]\n3. Your first action step: [specific action they can take today]\n\nRemember: [motivational closer]`,
        cta: `If this helped, hit like — it helps the channel grow.\n\nSubscribe for more content like this.\n\nDrop a comment: what's your biggest challenge with ${topic}?`,
        totalDuration: dur[length]
    }
}

const TYPE_COLORS = { List: 'var(--accent)', HowTo: 'var(--green)', Curiosity: 'var(--purple)', Story: 'var(--yellow)', Facts: 'var(--hot)', Comparison: 'var(--blue)', Documentary: 'var(--orange)', Secrets: 'var(--hot)', Tutorial: 'var(--green)', Mistakes: 'var(--red)', Controversy: 'var(--hot)', Warning: 'var(--red)', Action: 'var(--accent)', Explainer: 'var(--blue)' }

export default function ContentFactory() {
    const { fetchAndEnrich } = useYouTube()
    const { toast, setLoading } = useAppStore()
    const { addToQueue } = useQueueStore()
    const location = useLocation()
    const navigate = useNavigate()

    const [topic, setTopic] = useState(location.state?.topic || '')
    const [length, setLength] = useState('medium')
    const [busy, setBusy] = useState(false)
    const [step, setStep] = useState(-1)
    const [tab, setTab] = useState('ideas')
    const [data, setData] = useState(null)
    const [selectedIdea, setSelectedIdea] = useState(null)
    const [selectedTitle, setSelectedTitle] = useState(null)
    const [validation, setValidation] = useState(null)

    async function run() {
        if (!topic.trim()) { toast('Enter a topic', 'e'); return }
        setBusy(true); setLoading(true); setData(null); setStep(0)
        setSelectedIdea(null); setSelectedTitle(null); setTab('ideas')
        try {
            setStep(1)
            let nd = null; try { nd = await fetchAndEnrich(topic) } catch (e) { }
            setValidation({ nd, topic })
            await new Promise(r => setTimeout(r, 100))
            setStep(2)
            const ideas = generateIdeas(topic)
            await new Promise(r => setTimeout(r, 100))
            setStep(3)
            const titles = generateTitles(topic)
            await new Promise(r => setTimeout(r, 100))
            setStep(4)
            const thumbs = generateThumbs(topic)
            await new Promise(r => setTimeout(r, 100))
            setStep(5)
            const script = generateScript(topic, titles[0]?.t || topic, length)
            setStep(6)
            setData({ ideas, titles, thumbs, script })
            toast('🏭 Factory complete!', 'ok')
        } catch (e) { toast(e.message, 'e') }
        finally { setBusy(false); setLoading(false) }
    }

    const STEPS = ['📥 Input', '✅ Validate', '💡 Ideas', '✏️ Titles', '🖼️ Thumbs', '📝 Script', '📋 Queue']

    return (
        <div style={{ padding: 22 }}>
            <div style={{ background: 'linear-gradient(135deg,rgba(255,159,67,.08),rgba(0,229,204,.04))', border: '1px solid rgba(255,159,67,.22)', borderRadius: 'var(--rl)', padding: '22px 26px', marginBottom: 20 }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,159,67,.1)', border: '1px solid rgba(255,159,67,.22)', borderRadius: 20, padding: '4px 12px', fontFamily: 'var(--fm)', fontSize: 10, color: 'var(--orange)', marginBottom: 12, fontWeight: 700 }}>
                    <span style={{ width: 6, height: 6, background: 'var(--orange)', borderRadius: '50%', animation: 'blink 1.5s infinite', display: 'block' }} />
                    🏭 CONTENT FACTORY
                </div>
                <div style={{ fontFamily: 'var(--fd)', fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Niche Signal → Publish-Ready Video</div>
                <div style={{ fontSize: 13, color: '#7aadc8', lineHeight: 1.6, maxWidth: 640 }}>Enter any topic. Get 12 ideas, 10 optimized titles, 4 thumbnail concepts, and a full script — ready to film.</div>
            </div>

            {/* Flow steps */}
            <div style={{ display: 'flex', gap: 0, marginBottom: 20, overflowX: 'auto', paddingBottom: 8 }}>
                {STEPS.map((s, i) => (
                    <div key={i} style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', padding: '0 8px' }}>
                        {i > 0 && <div style={{ position: 'absolute', left: -6, top: 14, color: 'var(--dim)', fontSize: 14, fontWeight: 700 }}>→</div>}
                        <div style={{ width: 44, height: 44, borderRadius: '50%', background: i < step ? 'rgba(255,159,67,.1)' : i === step && busy ? 'var(--adim)' : 'var(--elevated)', border: `2px solid ${i < step ? 'var(--orange)' : i === step && busy ? 'var(--accent)' : 'var(--border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, marginBottom: 6, transition: 'all .4s', boxShadow: i < step ? '0 0 12px rgba(255,159,67,.25)' : i === step && busy ? '0 0 12px var(--aglow)' : 'none', animation: i === step && busy ? 'pulse .8s infinite' : 'none' }}>
                            {s.split(' ')[0]}
                        </div>
                        <div style={{ fontFamily: 'var(--fm)', fontSize: 9, textTransform: 'uppercase', letterSpacing: 1, color: i <= step ? 'var(--text)' : 'var(--muted)', textAlign: 'center', maxWidth: 60 }}>{s.split(' ').slice(1).join(' ')}</div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'flex', gap: 7, maxWidth: 700, marginBottom: 6 }}>
                <input className="inp" value={topic} onChange={e => setTopic(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && run()} placeholder="Topic… AI tools for students, dark history, stoicism" />
                <select className="inp" value={length} onChange={e => setLength(e.target.value)} style={{ maxWidth: 180 }}>
                    <option value="short">Shorts (60s)</option>
                    <option value="medium">Medium (8–12 min)</option>
                    <option value="long">Long (20–30 min)</option>
                </select>
                <button className="btn fac" onClick={run} disabled={busy}>{busy ? '⏳ Running…' : '🏭 Run Factory'}</button>
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
                <span style={{ fontFamily: 'var(--fm)', fontSize: 10, color: 'var(--muted)' }}>Quick:</span>
                {['AI tools for students', 'dark history facts', 'psychology facts', 'stoicism explained', 'personal finance basics', 'weird science facts'].map(t => (
                    <button key={t} className="chip" onClick={() => { setTopic(t); setTimeout(run, 50) }}>{t}</button>
                ))}
            </div>

            {!data && !busy && (
                <div className="empty"><div className="ei">🏭</div><h3>Factory Ready</h3>
                    <p>Enter a topic or click a quick topic above to generate ideas, titles, thumbnails, and a full script.</p></div>
            )}

            {validation && (
                <div style={{ marginBottom: 16 }}>
                    <div className="slbl">Topic Validation</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 10 }}>
                        {[
                            { ico: '🎯', lbl: 'Opportunity', val: (validation.nd?.opp || 5).toFixed(1), sub: '/10 score', color: scoreInfo(validation.nd?.opp || 5).color },
                            { ico: '📈', lbl: 'Competition', val: compLevel(validation.nd?.sat || 20).label, sub: (validation.nd?.sat || '~20') + ' videos/30d', color: 'var(--text)' },
                            { ico: '⚡', lbl: 'View Velocity', val: fmt(validation.nd?.avgVel || 50), sub: 'views/hour avg', color: 'var(--accent)' },
                            { ico: '💡', lbl: 'Viral Gap', val: (validation.nd?.vg || 4).toFixed(1), sub: '/10 demand gap', color: 'var(--green)' },
                        ].map(s => (
                            <div key={s.lbl} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--rl)', padding: 14, textAlign: 'center' }}>
                                <div style={{ fontSize: 22, marginBottom: 5 }}>{s.ico}</div>
                                <div style={{ fontFamily: 'var(--fm)', fontSize: 9, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--muted)', marginBottom: 4 }}>{s.lbl}</div>
                                <div style={{ fontFamily: 'var(--fm)', fontSize: 19, fontWeight: 700, color: s.color }}>{s.val}</div>
                                <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>{s.sub}</div>
                            </div>
                        ))}
                    </div>
                    {validation.nd && (
                        <div style={{ padding: '10px 14px', borderRadius: 'var(--r)', fontSize: 12.5, fontFamily: 'var(--fm)', background: validation.nd.opp >= 5 ? 'rgba(0,230,118,.06)' : 'rgba(255,68,68,.06)', border: `1px solid ${validation.nd.opp >= 5 ? 'rgba(0,230,118,.2)' : 'rgba(255,68,68,.2)'}` }}>
                            {validation.nd.opp >= 5 ? <><strong style={{ color: 'var(--green)' }}>✅ PRODUCTION CANDIDATE</strong> — Opportunity {validation.nd.opp.toFixed(1)}/10. This topic has been validated.</> : <><strong style={{ color: 'var(--red)' }}>⚠️ PROCEED WITH CAUTION</strong> — Consider a more specific sub-niche angle.</>}
                        </div>
                    )}
                </div>
            )}

            {data && (
                <>
                    <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--border)', marginBottom: 16 }}>
                        {['ideas', 'titles', 'thumbs', 'script'].map(t => (
                            <button key={t} onClick={() => setTab(t)}
                                style={{ background: 'none', border: 'none', borderBottom: `2px solid ${tab === t ? 'var(--orange)' : 'transparent'}`, padding: '9px 16px', fontFamily: 'var(--fd)', fontWeight: 700, fontSize: 12.5, color: tab === t ? 'var(--orange)' : 'var(--muted)', cursor: 'pointer', transition: 'all .2s', textTransform: 'capitalize' }}>
                                {t === 'ideas' ? '💡 Video Ideas' : t === 'titles' ? '✏️ Titles' : t === 'thumbs' ? '🖼️ Thumbnails' : '📝 Script'}
                            </button>
                        ))}
                    </div>

                    {/* Ideas */}
                    {tab === 'ideas' && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(265px,1fr))', gap: 10 }}>
                            {data.ideas.map((idea, i) => {
                                const clr = TYPE_COLORS[idea.type] || 'var(--accent)'
                                const isSel = selectedIdea?.title === idea.title
                                return (
                                    <div key={i} onClick={() => setSelectedIdea(idea)}
                                        style={{ background: 'var(--surface)', border: `1px solid ${isSel ? 'var(--orange)' : 'var(--border)'}`, borderRadius: 'var(--rl)', padding: 15, cursor: 'pointer', transition: 'all .2s', position: 'relative', background: isSel ? 'rgba(255,159,67,.04)' : 'var(--surface)' }}
                                        onMouseEnter={e => { if (!isSel) e.currentTarget.style.borderColor = 'var(--orange)' }}
                                        onMouseLeave={e => { if (!isSel) e.currentTarget.style.borderColor = 'var(--border)' }}>
                                        {isSel && <div style={{ position: 'absolute', top: 11, right: 11, fontSize: 14 }}>✅</div>}
                                        <div style={{ fontFamily: 'var(--fm)', fontSize: 9, color: 'var(--dim)', marginBottom: 5 }}>IDEA {String(i + 1).padStart(2, '0')} · <span style={{ color: clr }}>{idea.type}</span></div>
                                        <div style={{ fontWeight: 600, fontSize: 13, lineHeight: 1.45, marginBottom: 9 }}>{idea.title}</div>
                                        <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 8, lineHeight: 1.4 }}>{idea.angle}</div>
                                        <div style={{ fontSize: 10.5, color: '#7aadc8', fontStyle: 'italic', marginBottom: 8 }}>"{idea.hook}"</div>
                                        <div style={{ display: 'flex', gap: 5 }}>
                                            <span style={{ fontFamily: 'var(--fm)', fontSize: 9, background: 'var(--elevated)', border: `1px solid ${clr}`, borderRadius: 4, padding: '2px 7px', color: clr }}>{idea.type}</span>
                                            <span style={{ fontFamily: 'var(--fm)', fontSize: 9, background: 'var(--elevated)', border: '1px solid var(--border)', borderRadius: 4, padding: '2px 7px', color: 'var(--muted)' }}>Viral: {idea.viralScore}/10</span>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}

                    {/* Titles */}
                    {tab === 'titles' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            <div style={{ fontSize: 12.5, color: '#7aadc8', marginBottom: 6 }}>Click a title to select it. Sorted by predicted CTR.</div>
                            {[...data.titles].sort((a, b) => (b.ctr || 0) - (a.ctr || 0)).map((t, i) => {
                                const score = t.ctr || 70
                                const clr = score >= 80 ? 'var(--green)' : score >= 65 ? 'var(--accent)' : score >= 50 ? 'var(--yellow)' : 'var(--muted)'
                                const isSel = selectedTitle === t.t
                                return (
                                    <div key={i} onClick={() => setSelectedTitle(t.t)}
                                        style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', background: isSel ? 'rgba(255,159,67,.05)' : 'var(--elevated)', borderRadius: 'var(--r)', cursor: 'pointer', transition: 'all .15s', border: `1px solid ${isSel ? 'var(--orange)' : 'transparent'}` }}
                                        onMouseEnter={e => { if (!isSel) e.currentTarget.style.borderColor = 'var(--accent)' }}
                                        onMouseLeave={e => { if (!isSel) e.currentTarget.style.borderColor = 'transparent' }}>
                                        <div style={{ flex: 1, fontSize: 13, fontWeight: 500, lineHeight: 1.4 }}>{t.t}</div>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3, flexShrink: 0 }}>
                                            <div style={{ fontFamily: 'var(--fm)', fontSize: 12, fontWeight: 700, color: clr }}>{score}%</div>
                                            <div style={{ fontFamily: 'var(--fm)', fontSize: 9, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: .5 }}>{t.type}</div>
                                        </div>
                                        <div style={{ width: 60, height: 4, background: 'var(--border)', borderRadius: 2, overflow: 'hidden', marginLeft: 10, flexShrink: 0 }}>
                                            <div style={{ height: '100%', width: `${score}%`, background: clr, borderRadius: 2 }} />
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}

                    {/* Thumbnails */}
                    {tab === 'thumbs' && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 12 }}>
                            {data.thumbs.map((t, i) => (
                                <div key={i} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--rl)', overflow: 'hidden', cursor: 'pointer', transition: 'all .2s' }}
                                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--orange)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = '' }}>
                                    <div style={{ height: 120, background: t.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', fontSize: 40 }}>
                                        {t.emoji}
                                        <div style={{ position: 'absolute', bottom: 6, left: 6, right: 6, background: 'rgba(0,0,0,.75)', borderRadius: 4, padding: '4px 8px', fontFamily: 'var(--fd)', fontWeight: 700, fontSize: 11.5, textAlign: 'center', letterSpacing: .5 }}>{t.textOverlay}</div>
                                    </div>
                                    <div style={{ padding: 13 }}>
                                        <div style={{ fontFamily: 'var(--fd)', fontWeight: 700, fontSize: 12.5, marginBottom: 6 }}>Concept {i + 1} — <span style={{ color: 'var(--orange)' }}>{t.style}</span></div>
                                        <div style={{ fontSize: 12, color: '#7aadc8', lineHeight: 1.55, marginBottom: 6 }}>{t.concept}</div>
                                        <div style={{ fontSize: 11, color: 'var(--muted)' }}><strong>Layout:</strong> {t.layout}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Script */}
                    {tab === 'script' && (
                        <div>
                            <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
                                <button className="btn s" style={{ fontSize: 11, padding: '6px 12px' }}
                                    onClick={() => {
                                        const s = data.script
                                        const text = [`HOOK:\n${s.hook}`, `INTRO:\n${s.intro}`, ...(s.sections || []).map((sec, i) => `POINT ${i + 1}${sec.title ? ' — ' + sec.title : ''}:\n${sec.content}`), `EXAMPLES:\n${s.examples}`, `CONCLUSION:\n${s.conclusion}`, `CTA:\n${s.cta}`].join('\n\n')
                                        navigator.clipboard.writeText(text).then(() => toast('Script copied', 'ok')).catch(() => toast('Copy not available', 'w'))
                                    }}>📋 Copy Script</button>
                                {data.script.totalDuration && <div style={{ marginLeft: 'auto', fontFamily: 'var(--fm)', fontSize: 11, color: 'var(--muted)', alignSelf: 'center' }}>⏱ {data.script.totalDuration}</div>}
                            </div>
                            <div style={{ background: 'var(--elevated)', borderRadius: 'var(--rl)', padding: 20, maxHeight: 600, overflowY: 'auto' }}>
                                {[['🎣 HOOK (0–10 seconds)', data.script.hook], ['📌 INTRODUCTION', data.script.intro], ...(data.script.sections || []).map((s, i) => [`📍 POINT ${i + 1}${s.title ? ' — ' + s.title : ''}${s.duration ? ' (' + s.duration + ')' : ''}`, s.content]), ['💡 EXAMPLES', data.script.examples], ['🏁 CONCLUSION', data.script.conclusion], ['📣 CALL TO ACTION', data.script.cta]].filter(([, c]) => c).map(([label, content]) => (
                                    <div key={label} style={{ marginBottom: 18, paddingBottom: 18, borderBottom: '1px solid var(--border)' }}>
                                        <div style={{ fontFamily: 'var(--fm)', fontSize: 9, textTransform: 'uppercase', letterSpacing: 2, color: 'var(--orange)', marginBottom: 8, fontWeight: 700 }}>{label}</div>
                                        <div style={{ fontSize: 13, lineHeight: 1.75, color: 'var(--text)', whiteSpace: 'pre-wrap' }}>{content}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Add to queue */}
                    <div style={{ marginTop: 16, background: 'rgba(255,159,67,.06)', border: '1px solid rgba(255,159,67,.2)', borderRadius: 'var(--rl)', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontFamily: 'var(--fd)', fontWeight: 700, fontSize: 14, marginBottom: 3 }}>Ready to Produce?</div>
                            <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                                {selectedIdea || selectedTitle ? `"${(selectedTitle || selectedIdea?.title || '').slice(0, 50)}…"` : 'Select an idea and title above'}
                            </div>
                        </div>
                        <button className="btn fac" onClick={() => {
                            const title = selectedTitle || selectedIdea?.title || data.titles[0]?.t || topic
                            addToQueue({ title, topic })
                            toast('Added to Production Queue', 'ok')
                            navigate('/queue')
                        }}>📋 Add to Production Queue</button>
                    </div>
                </>
            )}
        </div>
    )
}