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

    const message = await client.messages.create({
      model:      'claude-sonnet-4-20250514',
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
