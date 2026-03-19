/**
 * store/useBookmarkStore.js
 * ─────────────────────────────────────────
 * Persistent bookmark system — one of the
 * most-requested missing features.
 *
 * Saves: ideas, niches, competitors, videos
 * Persists to localStorage (no server needed)
 */

import { create } from 'zustand'
import { persist  } from 'zustand/middleware'

const STORAGE_KEY = 'nr6_bookmarks'

export const useBookmarkStore = create(
  persist(
    (set, get) => ({
      // ── Saved Ideas ────────────────────
      ideas: [],
      saveIdea: (idea) => set(s => ({
        ideas: [
          { ...idea, savedAt: Date.now(), id: `idea_${Date.now()}` },
          ...s.ideas,
        ]
      })),
      removeIdea: (id) => set(s => ({
        ideas: s.ideas.filter(i => i.id !== id)
      })),
      isIdeaSaved: (title) => get().ideas.some(i => i.title === title),

      // ── Saved Niches ───────────────────
      niches: [],
      saveNiche: (niche) => set(s => ({
        niches: [
          { ...niche, savedAt: Date.now(), id: `niche_${Date.now()}` },
          ...s.niches,
        ]
      })),
      removeNiche: (id) => set(s => ({
        niches: s.niches.filter(n => n.id !== id)
      })),
      isNicheSaved: (kw) => get().niches.some(n => n.kw === kw),

      // ── Saved Videos (from analyzer) ───
      videos: [],
      saveVideo: (video) => set(s => ({
        videos: [
          { ...video, savedAt: Date.now(), id: `vid_${Date.now()}` },
          ...s.videos,
        ]
      })),
      removeVideo: (id) => set(s => ({
        videos: s.videos.filter(v => v.id !== id)
      })),

      // ── Saved Competitors ──────────────
      competitors: [],
      saveCompetitor: (channel) => set(s => ({
        competitors: [
          { ...channel, savedAt: Date.now(), id: `comp_${Date.now()}` },
          ...s.competitors,
        ]
      })),
      removeCompetitor: (id) => set(s => ({
        competitors: s.competitors.filter(c => c.id !== id)
      })),

      // ── Counts ─────────────────────────
      totalCount: () => {
        const s = get()
        return s.ideas.length + s.niches.length + s.videos.length + s.competitors.length
      },

      // ── Clear All ──────────────────────
      clearAll: () => set({ ideas: [], niches: [], videos: [], competitors: [] }),
    }),
    {
      name: STORAGE_KEY,
    }
  )
)
