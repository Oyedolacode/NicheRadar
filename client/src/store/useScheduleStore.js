/**
 * store/useScheduleStore.js
 * ─────────────────────────────────────────
 * Content calendar state.
 * Tracks specific publish dates for finished videos.
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useScheduleStore = create(
  persist(
    (set, get) => ({
      slots: [],

      scheduleVideo: (video, date) => set(s => ({
        slots: [
          { 
            ...video, 
            id: `s_${Date.now()}`, 
            publishAt: date, 
            scheduledAt: Date.now() 
          },
          ...s.slots
        ]
      })),

      unschedule: (id) => set(s => ({
        slots: s.slots.filter(s => s.id !== id)
      })),

      clearSchedule: () => set({ slots: [] }),

      getUpcoming: () => {
        const now = Date.now()
        return get().slots
          .filter(s => new Date(s.publishAt).getTime() > now)
          .sort((a, b) => new Date(a.publishAt).getTime() - new Date(b.publishAt).getTime())
      }
    }),
    {
      name: 'nr6_schedule',
    }
  )
)
