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
      const data = await res.json()

      if (data.error) throw new Error(data.error.message)

      const units = endpoint === 'search' ? 100 : 1
      addQuota(units)

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

  return { search, vidStats, chanStats, fetchAndEnrich }
}
