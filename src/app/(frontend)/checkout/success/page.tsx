import Link from 'next/link'
import { stripe } from '@/lib/stripe'

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>
}) {
  const { session_id } = await searchParams

  let customerEmail = ''

  if (session_id) {
    try {
      const session = await stripe.checkout.sessions.retrieve(session_id)
      customerEmail = session.customer_email ?? ''
    } catch {
      // Si falla la consulta, mostramos éxito genérico
    }
  }

  return (
    <div className="checkout-success">
      <span>🎊</span>
      <h1>¡Pago confirmado!</h1>
      <p>
        Tu pedido fue procesado exitosamente.
        {customerEmail && (
          <>
            {' '}
            Recibirás los detalles en <strong>{customerEmail}</strong>.
          </>
        )}
      </p>
      <p className="success-sub">Tu rebozo artesanal estará en camino en 1–2 días hábiles.</p>
      <Link href="/" className="btn-primary">
        Volver a la tienda →
      </Link>
    </div>
  )
}
