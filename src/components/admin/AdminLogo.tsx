'use client'

export default function AdminLogo() {
  return (
    <div style={{ textAlign: 'center', padding: '8px 0' }}>
      <p
        style={{
          fontFamily: '"Lora", Georgia, serif',
          fontSize: 26,
          fontWeight: 700,
          fontStyle: 'italic',
          color: '#c13584',
          letterSpacing: '-0.01em',
          lineHeight: 1.1,
          margin: 0,
        }}
      >
        Rebozos Mary
      </p>
      <p
        style={{
          fontFamily: '"Nunito", sans-serif',
          fontSize: 9,
          fontWeight: 800,
          letterSpacing: '0.2em',
          color: '#9a7a7a',
          textTransform: 'uppercase' as const,
          margin: '5px 0 0',
        }}
      >
        Artesanías mexicanas
      </p>
    </div>
  )
}
