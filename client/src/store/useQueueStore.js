/**
 * store/useQueueStore.js
 * ─────────────────────────────────────────
 * Zustand store for the Production Queue (Kanban)
 * and Publishing Scheduler. Persists to localStorage.
 *
 * Used by:
 *   - queue.jsx        (Kanban board)
 *   - scheduler.jsx    (Publishing calendar)
 *   - factory.jsx      (Add to Queue button)
 *   - dashboard.jsx    (Queue count badge)
 */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const STORAGE_KEY = 'nr6_queue_store'

const EMPTY_KANBAN = {
  ideas: [],
  script: [],
  recording: [],
  editing: [],
  scheduled: [],
}

export const useQueueStore = create(
  persist(
    (set, get) => ({

      /* ── Kanban ──────────────────────────── */
      kanban: { ...EMPTY_KANBAN },

      // Add a new card to the Ideas column
      addToQueue: (item) => set(s => ({
        kanban: {
          ...s.kanban,
          ideas: [
            { id: Date.now(), title: item.title || '', topic: item.topic || '', created: new Date().toLocaleDateString(), ...item },
            ...s.kanban.ideas,
          ],
        },
      })),

      // Move a card from one column to another
      moveCard: (id, fromCol, toCol) => set(s => {
        const fromArr = [...s.kanban[fromCol]]
        const idx = fromArr.findIndex(c => String(c.id) === String(id))
        if (idx === -1) return s
        const [card] = fromArr.splice(idx, 1)
        return {
          kanban: {
            ...s.kanban,
            [fromCol]: fromArr,
            [toCol]: [...s.kanban[toCol], { ...card, status: toCol }],
          },
        }
      }),

      // Remove a card from a column
      removeCard: (id, col) => set(s => ({
        kanban: {
          ...s.kanban,
          [col]: s.kanban[col].filter(c => String(c.id) !== String(id)),
        },
      })),

      // Clear the entire board
      clearQueue: () => set({ kanban: { ...EMPTY_KANBAN } }),

      // Computed: total videos across all columns
      totalCount: () => Object.values(get().kanban).flat().length,

      // All videos flattened (for scheduler to pick from)
      allVideos: () => Object.values(get().kanban).flat(),

      /* ── Scheduler ───────────────────────── */
      schedule: {}, // { 'YYYY-MM-DD': [{ id, title, time, published }] }

      // Schedule a video to a specific date
      scheduleVideo: (dateKey, video) => set(s => ({
        schedule: {
          ...s.schedule,
          [dateKey]: [
            ...(s.schedule[dateKey] || []),
            { id: video.id || Date.now(), title: video.title, time: '18:00', published: false },
          ],
        },
      })),

      // Toggle published status
      togglePublished: (dateKey, videoId) => set(s => ({
        schedule: {
          ...s.schedule,
          [dateKey]: (s.schedule[dateKey] || []).map(item =>
            String(item.id) === String(videoId)
              ? { ...item, published: !item.published }
              : item
          ),
        },
      })),

      // Remove a scheduled item
      removeScheduled: (dateKey, videoId) => set(s => ({
        schedule: {
          ...s.schedule,
          [dateKey]: (s.schedule[dateKey] || []).filter(item => String(item.id) !== String(videoId)),
        },
      })),

      // Auto-schedule unscheduled videos
      autoSchedule: (uploadsPerWeek = 3) => {
        const state = get()
        const allVids = state.allVideos()
        const scheduled = Object.values(state.schedule).flat().map(i => String(i.id))
        const pending = allVids.filter(v => !scheduled.includes(String(v.id)))
        if (!pending.length) return 0

        const bestDays = [1, 3, 6] // Mon, Wed, Sat
        const now = new Date()
        let vi = 0, count = 0
        const newSchedule = { ...state.schedule }

        for (let d = 0; d < 14 && vi < pending.length; d++) {
          const date = new Date(now)
          date.setDate(now.getDate() + d)
          if (date < now) continue
          const day = date.getDay()

          const shouldUpload =
            uploadsPerWeek >= 7 ||
            (uploadsPerWeek >= 5 && day !== 0 && day !== 6) ||
            (uploadsPerWeek >= 3 && bestDays.includes(day)) ||
            (uploadsPerWeek >= 2 && [1, 4].includes(day)) ||
            (uploadsPerWeek >= 1 && day === 1)

          if (!shouldUpload) continue

          const key = date.toISOString().slice(0, 10)
          if (newSchedule[key]?.length) continue
          if (!newSchedule[key]) newSchedule[key] = []

          newSchedule[key].push({
            id: pending[vi].id,
            title: pending[vi].title,
            time: '18:00',
            published: false,
          })
          vi++; count++
        }

        set({ schedule: newSchedule })
        return count
      },

      // Clear schedule
      clearSchedule: () => set({ schedule: {} }),

      // Total scheduled count
      scheduledCount: () => Object.values(get().schedule).flat().length,

      // Unscheduled videos count
      unscheduledCount: () => {
        const state = get()
        const scheduled = new Set(Object.values(state.schedule).flat().map(i => String(i.id)))
        return state.allVideos().filter(v => !scheduled.has(String(v.id))).length
      },
    }),
    {
      name: STORAGE_KEY,
    }
  )
)