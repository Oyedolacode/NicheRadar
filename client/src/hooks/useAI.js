/**
 * hooks/useAI.js
 * ─────────────────────────────────────────
 * All AI calls go through the Express proxy
 * at POST /api/ai — the API key never touches
 * the browser. CORS issue permanently solved.
 *
 * Usage:
 *   const { generate, generateJSON } = useAI()
 *   const ideas = await generateJSON(prompt, schema)
 */

import { useCallback } from 'react'

const API_BASE = import.meta.env.VITE_API_BASE || ''

export function useAI() {
  // ── Raw text generation ───────────────────
  const generate = useCallback(async (prompt, maxTokens = 1200) => {
    if (!navigator.onLine) {
      throw new Error('Offline: Cannot reach AI server')
    }

    try {
      const res = await fetch(`${API_BASE}/api/ai`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, maxTokens }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || `AI request failed: ${res.status}`)
      }

      const data = await res.json()
      return data.text || ''
    } catch (err) {
      throw err
    }
  }, [])

  // ── JSON generation with fallback ─────────
  // Returns parsed object or calls fallbackFn()
  const generateJSON = useCallback(async (prompt, fallbackFn, maxTokens = 1200) => {
    try {
      const text = await generate(prompt, maxTokens)
      const cleaned = text.replace(/```json|```/g, '').trim()
      return JSON.parse(cleaned)
    } catch (err) {
      console.warn('[useAI] JSON parse failed, using fallback:', err.message)
      return typeof fallbackFn === 'function' ? fallbackFn() : null
    }
  }, [generate])

  return { generate, generateJSON }
}
