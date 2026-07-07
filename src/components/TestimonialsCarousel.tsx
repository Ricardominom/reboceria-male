'use client'

import { useState } from 'react'

const testimonials = [
  {
    quote: 'La calidad superó mis expectativas. Se nota el amor y la dedicación en cada detalle.',
    author: 'Mariana G.',
  },
  {
    quote:
      'Recibí mi rebozo como regalo de cumpleaños y quedé enamorada. El tejido es increíble y los colores son exactamente como en las fotos.',
    author: 'Sofía R.',
  },
  {
    quote:
      'Llevo meses buscando un rebozo artesanal de verdad. Cuando llegó el paquete venía con una nota escrita a mano. 100% recomendado.',
    author: 'Carmen L.',
  },
  {
    quote:
      'Compré uno para mi mamá y quedó tan feliz que ya me pidió otro para regalar. La calidad es inigualable.',
    author: 'Valeria M.',
  },
  {
    quote:
      'Hermoso trabajo artesanal. Se siente la tradición en cada hilo. Lo uso a diario y sigue igual de perfecto.',
    author: 'Patricia H.',
  },
]

export default function TestimonialsCarousel() {
  const [current, setCurrent] = useState(0)

  const prev = () => setCurrent((i) => (i === 0 ? testimonials.length - 1 : i - 1))
  const next = () => setCurrent((i) => (i === testimonials.length - 1 ? 0 : i + 1))

  const t = testimonials[current]

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
        <div className="testimonios-stars">★★★★★</div>
        <blockquote className="testimonios-text">"{t.quote}"</blockquote>
        <p className="testimonios-author">— {t.author}</p>
      </div>
      <div className="testimonios-dots">
        {testimonials.map((_, i) => (
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
