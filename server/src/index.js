/**
 * server/src/index.js
 * ─────────────────────────────────────────
 * Thin Express server. Three jobs:
 *  1. Proxy Anthropic API (solves CORS + hides key)
 *  2. Proxy YouTube API  (solves CORS + hides key)
 *  3. Persist bookmarks / queue to disk
 */

import 'dotenv/config'
import express   from 'express'
import cors      from 'cors'
import aiRoute   from './routes/ai.js'
import ytRoute   from './routes/youtube.js'
import dataRoute from './routes/data.js'
import { errorHandler } from './middleware/errorHandler.js'

const app     = express()
const PORT    = process.env.PORT || 3001
const IS_PROD = process.env.NODE_ENV === 'production'

// ── CORS ──────────────────────────────────
// Dev:  allow localhost Vite ports
// Prod: read ALLOWED_ORIGINS from Railway env var
//       e.g. https://niche-radar.vercel.app
const getAllowedOrigins = () => {
  if (!IS_PROD) return ['http://localhost:5173', 'http://localhost:4173']
  return (process.env.ALLOWED_ORIGINS || '')
    .split(',').map(o => o.trim()).filter(Boolean)
}

app.use(express.json())
app.use(cors({
  origin: (origin, cb) => {
    const allowed = getAllowedOrigins()
    
    // 1. Allow if in the ALLOWED_ORIGINS list (from environment variable)
    if (!origin || allowed.includes(origin)) return cb(null, true)
    
    // 2. Explicitly allow your current Vercel frontend URL
    if (origin === 'https://niche-radar-xd5x.vercel.app') {
      return cb(null, true)
    }
    
    // 3. Fallback: Allow any other niche-radar subdomains on Vercel
    if (origin.startsWith('https://niche-radar') && origin.endsWith('.vercel.app')) {
      return cb(null, true)
    }

    cb(new Error(`CORS blocked: ${origin}`))
  },
  methods: ['GET', 'POST', 'DELETE'],
  credentials: true,
}))

// ── Routes ────────────────────────────────
app.use('/api/ai',      aiRoute)
app.use('/api/youtube', ytRoute)
app.use('/api/data',    dataRoute)

// ── Health check ──────────────────────────
app.get('/health', (_, res) => res.json({
  status: 'ok',
  env: IS_PROD ? 'production' : 'development',
  anthropic: !!process.env.ANTHROPIC_API_KEY,
  youtube:   !!process.env.YT_API_KEY,
  ts: Date.now(),
}))

// ── Error handler (must be last) ──────────
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`\n🚀 NicheRadar server  →  http://localhost:${PORT}`)
  console.log(`   Mode:          ${IS_PROD ? 'production' : 'development'}`)
  console.log(`   Anthropic key: ${process.env.ANTHROPIC_API_KEY ? '✅ set' : '❌ missing'}`)
  console.log(`   YouTube key:   ${process.env.YT_API_KEY        ? '✅ set' : '❌ missing'}`)
  console.log(`   Allowed CORS:  ${getAllowedOrigins().join(', ') || '(none — set ALLOWED_ORIGINS)'}\n`)
})
