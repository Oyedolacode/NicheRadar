/**
 * store/useQueueStore.js
 * ─────────────────────────────────────────
 * Production pipeline state.
 * Tracks videos from idea -> script -> produce -> scheduled
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useQueueStore = create(
  persist(
    (set, get) => ({
      items: [],
      
      addToQueue: (item) => set(s => ({
        items: [
          { 
            ...item, 
            id: `q_${Date.now()}`, 
            status: 'backlog', 
            addedAt: Date.now(),
            priority: 'medium'
          },
          ...s.items
        ]
      })),

      updateStatus: (id, status) => set(s => ({
        items: s.items.map(i => i.id === id ? { ...i, status } : i)
      })),

      removeItem: (id) => set(s => ({
        items: s.items.filter(i => i.id !== id)
      })),

      clearQueue: () => set({ items: [] }),

      // Counts by status
      getCounts: () => {
        const s = get().items
        return {
          backlog: s.filter(i => i.status === 'backlog').length,
          scripting: s.filter(i => i.status === 'scripting').length,
          producing: s.filter(i => i.status === 'producing').length,
          finished: s.filter(i => i.status === 'finished').length,
        }
      }
    }),
    {
      name: 'nr6_queue',
    }
  )
)
