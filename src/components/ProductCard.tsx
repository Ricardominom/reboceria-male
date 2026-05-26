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
      size: product.sizes[0] ?? 'Único',
      image: product.image,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

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
                    : 'var(--pink)',
            }}
          >
            {product.tag}
          </span>
        )}
      </Link>

      {/* Info */}
      <div className="product-card-info">
        <Link href={`/products/${product.slug}`} className="product-card-name">
          {product.name}
        </Link>

        {product.origin && <p className="product-card-origin">📍 {product.origin}</p>}

        {product.rating && (
          <div className="product-card-rating">
            <span className="stars">
              {'★'.repeat(product.rating)}
              {'☆'.repeat(5 - product.rating)}
            </span>
            {product.reviewCount && (
              <span className="product-card-reviews">({product.reviewCount})</span>
            )}
          </div>
        )}

        <div className="product-card-footer">
          <div className="product-card-price">
            <span className="price-current">${product.price.toLocaleString('es-MX')}</span>
            {product.comparePrice && (
              <span className="price-compare">${product.comparePrice.toLocaleString('es-MX')}</span>
            )}
          </div>

          <button onClick={handleAdd} className={`btn-add ${added ? 'btn-add--done' : ''}`}>
            {added ? '✓' : '+ Agregar'}
          </button>
        </div>
      </div>
    </div>
  )
}
