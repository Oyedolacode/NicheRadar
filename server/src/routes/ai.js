/**
 * server/src/routes/ai.js
 * ─────────────────────────────────────────
 * POST /api/ai
 *
 * Receives { prompt, maxTokens } from the client.
 * Forwards to Anthropic. Returns { text }.
 *
 * The API key never leaves this server.
 * CORS is handled at the Express level.
 */

import { Router }    from 'express'
import Anthropic     from '@anthropic-ai/sdk'
import rateLimit     from 'express-rate-limit'

const router = Router()
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const MODEL  = 'claude-3-5-sonnet-20240620'

// ── Rate limit: 30 AI calls / minute / IP ─
const limiter = rateLimit({
  windowMs: 60_000,
  max: 30,
  message: { error: 'Too many AI requests — slow down' },
})

router.post('/', limiter, async (req, res, next) => {
  try {
    const { prompt, maxTokens = 1200 } = req.body

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'prompt is required' })
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(500).json({ error: 'AI key not configured on server' })
    }

    const message = await client.messages.create({
      model:      MODEL,
      max_tokens:  maxTokens,
      messages:   [{ role: 'user', content: prompt }],
    })

    const text = message.content?.[0]?.text || ''
    res.json({ text })

  } catch (err) {
    next(err)
  }
})

export default router
