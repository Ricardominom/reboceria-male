import Link from 'next/link'
import { stripe } from '@/lib/stripe'
import ClearCart from '@/components/ClearCart'

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>
}) {
  const { session_id } = await searchParams

  let customerEmail = ''
  let orderId = ''
  let isOxxo = false

  if (session_id) {
    try {
      const session = await stripe.checkout.sessions.retrieve(session_id)
      customerEmail = session.customer_email ?? ''
      orderId = session.metadata?.orderId ?? ''
      isOxxo = session.payment_status === 'unpaid'
    } catch {
      // Si falla la consulta, mostramos éxito genérico
    }
  }

  return (
    <div className="checkout-success">
      <span>{isOxxo ? '🏪' : '🎊'}</span>

      <h1>{isOxxo ? '¡Tu voucher está listo!' : '¡Pago confirmado!'}</h1>

      {orderId && (
        <p>
          Pedido <strong>#{orderId}</strong>
        </p>
      )}

      {isOxxo ? (
        <>
          <p>
            Tienes <strong>2 días</strong> para realizar tu pago en cualquier tienda OXXO.
            {customerEmail && (
              <>
                {' '}
                Revisa tu correo <strong>{customerEmail}</strong> para ver el voucher con el monto y
                el código de barras.
              </>
            )}
          </p>
          <p className="success-sub">Tu pedido será confirmado en cuanto recibamos el pago.</p>
        </>
      ) : (
        <>
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
        </>
      )}

      <Link href="/" className="btn-primary">
        Volver a la tienda →
      </Link>
      <ClearCart />
    </div>
  )
}
