'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useCart } from '@/store/cart'
import Image from 'next/image'

// ─── PromoBar ────────────────────────────────────────────────────────────────

function PromoBar({ messages }: { messages: string[] }) {
  const defaultMessages = [
    '🎁 ENVÍO GRATIS en compras mayores a $800 MXN · Toda la República',
    '✨ Nueva colección primavera 2026 — Descubre los diseños exclusivos',
    '🤝 Apoyamos a más de 50 artesanas mexicanas directamente',
  ]
  const list = messages.length > 0 ? messages : defaultMessages
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % list.length)
    }, 3500)
    return () => clearInterval(timer)
  }, [list.length])

  return (
    <div className="promo-bar">
      <span key={index}>{list[index]}</span>
    </div>
  )
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: 'Inicio', href: '/' },
  { label: 'Colecciones', href: '/catalog' },
  { label: 'Guía de Rebozos', href: '/guia' },
  { label: 'Mi pedido', href: '/orders' },
  { label: 'Contacto', href: '/#contacto' },
]

export default function Navbar({ promoMessages = [] }: { promoMessages?: string[] }) {
  const pathname = usePathname()
  const router = useRouter()
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

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
      <PromoBar messages={promoMessages} />
      <nav className="navbar">
        {/* Logo */}
        <Link href="/" className="navbar-logo">
          <Image src="/img/LOGO-REB-03.png" alt="Rebozos Mary" width={40} height={40} />
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
            <button onClick={() => setSearchOpen(true)} className="btn-icon" aria-label="Buscar">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </button>
          )}

          {/* Perfil */}
          <Link href="/orders" className="btn-icon" aria-label="Mi cuenta">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
            </svg>
          </Link>

          {/* Carrito */}
          <button
            onClick={openCart}
            className="btn-icon"
            aria-label="Carrito"
            style={{ position: 'relative' }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
          </button>

          {/* Hamburger — solo móvil */}
          <button
            className="btn-hamburger"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Menú"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>
      {menuOpen && (
        <div className="mobile-menu">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="mobile-menu-link"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </>
  )
}
