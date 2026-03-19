import React from 'react'
import { useAppStore } from '../store/useAppStore'

const TYPE_STYLES = {
    ok: { borderColor: 'var(--green)', color: 'var(--green)', icon: '✓' },
    e: { borderColor: 'var(--red)', color: 'var(--red)', icon: '⚠' },
    w: { borderColor: 'var(--yellow)', color: 'var(--yellow)', icon: 'ℹ' },
    info: { borderColor: 'var(--border)', color: 'var(--text)', icon: 'ℹ' },
}

export default function Toast() {
    const { toasts, dismissToast } = useAppStore()

    return (
        <div style={{ position: 'fixed', bottom: 18, right: 18, zIndex: 999, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {toasts.map(t => {
                const style = TYPE_STYLES[t.type] || TYPE_STYLES.info
                return (
                    <div
                        key={t.id}
                        onClick={() => dismissToast(t.id)}
                        style={{
                            background: 'var(--elevated)',
                            border: `1px solid ${style.borderColor}`,
                            borderRadius: 'var(--r)',
                            padding: '9px 13px',
                            fontSize: 12,
                            color: style.color,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 7,
                            boxShadow: '0 8px 32px rgba(0,0,0,.5)',
                            maxWidth: 320,
                            fontFamily: 'var(--fm)',
                            cursor: 'pointer',
                            animation: 'fadeIn .3s ease',
                        }}
                    >
                        <span>{style.icon}</span>
                        <span>{t.message}</span>
                    </div>
                )
            })}
        </div>
    )
}