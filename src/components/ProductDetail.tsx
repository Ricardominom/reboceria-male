'use client'

import { useState } from 'react'
import { useCart } from '@/store/cart'
import type { ProductDetailData } from '@/types'
import Link from 'next/link'

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
  const [openAccordion, setOpenAccordion] = useState<string | null>('descripcion')
  const [activeImage, setActiveImage] = useState(0)
  const [added, setAdded] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  const addItem = useCart((s) => s.addItem)

  const currentVariant = product.variants[selectedColor]
  const images = currentVariant?.images ?? []
  const agotado = (currentVariant?.sizes[selectedSize]?.stock ?? 0) === 0

  const handleColorChange = (index: number) => {
    setSelectedColor(index)
    setActiveImage(0)
    setSelectedSize(0)
  }

  const handleAdd = () => {
    const selectedSizeData = currentVariant?.sizes[selectedSize]
    const itemBase = {
      id: product.id,
      name: product.name,
      short: product.name,
      price: selectedSizeData?.price ?? product.price,
      color: currentVariant?.colorName ?? '',
      size: selectedSizeData?.label ?? 'Único',
      image: images[0] ?? null,
    }
    for (let i = 0; i < qty; i++) addItem(itemBase)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const toggleAccordion = (id: string) => setOpenAccordion((prev) => (prev === id ? null : id))

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
          {/* Thumbnails izquierda */}
          {images.length > 1 && (
            <div className="product-gallery-thumbs">
              {images.map((url, i) => (
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

          {/* Imagen principal */}
          <div className="product-gallery-main">
            <div className="gallery-badge">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              Hecho a mano
            </div>

            {images[activeImage] ? (
              <img
                src={images[activeImage]}
                alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <div className="product-gallery-placeholder">📷</div>
            )}

            <button
              className="gallery-expand"
              aria-label="Ampliar imagen"
              onClick={() => setLightboxOpen(true)}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="15 3 21 3 21 9" />
                <polyline points="9 21 3 21 3 15" />
                <line x1="21" y1="3" x2="14" y2="10" />
                <line x1="3" y1="21" x2="10" y2="14" />
              </svg>
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="product-info">
          {product.tag && (
            <span
              className="product-tag"
              style={{
                background:
                  product.tag === 'PREMIUM'
                    ? '#4A148C'
                    : product.tag === 'NUEVO'
                      ? 'var(--rm-wine)'
                      : 'var(--rm-primary)',
              }}
            >
              {product.tag}
            </span>
          )}

          <h1 className="product-detail-name">{product.name}</h1>

          {product.rating && (
            <div className="product-detail-rating">
              <span className="stars">
                {'★'.repeat(product.rating)}
                {'☆'.repeat(5 - product.rating)}
              </span>
              {product.reviewCount && <span>{product.reviewCount} reseñas</span>}
            </div>
          )}

          {/* Precio */}
          <div className="product-detail-price">
            <span className="price-big">
              $
              {(currentVariant?.sizes[selectedSize]?.price ?? product.price).toLocaleString(
                'es-MX',
              )}
            </span>
            <span className="price-currency">MXN</span>
            {product.comparePrice && (
              <span className="price-compare">${product.comparePrice.toLocaleString('es-MX')}</span>
            )}
            {!agotado && <span className="in-stock">En stock</span>}
          </div>

          {!agotado && (currentVariant?.sizes[selectedSize]?.stock ?? 0) <= 3 && (
            <p style={{ color: '#b45309', fontWeight: 600, fontSize: 13, marginBottom: 12 }}>
              ⚡ ¡Últimas {currentVariant?.sizes[selectedSize]?.stock} piezas!
            </p>
          )}

          {/* Material */}
          {product.material && (
            <div className="product-detail-section">
              <p className="detail-label">MATERIAL</p>
              <span className="material-badge">🌿 {product.material}</span>
            </div>
          )}

          {/* Colores */}
          {product.variants.length > 0 && (
            <div className="product-detail-section">
              <p className="detail-label">
                COLOR: <strong>{currentVariant?.colorName}</strong>
              </p>
              <div className="color-swatches">
                {product.variants.map((v, i) => (
                  <button
                    key={i}
                    onClick={() => handleColorChange(i)}
                    className={`color-swatch ${selectedColor === i ? 'color-swatch--active' : ''}`}
                    style={{ background: v.colorHex ?? '#ccc' }}
                    title={v.colorName}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Tallas */}
          {(currentVariant?.sizes?.length ?? 0) > 0 && (
            <div className="product-detail-section">
              <p className="detail-label">TAMAÑO</p>
              <div className="size-options">
                {currentVariant?.sizes.map((size, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedSize(i)}
                    disabled={size.stock === 0}
                    className={`size-option ${selectedSize === i ? 'size-option--active' : ''} ${size.stock === 0 ? 'size-option--disabled' : ''}`}
                  >
                    {size.label}
                    {size.stock === 0 && <span className="size-agotado"> · Agotado</span>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Cantidad */}
          <div className="product-add-row">
            <p className="detail-label">CANTIDAD</p>
            <div className="qty-control-large">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={agotado}>
                −
              </button>
              <span>{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} disabled={agotado}>
                +
              </button>
            </div>
          </div>

          {/* Agregar a la bolsa */}
          <button
            onClick={handleAdd}
            disabled={agotado}
            className={`btn-add-large ${added ? 'btn-add-large--done' : ''} ${agotado ? 'btn-add-large--disabled' : ''}`}
          >
            {agotado ? 'Agotado' : added ? '✓ ¡Agregado!' : '+ Agregar a la bolsa'}
          </button>

          {/* Trust badges */}
          <div className="product-trust">
            {[
              {
                icon: '/svg/envio.svg',
                title: 'Envío gratis',
                sub: 'en pedidos mayores a $800',
              },
              { icon: '/svg/pago-seguro.svg', title: 'Pago seguro', sub: '100% protegido' },
              {
                icon: '/svg/cambios.svg',
                title: 'Cambios fáciles',
                sub: 'sin complicaciones',
              },
              {
                icon: '/svg/hecho-mano.svg',
                title: 'Hecho a mano',
                sub: 'por artesanas mexicanas',
              },
            ].map((badge, i) => (
              <div key={i} className="trust-badge">
                <img src={badge.icon} alt="" className="trust-icon" />
                <div>
                  <p className="trust-title">{badge.title}</p>
                  <p className="trust-sub">{badge.sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Acordeón */}
          <div className="product-accordion">
            {[
              {
                id: 'descripcion',
                label: 'DESCRIPCIÓN',
                content: product.description || 'Sin descripción disponible.',
                type: 'text' as const,
              },
              {
                id: 'cuidados',
                label: 'INSTRUCCIONES DE CUIDADO',
                content: product.careInstructions,
                type: 'list' as const,
                fallback: CARE_DEFAULT,
              },
              {
                id: 'envio',
                label: 'ENVÍO Y DEVOLUCIONES',
                content: null,
                type: 'list' as const,
                fallback: SHIPPING_INFO,
              },
            ].map((item) => (
              <div key={item.id} className="accordion-item">
                <button className="accordion-btn" onClick={() => toggleAccordion(item.id)}>
                  {item.label}
                  <span
                    className={`accordion-chevron ${openAccordion === item.id ? 'accordion-chevron--open' : ''}`}
                  >
                    ▼
                  </span>
                </button>
                {openAccordion === item.id && (
                  <div className="accordion-content">
                    {item.type === 'text' ? (
                      <p>{item.content}</p>
                    ) : (
                      <ul>
                        {(item.content
                          ? item.content.split('. ').filter(Boolean)
                          : (item.fallback ?? [])
                        ).map((line, i) => (
                          <li key={i}>{line}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Lightbox */}
      {lightboxOpen && (
        <div className="lightbox-overlay" onClick={() => setLightboxOpen(false)}>
          <button className="lightbox-close" onClick={() => setLightboxOpen(false)}>
            ✕
          </button>
          <img
            src={images[activeImage]}
            alt={product.name}
            className="lightbox-img"
            onClick={(e) => e.stopPropagation()}
          />
          {images.length > 1 && (
            <>
              <button
                className="lightbox-prev"
                onClick={(e) => {
                  e.stopPropagation()
                  setActiveImage((i) => (i - 1 + images.length) % images.length)
                }}
              >
                ‹
              </button>
              <button
                className="lightbox-next"
                onClick={(e) => {
                  e.stopPropagation()
                  setActiveImage((i) => (i + 1) % images.length)
                }}
              >
                ›
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
