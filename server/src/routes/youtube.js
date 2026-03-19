/**
 * server/src/routes/youtube.js
 * ─────────────────────────────────────────
 * GET /api/youtube/:endpoint
 *
 * Proxies YouTube Data API v3 requests.
 * Keeps the API key server-side.
 * Adds server-side caching (5 min TTL) to
 * reduce quota usage when multiple clients
 * request the same keyword simultaneously.
 */

import { Router } from 'express'
import fetch      from 'node-fetch'

const router   = Router()
const YT_BASE  = 'https://www.googleapis.com/youtube/v3'
const cache    = new Map()  // simple in-memory cache
const CACHE_TTL = 5 * 60 * 1000  // 5 minutes

// Allowed endpoints — never let clients proxy arbitrary Google APIs
const ALLOWED = new Set(['search', 'videos', 'channels'])

router.get('/:endpoint', async (req, res, next) => {
  try {
    const { endpoint } = req.params

    if (!ALLOWED.has(endpoint)) {
      return res.status(400).json({ error: `Endpoint "${endpoint}" not allowed` })
    }

    const params = new URLSearchParams({
      ...req.query,
      key: process.env.YT_API_KEY,
    })

    const cacheKey = `${endpoint}?${params}`
    const cached   = cache.get(cacheKey)

    if (cached && Date.now() - cached.ts < CACHE_TTL) {
      res.set('X-Cache', 'HIT')
      return res.json(cached.data)
    }

    const url  = `${YT_BASE}/${endpoint}?${params}`
    const ytRes = await fetch(url)
    const data  = await ytRes.json()

    if (data.error) {
      return res.status(ytRes.status).json({ error: data.error.message })
    }

    cache.set(cacheKey, { data, ts: Date.now() })
    res.set('X-Cache', 'MISS')
    res.json(data)

  } catch (err) {
    next(err)
  }
})

export default router
