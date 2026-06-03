'use client'

import { useTheme } from '@payloadcms/ui'

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <div style={{ padding: '0 16px 12px' }}>
      <button
        onClick={() => setTheme(isDark ? 'light' : 'dark')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '9px 14px',
          width: '100%',
          borderRadius: 8,
          border: '1px solid var(--theme-elevation-150)',
          background: 'transparent',
          cursor: 'pointer',
          color: 'var(--theme-text)',
          fontSize: 12,
          fontWeight: 700,
          fontFamily: 'Nunito, sans-serif',
          textAlign: 'left',
          transition: 'background 0.15s',
        }}
      >
        <span style={{ fontSize: 15 }}>{isDark ? '☀️' : '🌙'}</span>
        <span>{isDark ? 'Modo claro' : 'Modo oscuro'}</span>
      </button>
    </div>
  )
}
