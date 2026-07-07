'use client'

import { useState } from 'react'

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending: { label: 'Pendiente de pago', color: '#b45309' },
  paid: { label: 'Pagado ✓', color: '#2E7D32' },
  shipped: { label: 'En camino 🚚', color: '#1565C0' },
  delivered: { label: 'Entregado ✓', color: '#2E7D32' },
  cancelled: { label: 'Cancelado', color: '#C62828' },
}

export default function OrderLookup() {
  const [email, setEmail] = useState('')
  const [orderId, setOrderId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [order, setOrder] = useState<any>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setOrder(null)

    const res = await fetch(
      `/api/orders/lookup?email=${encodeURIComponent(email)}&orderId=${encodeURIComponent(orderId)}`,
    )
    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError('No encontramos un pedido con esos datos. Verifica tu correo y número de pedido.')
      return
    }

    setOrder(data)
  }

  const statusInfo = order
    ? (STATUS_LABELS[order.status] ?? { label: order.status, color: '#555' })
    : null

  return (
    <div className="order-lookup">
      <form onSubmit={handleSubmit} className="order-lookup-form">
        <div className="field">
          <label className="field-label">CORREO ELECTRÓNICO</label>
          <input
            type="email"
            className="field-input"
            placeholder="tu@correo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="field">
          <label className="field-label">NÚMERO DE PEDIDO</label>
          <input
            type="number"
            className="field-input"
            placeholder="123"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            required
          />
        </div>
        {error && <p className="field-error">{error}</p>}
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Buscando...' : 'Consultar pedido'}
        </button>
      </form>

      {order && (
        <div className="order-result">
          <div className="order-result-header">
            <div>
              <p className="order-result-id">Pedido #{order.id}</p>
              <p className="order-result-date">
                {new Date(order.createdAt).toLocaleDateString('es-MX', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            <span
              className="order-result-status"
              style={{ color: statusInfo?.color, borderColor: statusInfo?.color }}
            >
              {statusInfo?.label}
            </span>
          </div>

          <div className="order-result-items">
            {(order.items ?? []).map((item: any, i: number) => (
              <div key={i} className="order-result-item">
                <span className="order-result-item-name">
                  {item.productName} — {item.color} / {item.size}
                </span>
                <span className="order-result-item-qty">×{item.qty}</span>
                <span className="order-result-item-price">
                  ${(item.unitPrice * item.qty).toLocaleString('es-MX')} MXN
                </span>
              </div>
            ))}
          </div>

          <div className="order-result-total">
            Total: <strong>${order.total?.toLocaleString('es-MX')} MXN</strong>
          </div>
        </div>
      )}
    </div>
  )
}
