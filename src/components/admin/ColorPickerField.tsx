'use client'

import { useField } from '@payloadcms/ui'

export default function ColorPickerField({ path, field }: any) {
  const { value, setValue } = useField<string>({ path })

  return (
    <div style={{ marginBottom: '1rem' }}>
      <label
        style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.875rem' }}
      >
        {field.label ?? 'Color'}
      </label>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <input
          type="color"
          value={value || '#000000'}
          onChange={(e) => setValue(e.target.value)}
          style={{
            width: 52,
            height: 44,
            padding: '2px',
            border: '1px solid var(--theme-elevation-150)',
            borderRadius: '4px',
            cursor: 'pointer',
            background: 'none',
          }}
        />
        <input
          type="text"
          value={value ?? ''}
          onChange={(e) => setValue(e.target.value)}
          placeholder="#1B3A6B"
          style={{
            flex: 1,
            padding: '8px 12px',
            border: '1px solid var(--theme-elevation-150)',
            borderRadius: '4px',
            fontFamily: 'monospace',
            background: 'var(--theme-elevation-50)',
            color: 'var(--theme-text)',
          }}
        />
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            background: value || '#cccccc',
            border: '2px solid var(--theme-elevation-200)',
            flexShrink: 0,
          }}
        />
      </div>
    </div>
  )
}
