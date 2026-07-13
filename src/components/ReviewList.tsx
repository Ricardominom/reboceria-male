import type { Review } from '@/payload-types'

function Stars({ rating }: { rating: number }) {
  return (
    <span className="review-stars">
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className={s <= rating ? 'star-filled' : 'star-empty'}>
          ★
        </span>
      ))}
    </span>
  )
}

export default function ReviewList({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) {
    return <p className="review-empty">Aún no hay reseñas. ¡Sé el primero!</p>
  }

  const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length

  return (
    <div className="review-list">
      <div className="review-summary">
        <span className="review-avg">{avg.toFixed(1)}</span>
        <Stars rating={Math.round(avg)} />
        <span className="review-count">
          {reviews.length} {reviews.length === 1 ? 'reseña' : 'reseñas'}
        </span>
      </div>

      {reviews.map((r) => (
        <div key={r.id} className="review-item">
          <div className="review-item-header">
            <Stars rating={r.rating} />
            <span className="review-author">{r.author}</span>
            {r.verified && <span className="review-verified">✓ Compra verificada</span>}
            <time className="review-date">
              {new Date(r.createdAt).toLocaleDateString('es-MX', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          </div>
          {r.title && <p className="review-item-title">{r.title}</p>}
          <p className="review-body">{r.body}</p>
        </div>
      ))}
    </div>
  )
}
