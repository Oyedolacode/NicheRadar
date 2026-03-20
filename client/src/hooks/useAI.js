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

// In production, we default to the Railway backend URL to avoid 404s if proxying is not set up.
const API_BASE = import.meta.env.VITE_API_BASE || 'https://niche-radar-server.up.railway.app'
if (import.meta.env.PROD && !API_BASE) {
  console.warn('[useAI] VITE_API_BASE is not set in production. AI calls may fail with 404.')
}

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
        let errMsg = `AI Error: ${res.status} ${res.statusText}`
        try {
          const errData = await res.json()
          if (errData.error) errMsg = errData.error
        } catch (e) {
          if (res.status === 404) errMsg = "AI Endpoint not found (404). Check VITE_API_BASE."
        }
        throw new Error(errMsg)
      }

      const contentType = res.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('AI returned non-JSON response. Check your backend URL/proxy.')
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
