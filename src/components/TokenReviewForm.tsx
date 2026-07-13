'use client'

import { useState } from 'react'

interface Product {
  productId: number
  name: string
  image: string | null
}

interface ProductReview {
  rating: number
  title: string
  body: string
}

export default function TokenReviewForm({
  token,
  products,
  customerName,
  customerEmail,
}: {
  token: string
  products: Product[]
  customerName: string
  customerEmail: string
}) {
  const [reviews, setReviews] = useState<Record<number, ProductReview>>(
    Object.fromEntries(products.map((p) => [p.productId, { rating: 0, title: '', body: '' }])),
  )
  const [hover, setHover] = useState<Record<number, number>>({})
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle')

  const updateReview = (productId: number, field: keyof ProductReview, value: string | number) => {
    setReviews((prev) => ({ ...prev, [productId]: { ...prev[productId], [field]: value } }))
  }

  const allRated = products.every((p) => reviews[p.productId]?.rating > 0)
  const allFilled = products.every((p) => reviews[p.productId]?.body.trim().length > 0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!allRated || !allFilled) return
    setStatus('loading')
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          author: customerName,
          email: customerEmail,
          reviews: products.map((p) => ({
            productId: p.productId,
            ...reviews[p.productId],
          })),
        }),
      })
      setStatus(res.ok ? 'ok' : 'error')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'ok') {
    return (
      <div className="review-success">
        <h2>¡Gracias por tu reseña!</h2>
        <p>
          La publicaremos después de una breve revisión. ¡Nos alegra que hayas disfrutado tu rebozo!
        </p>
      </div>
    )
  }

  return (
    <form className="token-review-form" onSubmit={handleSubmit}>
      {products.map((product) => {
        const r = reviews[product.productId]
        const h = hover[product.productId] ?? 0
        return (
          <div key={product.productId} className="token-review-product">
            <div className="token-review-product-info">
              {product.image && (
                <img src={product.image} alt={product.name} className="token-review-product-img" />
              )}
              <h3>{product.name}</h3>
            </div>

            <div className="review-stars-input">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`review-star-btn ${star <= (h || r.rating) ? 'review-star-btn--active' : ''}`}
                  onMouseEnter={() => setHover((prev) => ({ ...prev, [product.productId]: star }))}
                  onMouseLeave={() => setHover((prev) => ({ ...prev, [product.productId]: 0 }))}
                  onClick={() => updateReview(product.productId, 'rating', star)}
                >
                  ★
                </button>
              ))}
              {r.rating === 0 && (
                <span className="review-star-hint">Selecciona una calificación</span>
              )}
            </div>

            <input
              className="review-input"
              placeholder="Título de tu reseña (opcional)"
              value={r.title}
              onChange={(e) => updateReview(product.productId, 'title', e.target.value)}
            />
            <textarea
              className="review-textarea"
              placeholder="Cuéntanos tu experiencia con este rebozo *"
              required
              rows={4}
              value={r.body}
              onChange={(e) => updateReview(product.productId, 'body', e.target.value)}
            />
          </div>
        )
      })}

      {status === 'error' && <p className="review-error">Ocurrió un error. Intenta de nuevo.</p>}

      <button
        type="submit"
        className="review-submit-btn"
        disabled={!allRated || !allFilled || status === 'loading'}
      >
        {status === 'loading' ? 'Enviando...' : 'Publicar mi reseña'}
      </button>
    </form>
  )
}
