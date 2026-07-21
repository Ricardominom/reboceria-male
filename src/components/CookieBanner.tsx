'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem('rm_cookie_accepted')) {
      setVisible(true)
    }
  }, [])

  const accept = () => {
    localStorage.setItem('rm_cookie_accepted', '1')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="cookie-banner" role="region" aria-label="Aviso de cookies">
      <p className="cookie-banner-text">
        Este sitio usa cookies técnicas esenciales para el carrito de compras.{' '}
        <Link href="/privacidad" className="cookie-banner-link">
          Más información
        </Link>
      </p>
      <button className="cookie-banner-btn" onClick={accept}>
        Entendido
      </button>
    </div>
  )
}
