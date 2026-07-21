'use client'

import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { useCart } from '@/store/cart'
import type { ProductCardData } from '@/types'
import { useWishlist } from '@/store/wishlist'

export default function ProductCard({ product }: { product: ProductCardData }) {
  const [variantIdx, setVariantIdx] = useState(0)
  const [sizeOpen, setSizeOpen] = useState(false)
  const [added, setAdded] = useState(false)
  const addItem = useCart((s) => s.addItem)
  const toggleWishlist = useWishlist((s) => s.toggle)
  const isInWishlist = useWishlist((s) => s.isInWishlist)
  const wished = isInWishlist(product.id)
  const swatchesRef = useRef<HTMLDivElement>(null)
  const [visibleCount, setVisibleCount] = useState(product.variants.length)

  const currentVariant = product.variants[variantIdx]
  const sizes = currentVariant?.sizes ?? []
  const availableSizes = sizes.filter((s) => s.stock > 0)
  const hasMultipleSizes = availableSizes.length > 1
  const image = currentVariant?.images[0] ?? product.image
  const variantStock = sizes.reduce((sum, s) => sum + s.stock, 0)
  const agotado = variantStock === 0

  useEffect(() => {
    const el = swatchesRef.current
    if (!el) return
    const calculate = () => {
      const W = el.clientWidth
      const total = product.variants.length
      const maxAll = Math.floor((W + 6) / 22)
      if (total <= maxAll) {
        setVisibleCount(total)
      } else {
        setVisibleCount(Math.max(1, Math.floor((W - 32) / 22)))
      }
    }
    const ro = new ResizeObserver(calculate)
    ro.observe(el)
    calculate()
    return () => ro.disconnect()
  }, [product.variants.length])

  const handleColorChange = (idx: number) => {
    setVariantIdx(idx)
    setSizeOpen(false)
  }

  const handleAdd = () => {
    if (agotado) return
    if (hasMultipleSizes) {
      setSizeOpen((o) => !o)
      return
    }
    const s = availableSizes[0]
    if (!s) return
    addItem({
      id: product.id,
      name: product.name,
      short: product.short ?? product.name,
      price: s.price,
      color: currentVariant?.colorName ?? product.color,
      size: s.label,
      image,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  const handleSizeAdd = (s: { label: string; price: number; stock: number }) => {
    if (s.stock === 0) return
    addItem({
      id: product.id,
      name: product.name,
      short: product.short ?? product.name,
      price: s.price,
      color: currentVariant?.colorName ?? product.color,
      size: s.label,
      image,
    })
    setAdded(true)
    setSizeOpen(false)
    setTimeout(() => setAdded(false), 1800)
  }

  const lowStock = !agotado && variantStock <= 3

  return (
    <div className="product-card">
      {/* Imagen */}
      <Link href={`/products/${product.slug}`} className="product-card-image">
        {image ? (
          <img src={image} alt={product.name} />
        ) : (
          <div className="product-card-placeholder">📷</div>
        )}
        {product.tag && (
          <span
            className="product-tag"
            style={{
              background:
                product.tag === 'OFERTA'
                  ? '#D32F2F'
                  : product.tag === 'PREMIUM'
                    ? '#4A148C'
                    : product.tag === 'NUEVO'
                      ? 'var(--rm-wine)'
                      : 'var(--rm-primary)',
            }}
          >
            {product.tag}
          </span>
        )}
        {lowStock && (
          <span className="product-tag" style={{ background: '#b45309', bottom: 8, top: 'auto' }}>
            ¡Últimas {variantStock} piezas!
          </span>
        )}
      </Link>

      {/* Info */}
      <div className="product-card-info">
        <Link href={`/products/${product.slug}`} className="product-card-name">
          {product.name}
        </Link>

        {product.rating && (
          <div className="product-card-rating">
            <span className="stars">★★★★★</span>
            {product.reviewCount && (
              <span className="product-card-reviews">({product.reviewCount})</span>
            )}
          </div>
        )}

        {/* Swatches de color */}
        {product.variants.length > 1 && (
          <div className="card-swatches" ref={swatchesRef}>
            {product.variants.slice(0, visibleCount).map((v, i) => (
              <button
                key={i}
                onClick={() => handleColorChange(i)}
                className={`card-swatch ${variantIdx === i ? 'card-swatch--active' : ''}`}
                style={{ background: v.colorHex ?? '#ccc' }}
                title={v.colorName}
              />
            ))}
            {product.variants.length > visibleCount && (
              <span className="card-swatch-more">+{product.variants.length - visibleCount}</span>
            )}
          </div>
        )}

        {/* Selector de talla */}
        {sizeOpen && (
          <div className="card-size-picker">
            {sizes.map((s, i) => (
              <button
                key={i}
                disabled={s.stock === 0}
                onClick={() => handleSizeAdd(s)}
                className={`card-size-btn ${s.stock === 0 ? 'card-size-btn--disabled' : ''}`}
              >
                {s.label}
              </button>
            ))}
          </div>
        )}

        <div className="product-card-footer">
          <div className="product-card-price">
            <span className="price-current">
              ${(availableSizes[0]?.price ?? product.price).toLocaleString('es-MX')}{' '}
              <small>MXN</small>
            </span>
            {product.comparePrice && (
              <span className="price-compare">${product.comparePrice.toLocaleString('es-MX')}</span>
            )}
          </div>
          <button
            className={`product-card-wishlist ${wished ? 'product-card-wishlist--active' : ''}`}
            aria-label={wished ? 'Quitar de favoritos' : 'Agregar a favoritos'}
            onClick={(e) => {
              e.preventDefault()
              toggleWishlist({
                id: product.id,
                name: product.name,
                slug: product.slug,
                image: product.image,
                price: availableSizes[0]?.price ?? product.price,
              })
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill={wished ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        </div>

        <button
          onClick={handleAdd}
          disabled={agotado}
          className={`card-add-btn ${added ? 'card-add-btn--done' : ''} ${agotado ? 'card-add-btn--disabled' : ''}`}
        >
          {agotado
            ? 'Agotado'
            : added
              ? '✓ ¡Agregado!'
              : sizeOpen
                ? 'Elige una talla ↑'
                : '+ Agregar'}
        </button>
      </div>
    </div>
  )
}
