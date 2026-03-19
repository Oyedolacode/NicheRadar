import { create } from 'zustand'

export const useAppStore = create((set, get) => ({
    currentPage: 'explorer',
    setPage: (page) => set({ currentPage: page }),

    quotaUsed: 0,
    quotaLimit: 10_000,
    addQuota: (units) => set(s => ({ quotaUsed: s.quotaUsed + units })),
    quotaPct: () => Math.min(100, (get().quotaUsed / get().quotaLimit) * 100),

    apiStatus: 'ready',
    setApiStatus: (s) => set({ apiStatus: s }),
    setApiError: () => set({ apiStatus: 'quota_exceeded' }),

    loading: false,
    setLoading: (l) => set({ loading: l }),

    toasts: [],
    toast: (message, type = 'info') => {
        const id = Date.now()
        set(s => ({ toasts: [...s.toasts, { id, message, type }] }))
        setTimeout(() => set(s => ({ toasts: s.toasts.filter(t => t.id !== id) })), 3500)
    },
    dismissToast: (id) => set(s => ({ toasts: s.toasts.filter(t => t.id !== id) })),

    lastExplorerResult: null,
    setLastExplorerResult: (r) => set({ lastExplorerResult: r }),

    cacheCount: 0,
    setCacheCount: (n) => set({ cacheCount: n }),
    clearCache: () => {
        try {
            Object.keys(localStorage)
                .filter(k => k.startsWith('nr6_'))
                .forEach(k => localStorage.removeItem(k))
        } catch (e) { }
        set({ cacheCount: 0 })
        get().toast('Cache cleared', 'ok')
    },
}))