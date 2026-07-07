'use client'
import { useState } from 'react'

export default function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setDone(true)
  }

  return done ? (
    <p className="newsletter-thanks">¡Gracias! Pronto recibirás noticias de Rebozos Mary.</p>
  ) : (
    <form className="newsletter-form" onSubmit={handleSubmit}>
      <input
        type="email"
        className="newsletter-input"
        placeholder="Escribe tu correo"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button type="submit" className="newsletter-btn">
        Suscribirme
      </button>
    </form>
  )
}
