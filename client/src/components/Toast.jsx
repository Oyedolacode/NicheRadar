import React from 'react'
import { useAppStore } from '../store/useAppStore'

export default function Toast() {
    const { toasts, dismissToast } = useAppStore()

    return (
        <div style={{ position: 'fixed', bottom: 18, right: 18, zIndex: 999, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {toasts.map(t => (
                <div
                    key={t.id}
                    className={`toast show ${t.type}`}
                    onClick={() => dismissToast(t.id)}
                    style={{ position: 'relative', bottom: 0, right: 0, opacity: 1, transform: 'none', pointerEvents: 'auto', cursor: 'pointer' }}
                >
                    <span>{t.type === 'ok' ? '✓' : t.type === 'e' ? '⚠' : 'ℹ'}</span>
                    <span>{t.message}</span>
                </div>
            ))}
        </div>
    )
}