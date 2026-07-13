'use client'

import { useState } from 'react'

interface ReviewItem {
  quote: string
  author: string
  rating: number
}

const FALLBACK: ReviewItem[] = [
  {
    quote: 'La calidad superó mis expectativas. Se nota el amor y la dedicación en cada detalle.',
    author: 'Mariana G.',
    rating: 5,
  },
  {
    quote:
      'Recibí mi rebozo como regalo de cumpleaños y quedé enamorada. El tejido es increíble y los colores son exactamente como en las fotos.',
    author: 'Sofía R.',
    rating: 5,
  },
  {
    quote:
      'Llevo meses buscando un rebozo artesanal de verdad. Cuando llegó el paquete venía con una nota escrita a mano. 100% recomendado.',
    author: 'Carmen L.',
    rating: 5,
  },
  {
    quote:
      'Compré uno para mi mamá y quedó tan feliz que ya me pidió otro para regalar. La calidad es inigualable.',
    author: 'Valeria M.',
    rating: 5,
  },
  {
    quote:
      'Hermoso trabajo artesanal. Se siente la tradición en cada hilo. Lo uso a diario y sigue igual de perfecto.',
    author: 'Patricia H.',
    rating: 5,
  },
]

export default function TestimonialsCarousel({ reviews }: { reviews?: ReviewItem[] }) {
  const [current, setCurrent] = useState(0)
  const items = reviews && reviews.length > 0 ? reviews : FALLBACK

  const prev = () => setCurrent((i) => (i === 0 ? items.length - 1 : i - 1))
  const next = () => setCurrent((i) => (i === items.length - 1 ? 0 : i + 1))

  const t = items[current]

  return (
    <div className="testimonios-quote">
      <div className="testimonios-header">
        <h2 className="testimonios-title">
          Lo que dicen
          <br />
          nuestras clientas
        </h2>
        <div className="testimonios-nav">
          <button className="testimonios-nav-btn" aria-label="Anterior" onClick={prev}>
            ‹
          </button>
          <button className="testimonios-nav-btn" aria-label="Siguiente" onClick={next}>
            ›
          </button>
        </div>
      </div>
      <div className="testimonios-card">
        <div className="testimonios-stars">
          {'★'.repeat(t.rating)}
          {'☆'.repeat(5 - t.rating)}
        </div>
        <blockquote className="testimonios-text">"{t.quote}"</blockquote>
        <p className="testimonios-author">— {t.author}</p>
      </div>
      <div className="testimonios-dots">
        {items.map((_, i) => (
          <span
            key={i}
            className={`testimonios-dot${i === current ? ' testimonios-dot--active' : ''}`}
            onClick={() => setCurrent(i)}
            style={{ cursor: 'pointer' }}
          />
        ))}
      </div>
    </div>
  )
}
