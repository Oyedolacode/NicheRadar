/**
 * store/useAppStore.js
 * ─────────────────────────────────────────
 * Global UI state: navigation, quota tracker,
 * toast notifications, API status.
 *
 * Replaces all the scattered global vars in
 * the v5 monolith (quotaUsed, statTxt, etc.)
 */

import { create } from 'zustand'

export const useAppStore = create((set, get) => ({
  // ── Navigation ─────────────────────────
  currentPage: 'explorer',
  setPage: (page) => set({ currentPage: page }),

  // ── API Quota ──────────────────────────
  quotaUsed: 0,
  quotaLimit: 10_000,
  addQuota: (units) => set(s => ({ quotaUsed: s.quotaUsed + units })),
  quotaPct: () => {
    const s = get()
    return Math.min(100, (s.quotaUsed / s.quotaLimit) * 100)
  },

  // ── API Status ─────────────────────────
  apiStatus: 'ready', // 'ready' | 'loading' | 'quota_exceeded' | 'error'
  setApiStatus: (status) => set({ apiStatus: status }),
  setApiError: (msg = '') => {
    const isQuota = msg.toLowerCase().includes('quota') || msg.toLowerCase().includes('403')
    set({ apiStatus: isQuota ? 'quota_exceeded' : 'error' })
    if (msg) get().toast(msg, 'e')
  },

  // ── Toast Notifications ────────────────
  toasts: [],
  toast: (message, type = 'info') => {
    const id = Date.now()
    set(s => ({ toasts: [...s.toasts, { id, message, type }] }))
    setTimeout(() => {
      set(s => ({ toasts: s.toasts.filter(t => t.id !== id) }))
    }, 3500)
  },
  dismissToast: (id) =>
    set(s => ({ toasts: s.toasts.filter(t => t.id !== id) })),

  // ── Progress Bar ───────────────────────
  loading: false,
  setLoading: (loading) => set({ loading }),

  // ── Last Explorer Result (cross-page) ──
  // Other pages (Factory, Simulator) read from this
  lastExplorerResult: null,
  setLastExplorerResult: (result) => set({ lastExplorerResult: result }),

  // ── Cache Utilities ────────────────────
  cacheCount: 0,
  setCacheCount: (n) => set({ cacheCount: n }),
  clearCache: () => {
    try {
      const keys = Object.keys(localStorage).filter(k => k.startsWith('nr6_'))
      keys.forEach(k => localStorage.removeItem(k))
      set({ cacheCount: 0, quotaUsed: 0 }) // Reset quota too if clearing cache
      get().toast(`Cleared ${keys.length} items`, 'ok')
    } catch (e) {
      console.error('Cache clear failed', e)
    }
  },
}))
