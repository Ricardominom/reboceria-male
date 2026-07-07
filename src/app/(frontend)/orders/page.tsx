import OrderLookup from '@/components/OrderLookup'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Seguimiento de pedido — Rebozos Mary',
}

export default function OrdersPage() {
  return (
    <div className="order-lookup-wrapper">
      <h1 className="order-lookup-title">Seguimiento de pedido</h1>
      <p className="order-lookup-sub">
        Ingresa tu correo y número de pedido para consultar el estado.
      </p>
      <OrderLookup />
    </div>
  )
}
