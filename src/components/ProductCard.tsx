'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useCart } from '@/store/cart'
import type { ProductCardData } from '@/types'

export default function ProductCard({ product }: { product: ProductCardData }) {
  const [added, setAdded] = useState(false)
  const addItem = useCart((s) => s.addItem)

  const handleAdd = () => {
    addItem({
      id: product.id,
      name: product.name,
      short: product.short ?? product.name,
      price: product.price,
      color: product.color,
      size: product.sizes[0] ?? 'Único',
      image: product.image,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  const agotado = product.stock === 0

  return (
    <div className="product-card">
      {/* Imagen */}
      <Link href={`/products/${product.slug}`} className="product-card-image">
        {product.image ? (
          <img src={product.image} alt={product.name} />
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

        {typeof product.stock === 'number' && product.stock > 0 && product.stock <= 3 && (
          <span className="product-tag" style={{ background: '#b45309', bottom: 8, top: 'auto' }}>
            ¡Últimas {product.stock} piezas!
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

        <div className="product-card-footer">
          <div className="product-card-price">
            <span className="price-current">
              ${product.price.toLocaleString('es-MX')} <small>MXN</small>
            </span>
            {product.comparePrice && (
              <span className="price-compare">${product.comparePrice.toLocaleString('es-MX')}</span>
            )}
          </div>

          <button
            className="product-card-wishlist"
            aria-label="Favorito"
            onClick={(e) => e.preventDefault()}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
