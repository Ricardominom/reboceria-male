import Link from 'next/link'

export default function CancelPage() {
  return (
    <div className="checkout-success">
      <span>😕</span>
      <h1>Pago cancelado</h1>
      <p>No se realizó ningún cargo. Tu carrito sigue guardado.</p>
      <Link href="/checkout" className="btn-primary">
        Volver al checkout →
      </Link>
    </div>
  )
}
