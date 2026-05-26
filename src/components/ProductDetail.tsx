'use client'

import { useState } from 'react'
import { useCart } from '@/store/cart'
import type { ProductDetailData } from '@/types'
import Link from 'next/link'

type Tab = 'descripcion' | 'cuidados' | 'envio'

const SHIPPING_INFO = [
  'Envío estándar: 3–5 días hábiles ($150 MXN)',
  'Envío express: 1–2 días hábiles ($280 MXN)',
  'Envío gratis en compras mayores a $800 MXN',
  'Cada rebozo se empaca con papel de china y caja especial',
  'Rastreo en tiempo real por correo electrónico',
]

const CARE_DEFAULT = [
  'Lavar a mano con agua fría y jabón suave',
  'Secar a la sombra, extendido horizontalmente',
  'No usar blanqueadores ni suavizantes',
  'Planchar a temperatura baja si es necesario',
  'Guardar doblado en una bolsa de tela transpirable',
]

export default function ProductDetail({ product }: { product: ProductDetailData }) {
  const [selectedColor, setSelectedColor] = useState(0)
  const [selectedSize, setSelectedSize] = useState(0)
  const [qty, setQty] = useState(1)
  const [activeTab, setActiveTab] = useState<Tab>('descripcion')
  const [activeImage, setActiveImage] = useState(0)
  const [added, setAdded] = useState(false)

  const addItem = useCart((s) => s.addItem)

  const handleAdd = () => {
    addItem({
      id: product.id,
      name: product.name,
      short: product.name,
      price: product.price,
      size: product.sizes[selectedSize] ?? 'Único',
      image: product.images[0] ?? null,
    })
    for (let i = 0; i < qty - 1; i++) {
      addItem({
        id: product.id,
        name: product.name,
        short: product.name,
        price: product.price,
        size: product.sizes[selectedSize] ?? 'Único',
        image: product.images[0] ?? null,
      })
    }
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: 'descripcion', label: 'Descripción' },
    { id: 'cuidados', label: 'Cuidados' },
    { id: 'envio', label: 'Envío' },
  ]

  return (
    <div>
      {/* ── Breadcrumb ── */}
      <nav className="breadcrumb">
        <Link href="/">Inicio</Link>
        <span>›</span>
        <Link href="/catalog">Colección</Link>
        <span>›</span>
        <span>{product.name}</span>
      </nav>

      {/* ── Contenido principal ── */}
      <div className="product-detail-grid">
        {/* Galería */}
        <div className="product-gallery">
          <div className="product-gallery-main">
            {product.images[activeImage] ? (
              <img src={product.images[activeImage]} alt={product.name} />
            ) : (
              <div className="product-gallery-placeholder">📷</div>
            )}
          </div>

          {product.images.length > 1 && (
            <div className="product-gallery-thumbs">
              {product.images.map((url, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`thumb ${activeImage === i ? 'thumb--active' : ''}`}
                >
                  <img src={url} alt={`${product.name} ${i + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="product-info">
          {product.tag && (
            <span
              className="product-tag"
              style={{
                background: product.tag === 'PREMIUM' ? '#4A148C' : 'var(--pink)',
              }}
            >
              {product.tag}
            </span>
          )}

          <h1 className="product-detail-name">{product.name}</h1>

          {product.origin && <p className="product-detail-origin">📍 {product.origin}</p>}

          {product.rating && (
            <div className="product-detail-rating">
              <span className="stars">
                {'★'.repeat(product.rating)}
                {'☆'.repeat(5 - product.rating)}
              </span>
              {product.reviewCount && <span>{product.reviewCount} reseñas</span>}
              <span className="in-stock">· En stock</span>
            </div>
          )}

          {/* Precio */}
          <div className="product-detail-price">
            <span className="price-big">${product.price.toLocaleString('es-MX')}</span>
            <span className="price-currency">MXN</span>
            {product.comparePrice && (
              <span className="price-compare">${product.comparePrice.toLocaleString('es-MX')}</span>
            )}
          </div>

          {/* Material */}
          {product.material && (
            <div className="product-detail-section">
              <p className="detail-label">MATERIAL</p>
              <span className="material-badge">🌿 {product.material}</span>
            </div>
          )}

          {/* Colores */}
          {product.colors.length > 0 && (
            <div className="product-detail-section">
              <p className="detail-label">COLOR</p>
              <div className="color-swatches">
                {product.colors.map((hex, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedColor(i)}
                    className={`color-swatch ${selectedColor === i ? 'color-swatch--active' : ''}`}
                    style={{ background: hex }}
                    title={hex}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Tallas */}
          {product.sizes.length > 0 && (
            <div className="product-detail-section">
              <p className="detail-label">TAMAÑO</p>
              <div className="size-options">
                {product.sizes.map((size, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedSize(i)}
                    className={`size-option ${selectedSize === i ? 'size-option--active' : ''}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Cantidad + Agregar */}
          <div className="product-add-row">
            <div className="qty-control-large">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
              <span>{qty}</span>
              <button onClick={() => setQty((q) => q + 1)}>+</button>
            </div>
            <button
              onClick={handleAdd}
              className={`btn-add-large ${added ? 'btn-add-large--done' : ''}`}
            >
              {added ? '✓ ¡Agregado!' : 'Agregar a la bolsa'}
            </button>
          </div>

          {/* Trust badges */}
          <div className="product-trust">
            {[
              ['🚚', 'Envío gratis en pedidos mayores a $800'],
              ['🔒', 'Pago 100% seguro y protegido'],
              ['↩️', 'Devolución gratuita en 30 días'],
            ].map(([icon, text]) => (
              <div key={text} className="trust-badge">
                <span>{icon}</span>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="product-tabs">
        <div className="tabs-header">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`tab-btn ${activeTab === tab.id ? 'tab-btn--active' : ''}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="tab-content">
          {activeTab === 'descripcion' && (
            <p>{product.description || 'Sin descripción disponible.'}</p>
          )}
          {activeTab === 'cuidados' && (
            <ul>
              {(product.careInstructions
                ? product.careInstructions.split('. ').filter(Boolean)
                : CARE_DEFAULT
              ).map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          )}
          {activeTab === 'envio' && (
            <ul>
              {SHIPPING_INFO.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
