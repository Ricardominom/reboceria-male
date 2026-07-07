'use client'

export default function ColorSwatchCell({ cellData }: { cellData: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div
        style={{
          width: 22,
          height: 22,
          borderRadius: '50%',
          background: cellData || '#ccc',
          border: '1px solid rgba(0,0,0,0.15)',
          flexShrink: 0,
        }}
      />
      <span style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{cellData || '—'}</span>
    </div>
  )
}
