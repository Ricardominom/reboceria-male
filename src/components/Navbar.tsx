'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useCart } from '@/store/cart'

// ─── PromoBar ────────────────────────────────────────────────────────────────

function PromoBar() {
  const messages = [
    '🎁 ENVÍO GRATIS en compras mayores a $800 MXN · Toda la República',
    '✨ Nueva colección primavera 2026 — Descubre los diseños exclusivos',
    '🤝 Apoyamos a más de 50 artesanas mexicanas directamente',
  ]
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % messages.length)
    }, 3500)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="promo-bar">
      <span key={index}>{messages[index]}</span>
    </div>
  )
}

// ─── Logo SVG ─────────────────────────────────────────────────────────────────

function Logo({ size = 34 }: { size?: number }) {
  const color = '#C13584'
  const angles = [0, 60, 120, 180, 240, 300]

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <circle cx="50" cy="50" r="47" stroke={color} strokeWidth="3" fill="none" />
      <circle cx="50" cy="50" r="34" stroke={color} strokeWidth="1.5" fill="none" opacity="0.35" />
      <circle cx="50" cy="50" r="8" fill={color} opacity="0.85" />
      {angles.map((a) => (
        <line
          key={a}
          x1={50 + 10 * Math.cos((a * Math.PI) / 180)}
          y1={50 + 10 * Math.sin((a * Math.PI) / 180)}
          x2={50 + 32 * Math.cos((a * Math.PI) / 180)}
          y2={50 + 32 * Math.sin((a * Math.PI) / 180)}
          stroke={color}
          strokeWidth="1.5"
          opacity="0.45"
        />
      ))}
    </svg>
  )
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: 'Inicio', href: '/' },
  { label: 'Colección', href: '/catalog' },
  { label: 'Historia', href: '/#historia' },
  { label: 'Contacto', href: '/#contacto' },
]

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const itemCount = useCart((s) => s.itemCount())
  const openCart = useCart((s) => s.openCart)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/catalog?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchOpen(false)
      setSearchQuery('')
    }
  }

  return (
    <>
      <PromoBar />
      <nav className="navbar">
        {/* Logo */}
        <Link href="/" className="navbar-logo">
          <Logo />
          <div>
            <div className="navbar-brand">Rebozos Mary</div>
            <div className="navbar-tagline">ARTESANÍAS MEXICANAS</div>
          </div>
        </Link>

        {/* Links */}
        <div className="navbar-links">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`navbar-link ${pathname === link.href ? 'navbar-link--active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Acciones */}
        <div className="navbar-actions">
          {searchOpen ? (
            <form onSubmit={handleSearch} className="navbar-search">
              <input
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar rebozos..."
                className="navbar-search-input"
              />
              <button
                type="button"
                onClick={() => {
                  setSearchOpen(false)
                  setSearchQuery('')
                }}
                className="navbar-search-close"
              >
                ✕
              </button>
            </form>
          ) : (
            <button onClick={() => setSearchOpen(true)} className="btn-search">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              Buscar
            </button>
          )}

          {/* Carrito */}
          <button onClick={openCart} className="btn-cart">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--pink)"
              strokeWidth="1.8"
            >
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
          </button>
        </div>
      </nav>
    </>
  )
}
