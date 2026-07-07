'use client'

import { useRowLabel } from '@payloadcms/ui'
import { useEffect, useState } from 'react'

export function VariantRowLabel() {
  const { data, rowNumber } = useRowLabel()
  const [colorName, setColorName] = useState<string | null>(null)

  const colorId = (data as any)?.color

  useEffect(() => {
    if (!colorId || typeof colorId !== 'number') return
    fetch(`/api/colors/${colorId}`)
      .then((r) => r.json())
      .then((doc) => setColorName(doc?.name ?? null))
      .catch(() => setColorName(null))
  }, [colorId])

  return <span>{colorName ?? `Variante ${(rowNumber ?? 0) + 1}`}</span>
}
