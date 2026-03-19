/**
 * hooks/useCache.js
 * localStorage cache with 24h TTL
 */
import { useCallback } from 'react'

const TTL = 86_400_000 // 24 hours
const PREFIX = 'nr6_'

export function useCache() {
  const cSet = useCallback((key, value) => {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify({ v: value, t: Date.now() }))
    } catch (e) { }
  }, [])

  const cGet = useCallback((key) => {
    try {
      const raw = localStorage.getItem(PREFIX + key)
      if (!raw) return null
      const parsed = JSON.parse(raw)
      if (Date.now() - parsed.t > TTL) { localStorage.removeItem(PREFIX + key); return null }
      return parsed.v
    } catch (e) { return null }
  }, [])

  const cKeys = useCallback(() => {
    try { return Object.keys(localStorage).filter(k => k.startsWith(PREFIX)) }
    catch (e) { return [] }
  }, [])

  const cClear = useCallback(() => {
    cKeys().forEach(k => localStorage.removeItem(k))
  }, [cKeys])

  const cSize = useCallback(() => {
    let bytes = 0
    cKeys().forEach(k => { try { bytes += (localStorage.getItem(k) || '').length } catch (e) { } })
    return bytes
  }, [cKeys])

  return { cGet, cSet, cKeys, cClear, cSize }
}