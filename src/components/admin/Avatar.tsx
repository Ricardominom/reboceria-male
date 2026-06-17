'use client'
import { useAuth } from '@payloadcms/ui'

export default function Avatar() {
  const { user } = useAuth()
  const first = (user as any)?.firstName?.[0] ?? ''
  const last = (user as any)?.lastName?.[0] ?? ''
  const initials = (first + last).toUpperCase() || user?.email?.[0]?.toUpperCase() || '?'

  return (
    <div
      style={{
        width: 32,
        height: 32,
        borderRadius: '50%',
        backgroundColor: '#c13584',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 13,
        fontWeight: 700,
      }}
    >
      {initials}
    </div>
  )
}
