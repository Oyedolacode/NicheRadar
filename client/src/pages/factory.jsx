import React, { useState } from 'react'
import { fetchAndEnrich, fmt, scoreInfo, compLevel } from '../lib/ytUtils'
import { generateIdeas, generateTitles, generateThumbs, generateScript } from '../lib/factoryUtils'

const TYPE_COLORS = { List: 'var(--accent)', HowTo: 'var(--green)', Curiosity: 'var(--purple)', Story: 'var(--yellow)', Facts: 'var(--hot)', Comparison: 'var(--blue)', Documentary: 'var(--orange)', Shorts: 'var(--muted)', Secrets: 'var(--hot)', Tutorial: 'var(--green)', Mistakes: 'var(--red)', Controversy: 'var(--hot)', Explainer: 'var(--blue)', Warning: 'var(--red)', Action: 'var(--accent)' };

export default function Factory() {
  const [topic, setTopic] = useState('')
  const [length, setLength] = useState('medium')
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(0)
  const [facData, setFacData] = useState(null)
  const [activeTab, setActiveTab] = useState('ideas')

  const runFactory = async () => {
    if (!topic) return
    setLoading(true)
    setStep(1)
    try {
      // Step 1: Validate
      const nicheData = await fetchAndEnrich(topic)
      setStep(2)
      
      // Step 2: Ideas
      const ideas = generateIdeas(topic, length)
      setStep(3)
      
      // Step 3: Titles
      const titles = generateTitles(topic)
      setStep(4)
      
      // Step 4: Thumbs
      const thumbs = generateThumbs(topic)
      setStep(5)
      
      // Step 5: Script
      const script = generateScript(topic, titles[0].t, length)
      setStep(6)
      
      setFacData({ topic, length, nicheData, ideas, titles, thumbs, script })
      setActiveTab('ideas')
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const addToQueue = () => {
    // Persistent queue logic will be implemented in Queue page, 
    // here we just save to localStorage for now
    const kanban = JSON.parse(localStorage.getItem('nr5_kanban') || '{"ideas":[],"script":[],"recording":[],"editing":[],"scheduled":[]}')
    const title = facData.selectedTitle || facData.titles[0]?.t || facData.topic
    kanban.ideas.push({ id: Date.now(), title, topic: facData.topic, created: new Date().toLocaleDateString() })
    localStorage.setItem('nr5_kanban', JSON.stringify(kanban))
    alert('Added to Production Queue!')
  }

  return (
    <div className="pg on">
      <div className="fac-hero">
        <div className="fac-badge">🏭 CONTENT FACTORY</div>
        <div style={{ fontFamily: 'var(--fd)', fontSize: '20px', fontWeight: 700, marginBottom: '6px' }}>Niche Signal → Publish-Ready Video</div>
        <div style={{ fontSize: '13px', color: '#7aadc8', lineHeight: '1.6', maxWidth: '640px' }}>Enter any topic. The factory validates it with live YouTube data, then generates <strong style={{ color: 'var(--text)' }}>12 video ideas, 10 optimized titles, 4 thumbnail concepts, and a full script</strong> — ready to film.</div>
      </div>

      <div className="fac-flow">
        {['Input', 'Validate', 'Ideas', 'Titles', 'Thumbnail', 'Script', 'Queue'].map((name, i) => (
          <div key={i} className="fac-step">
            <div className={`fac-step-ico ${step > i ? 'done' : step === i ? 'active' : ''}`}>
              {['📥', '✅', '💡', '✏️', '🖼️', '📝', '📋'][i]}
            </div>
            <div className="fac-step-name">{name}</div>
          </div>
        ))}
      </div>

      <div className="sr" style={{ maxWidth: '700px', marginBottom: '6px' }}>
        <input className="inp" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Topic… AI tools, dark history, stoicism" onKeyDown={(e) => e.key === 'Enter' && runFactory()} />
        <select className="inp" value={length} onChange={(e) => setLength(e.target.value)} style={{ maxWidth: '180px' }}>
          <option value="short">Shorts (60s)</option>
          <option value="medium">Medium (8–12 min)</option>
          <option value="long">Long (20–30 min)</option>
        </select>
        <button className="btn fac" onClick={runFactory} disabled={loading}>{loading ? '⏳ Running…' : '🏭 Run Factory'}</button>
      </div>

      {!facData && (
        <div className="empty">
          <div className="ei">🏭</div>
          <h3>Factory Ready</h3>
          <p>Enter a topic to generate ideas, titles, thumbnails, and a full script.</p>
        </div>
      )}

      {facData && (
        <div id="facOutput">
          <div style={{ marginBottom: '16px' }}>
            <div className="slbl">Topic Validation</div>
            <div className="val-grid">
              <div className="val-card"><div className="val-ico">🎯</div><div className="val-lbl">Opportunity</div><div className="val-val" style={{ color: scoreInfo(facData.nicheData.opp).color }}>{facData.nicheData.opp.toFixed(1)}</div><div className="val-sub">/10 score</div></div>
              <div className="val-card"><div className="val-ico">📈</div><div className="val-lbl">Competition</div><div className="val-val"><span className={`pill ${compLevel(facData.nicheData.sat).cls}`}>{compLevel(facData.nicheData.sat).label}</span></div><div className="val-sub">{facData.nicheData.sat} videos/30d</div></div>
              <div className="val-card"><div className="val-ico">⚡</div><div className="val-lbl">View Velocity</div><div className="val-val ca">{fmt(facData.nicheData.avgVel)}</div><div className="val-sub">views/hour avg</div></div>
              <div className="val-card"><div className="val-ico">💡</div><div className="val-lbl">Viral Gap</div><div className="val-val cg">{facData.nicheData.vg.toFixed(1)}</div><div className="val-sub">/10 demand gap</div></div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 0, marginBottom: '16px', borderBottom: '1px solid var(--border)' }}>
            {['ideas', 'titles', 'thumbs', 'script'].map(tab => (
              <button key={tab} className={`fac-tab ${activeTab === tab ? 'on' : ''}`} onClick={() => setActiveTab(tab)}>
                {tab === 'ideas' && '💡 Video Ideas'}
                {tab === 'titles' && '✏️ Titles'}
                {tab === 'thumbs' && '🖼️ Thumbnails'}
                {tab === 'script' && '📝 Script'}
              </button>
            ))}
          </div>

          <div className="fac-tab-pane">
            {activeTab === 'ideas' && (
              <div className="idea-grid">
                {facData.ideas.map((idea, i) => (
                  <div key={i} className="idea-card" onClick={() => { setFacData({ ...facData, selectedIdea: idea }); toast('Idea selected!') }}>
                    {facData.selectedIdea?.title === idea.title && <div className="idea-sel-badge">✅</div>}
                    <div className="idea-num">IDEA {String(i + 1).padStart(2, '0')} · <span style={{ color: TYPE_COLORS[idea.type] }}>{idea.type}</span></div>
                    <div className="idea-title">{idea.title}</div>
                    <div className="idea-tags">
                      <div className="idea-tag" style={{ borderColor: TYPE_COLORS[idea.type], color: TYPE_COLORS[idea.type] }}>{idea.type}</div>
                      <div className="idea-tag">Viral: {idea.viralScore}/10</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'titles' && (
              <div>
                {facData.titles.map((t, i) => (
                  <div key={i} className={`title-opt-row ${facData.selectedTitle === t.t ? 'selected' : ''}`} onClick={() => setFacData({ ...facData, selectedTitle: t.t })}>
                    <div className="tor-title">{t.t}</div>
                    <div className="tor-meta">
                      <div className="tor-ctr" style={{ color: t.ctr >= 80 ? 'var(--green)' : 'var(--accent)' }}>{t.ctr}%</div>
                      <div className="tor-type">{t.type}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'thumbs' && (
              <div className="thumb-grid">
                {facData.thumbs.map((t, i) => (
                  <div key={i} className="thumb-card">
                    <div className="thumb-preview" style={{ background: t.bg }}>
                      <div style={{ fontSize: '52px' }}>{t.emoji}</div>
                      <div className="thumb-overlay">{t.textOverlay}</div>
                    </div>
                    <div className="thumb-body">
                      <div style={{ fontFamily: 'var(--fd)', fontWeight: 700, fontSize: '12.5px', marginBottom: '6px' }}>Concept {i + 1} — <span style={{ color: 'var(--orange)' }}>{t.style}</span></div>
                      <div className="thumb-concept">{t.concept}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'script' && (
              <div style={{ background: 'var(--elevated)', borderRadius: 'var(--rl)', padding: '20px' }}>
                <div className="script-section"><div className="script-section-label">🎣 HOOK</div><div className="script-section-content">{facData.script.hook}</div></div>
                <div className="script-section"><div className="script-section-label">📌 INTRO</div><div className="script-section-content">{facData.script.intro}</div></div>
                {facData.script.sections.map((s, i) => (
                  <div key={i} className="script-section"><div className="script-section-label">📍 {s.title} ({s.duration})</div><div className="script-section-content">{s.content}</div></div>
                ))}
                <div className="script-section"><div className="script-section-label">🏁 CONCLUSION</div><div className="script-section-content">{facData.script.conclusion}</div></div>
                <button className="btn fac" style={{ marginTop: '20px' }} onClick={addToQueue}>📋 Add to Production Queue</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function toast(msg) { alert(msg) } // Temporary toast
