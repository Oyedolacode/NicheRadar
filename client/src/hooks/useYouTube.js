/**
 * hooks/useYouTube.js
 * ─────────────────────────────────────────
 * All YouTube Data API v3 calls go through
 * this hook. In dev, hits /api/youtube proxy
 * (Express). In prod, same URL — no CORS ever.
 *
 * The hook returns:
 *   { search, vidStats, chanStats, fetchAndEnrich }
 */

import { useCallback } from 'react'
import { useAppStore }  from '../store/useAppStore'
import { useCache }     from './useCache'
import {
  velocity, engRate, creatorSuccess, chanPower,
  trendScore, oppScore, viralGap
} from '../lib/formulas'

const API_BASE = import.meta.env.VITE_API_BASE || ''
if (import.meta.env.PROD && !API_BASE) {
  console.warn('VITE_API_BASE is not set in production. API calls may fail with 404 if not proxied.')
}

export function useYouTube() {
  const { addQuota, setApiError } = useAppStore()
  const { cGet, cSet } = useCache()

  // ── Low-level fetch ───────────────────────
  const ytGet = useCallback(async (endpoint, params, cacheKey) => {
    // If clearly offline, use cache immediately
    if (!navigator.onLine && cacheKey) {
      const hit = cGet(cacheKey)
      if (hit) {
        useAppStore.getState().setApiError('Offline: using cached data')
        return hit
      }
    }

    const qs = new URLSearchParams(params).toString()
    const url = `${API_BASE}/api/youtube/${endpoint}?${qs}`

    try {
      const res = await fetch(url)
      
      // 1. Check if the response is actually OK (2xx)
      if (!res.ok) {
        let errMsg = `API Error: ${res.status} ${res.statusText}`
        try {
          const errData = await res.json()
          if (errData.error) errMsg = errData.error
        } catch (e) {
          // If NOT JSON, it's likely an HTML 404/500 page
          if (res.status === 404) errMsg = "API Endpoint not found (404). Check VITE_API_BASE."
        }
        throw new Error(errMsg)
      }

      // 2. Check Content-Type to avoid "Unexpected token T" errors
      const contentType = res.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('API returned non-JSON response. Check your backend URL/proxy.')
      }

      const data = await res.json()
      if (data.error) throw new Error(data.error.message)
      
      const isCacheHit = res.headers.get('X-Cache') === 'HIT'
      if (!isCacheHit) {
        const units = endpoint === 'search' ? 100 : 1
        addQuota(units)
      }

      if (cacheKey) cSet(cacheKey, data)
      return data
    } catch (err) {
      // If network fails, try cache as a final fallback
      if (cacheKey) {
        const hit = cGet(cacheKey)
        if (hit) {
          useAppStore.getState().setApiError('Network error: using cached data')
          return hit
        }
      }
      throw err
    }
  }, [addQuota, cGet, cSet])

  // ── search ────────────────────────────────
  const search = useCallback(async (query, maxResults = 40) => {
    const after = new Date(Date.now() - 30 * 86_400_000).toISOString()
    return ytGet('search', {
      part: 'snippet',
      q: query,
      type: 'video',
      order: 'relevance',
      publishedAfter: after,
      maxResults,
      regionCode: 'US',
    }, `search_${query}_${maxResults}`)
  }, [ytGet])

  // ── video stats ───────────────────────────
  const vidStats = useCallback(async (ids) => {
    if (!ids.length) return { items: [] }
    return ytGet('videos', {
      part: 'statistics,snippet',
      id: ids.join(','),
    }, `vs_${ids.slice(0, 4).join('_')}`)
  }, [ytGet])

  // ── channel stats ─────────────────────────
  const chanStats = useCallback(async (ids) => {
    const unique = [...new Set(ids)].slice(0, 50)
    if (!unique.length) return { items: [] }
    return ytGet('channels', {
      part: 'statistics',
      id: unique.join(','),
    }, `cs_${unique.slice(0, 3).join('_')}`)
  }, [ytGet])

  // ── fetch + enrich (main pipeline) ────────
  // Returns the full enriched niche data object
  const fetchAndEnrich = useCallback(async (keyword) => {
    const searchData = await search(keyword, 40)
    const items = searchData.items || []

    if (!items.length) {
      return { kw: keyword, enriched: [], sat: 0, trend: 0, avgVel: 0, avgEng: 0, avgCs: 0, opp: 0, vg: 0 }
    }

    const videoIds  = items.map(i => i.id?.videoId).filter(Boolean)
    const channelIds = items.map(i => i.snippet?.channelId).filter(Boolean)

    const [vData, cData] = await Promise.all([
      vidStats(videoIds),
      chanStats(channelIds),
    ])

    const chanMap = {}
    ;(cData.items || []).forEach(c => {
      chanMap[c.id] = +c.statistics?.subscriberCount || 0
    })

    const enriched = (vData.items || []).map(v => {
      const views    = +v.statistics?.viewCount    || 0
      const likes    = +v.statistics?.likeCount    || 0
      const comments = +v.statistics?.commentCount || 0
      const subs     = chanMap[v.snippet?.channelId] || 0
      const pub      = v.snippet?.publishedAt

      const vel = velocity(views, pub)
      const eng = engRate(likes, comments, views)

      return {
        id:    v.id,
        title: v.snippet?.title,
        chan:  v.snippet?.channelTitle,
        chanId: v.snippet?.channelId,
        thumb: v.snippet?.thumbnails?.medium?.url,
        pub,
        views, likes, comments, subs,
        vel, eng,
        cs: creatorSuccess(views, subs),
        cp: chanPower(subs, views),
        url: `https://youtube.com/watch?v=${v.id}`,
      }
    }).filter(v => v.views > 0)

    const sat   = enriched.length
    const trend = trendScore(enriched.map(v => ({ vel: v.vel, pub: v.pub })))
    const avgVel = enriched.reduce((a, b) => a + b.vel, 0) / Math.max(enriched.length, 1)
    const avgEng = enriched.reduce((a, b) => a + b.eng, 0) / Math.max(enriched.length, 1)
    const avgCs  = enriched.reduce((a, b) => a + b.cs,  0) / Math.max(enriched.length, 1)
    const opp   = oppScore(avgVel, avgEng, trend, sat)
    const vg    = viralGap(avgVel, trend, sat)

    enriched.sort((a, b) => b.vel - a.vel)

    return { kw: keyword, enriched, sat, trend, avgVel, avgEng, avgCs, opp, vg }
  }, [search, vidStats, chanStats])

  // ── channel analysis (Winning Channel Finder helper) ──
  const getChannelAnalysis = useCallback(async (chanId) => {
    // 1. Get channel metadata
    const cData = await ytGet('channels', {
      part: 'snippet,statistics',
      id: chanId
    }, `chan_meta_${chanId}`)

    if (!cData.items?.[0]) throw new Error('Channel not found')
    const channel = cData.items[0]
    const subs = +channel.statistics?.subscriberCount || 0
    const created = channel.snippet?.publishedAt
    const ageDays = Math.floor((Date.now() - new Date(created).getTime()) / 86_400_000)

    // 2. Get last 20 videos
    const searchData = await ytGet('search', {
      part: 'snippet',
      channelId: chanId,
      order: 'date',
      type: 'video',
      maxResults: 20
    }, `chan_videos_search_${chanId}`)

    const videoIds = (searchData.items || []).map(i => i.id?.videoId).filter(Boolean)
    if (!videoIds.length) return { channel, subs, ageDays, avgViews: 0, consistency: 0, ratio: 0, videos: [] }

    const vData = await vidStats(videoIds)
    const videos = (vData.items || []).map(v => ({
      id: v.id,
      title: v.snippet?.title,
      views: +v.statistics?.viewCount || 0,
      pub: v.snippet?.publishedAt,
      vel: velocity(+v.statistics?.viewCount || 0, v.snippet?.publishedAt)
    }))

    const avgViews = videos.reduce((sum, v) => sum + v.views, 0) / videos.length
    const viralCount = videos.filter(v => v.views > 500000).length
    const consistency = viralCount / videos.length
    const ratio = subs > 0 ? avgViews / subs : 0

    return {
      channel,
      subs,
      ageDays,
      avgViews,
      consistency,
      ratio,
      videos
    }
  }, [ytGet, vidStats])

  // ── channel blueprint (Clone Factory helper) ──
  const getChannelBlueprint = useCallback(async (chanId) => {
    // 1. Get channel meta + 30 videos
    const searchData = await ytGet('search', {
      part: 'snippet',
      channelId: chanId,
      order: 'date',
      type: 'video',
      maxResults: 30
    }, `chan_blueprint_search_${chanId}`)

    const items = searchData.items || []
    if (!items.length) throw new Error('No videos found for blueprint')

    const titles = items.map(i => i.snippet?.title)
    const dates = items.map(i => new Date(i.snippet?.publishedAt).getTime())
    
    // 2. Extract Topics (Keyword counts)
    const stopWords = new Set(['the', 'and', 'how', 'you', 'with', 'for', 'this', 'that', 'your', 'from', 'what'])
    const words = titles.join(' ').toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/)
    const counts = {}
    words.forEach(w => {
      if (w.length > 2 && !stopWords.has(w)) counts[w] = (counts[w] || 0) + 1
    })
    const topTopics = Object.entries(counts).sort((a,b) => b[1] - a[1]).slice(0, 5).map(e => e[0])

    // 3. Extract Formats & Hooks
    const hooks = []
    let listCount = 0, howToCount = 0, storyCount = 0
    titles.forEach(t => {
      const low = t.toLowerCase()
      if (/^\d+/.test(low)) listCount++
      if (low.startsWith('how to')) howToCount++
      if (low.includes('the story of') || low.includes('how i') || low.includes('why i')) storyCount++
      
      const first3 = t.split(' ').slice(0, 3).join(' ')
      if (first3) hooks.push(first3)
    })

    const topHooks = [...new Set(hooks)].slice(0, 5)
    const primaryFormat = listCount > 5 ? 'Listicles' : howToCount > 5 ? 'Educational' : storyCount > 3 ? 'Storytelling' : 'Explainer'

    // 4. Frequency (avg per week)
    const spanDays = (dates[0] - dates[dates.length-1]) / 86400000
    const freq = ((items.length / Math.max(spanDays, 1)) * 7).toFixed(1)

    // 5. Clone Strategy Generation (AI-lite)
    const mainTopic = topTopics[0] || 'Topic'
    const suggestions = [
      { type: 'Audience Split', idea: `${mainTopic} for entrepreneurs`, desc: `Shift the focus from students to professionals.` },
      { type: 'Topic Expansion', idea: `Automation systems for ${mainTopic}`, desc: `Focus on the 'how-it-works' rather than just the tools.` },
      { type: 'Format Variation', idea: `The $10k ${mainTopic} Case Study`, desc: `Transform a listicle into a results-driven story.` },
      { type: 'Platform Style', idea: `5 ${mainTopic} hacks in 60s`, desc: `Fast-paced vertical shorts targeting Gen Z.` }
    ]

    return {
      topics: topTopics,
      hooks: topHooks,
      format: primaryFormat,
      frequency: freq,
      suggestions
    }
  }, [ytGet])

  return { search, vidStats, chanStats, fetchAndEnrich, getChannelAnalysis, getChannelBlueprint }
}
