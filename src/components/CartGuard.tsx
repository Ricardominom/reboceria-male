'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/store/cart'

export default function CartGuard() {
  const router = useRouter()
  const items = useCart((s) => s.items)

  useEffect(() => {
    if (items.length === 0) {
      router.replace('/catalog')
    }
  }, [items, router])

  return null
}
