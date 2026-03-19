import React, { useState } from 'react'
import { useBookmarkStore } from '../store/useBookmarkStore'
import { useNavigate } from 'react-router-dom'
import { scoreInfo } from '../lib/formulas'

const TABS = ['niches', 'ideas', 'videos', 'competitors']

export default function Bookmarks() {
    const { niches, ideas, videos, competitors, removeNiche, removeIdea, removeVideo, removeCompetitor, clearAll, totalCount } = useBookmarkStore()
    const [tab, setTab] = useState('niches')
    const navigate = useNavigate()
    const total = totalCount()

    const TAB_DATA = { niches, ideas, videos, competitors }
    const REMOVE = { niches: removeNiche, ideas: removeIdea, videos: removeVideo, competitors: removeCompetitor }

    return (
        <div style={{ padding: 22 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, flexWrap: 'wrap', gap: 10 }}>
                <div>
                    <p style={{ fontSize: 12.5, color: '#7aadc8', lineHeight: 1.6 }}>
                        Your saved niches, ideas, videos, and competitors. <strong style={{ color: 'var(--text)' }}>{total} saved</strong>
                    </p>
                </div>
                {total > 0 && (
                    <button className="btn s" style={{ fontSize: '10.5px' }}
                        onClick={() => { if (window.confirm('Clear all bookmarks?')) clearAll() }}>🗑 Clear All</button>
                )}
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--border)', marginBottom: 18 }}>
                {TABS.map(t => (
                    <button key={t} onClick={() => setTab(t)}
                        style={{
                            background: 'none', border: 'none', borderBottom: `2px solid ${tab === t ? 'var(--accent)' : 'transparent'}`,
                            padding: '9px 16px', fontFamily: 'var(--fd)', fontWeight: 700, fontSize: 12.5,
                            color: tab === t ? 'var(--accent)' : 'var(--muted)', cursor: 'pointer', transition: 'all .2s', textTransform: 'capitalize'
                        }}>
                        {t} ({TAB_DATA[t].length})
                    </button>
                ))}
            </div>

            {TAB_DATA[tab].length === 0 ? (
                <div className="empty">
                    <div className="ei">🔖</div>
                    <h3>No {tab} saved yet</h3>
                    <p>Save {tab} from the Explorer, Factory, or Analyzer pages.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {TAB_DATA[tab].map(item => {
                        const si = item.opp ? scoreInfo(item.opp) : null
                        return (
                            <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 15px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--rl)', transition: 'all .2s' }}
                                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 3 }}>{item.kw || item.title || item.channelTitle || '—'}</div>
                                    <div style={{ fontFamily: 'var(--fm)', fontSize: 9.5, color: 'var(--muted)' }}>
                                        Saved {new Date(item.savedAt).toLocaleDateString()}
                                        {si && <span style={{ marginLeft: 8, color: si.color }}>● {si.label}</span>}
                                        {item.opp && <span style={{ marginLeft: 8 }}>Score: {item.opp.toFixed(1)}</span>}
                                    </div>
                                </div>
                                {(tab === 'niches' || tab === 'ideas') && (
                                    <button className="btn s" style={{ fontSize: '10.5px', padding: '5px 10px' }}
                                        onClick={() => navigate('/explorer', { state: { keyword: item.kw || item.title } })}>
                                        🔍 Analyze
                                    </button>
                                )}
                                {tab === 'niches' && (
                                    <button className="btn fac" style={{ fontSize: '10.5px', padding: '5px 10px' }}
                                        onClick={() => navigate('/factory', { state: { topic: item.kw } })}>
                                        🏭 Factory
                                    </button>
                                )}
                                <button onClick={() => REMOVE[tab](item.id)}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: 'var(--muted)', padding: '4px 6px', transition: 'color .15s' }}
                                    onMouseEnter={e => e.currentTarget.style.color = 'var(--red)'}
                                    onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}>
                                    ✕
                                </button>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}