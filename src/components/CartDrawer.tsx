'use client'

import Link from 'next/link'
import { useCart } from '@/store/cart'
import type { CartItem } from '@/types'

// ─── Item individual del carrito ──────────────────────────────────────────────

function CartItemRow({ item }: { item: CartItem }) {
  const updateQty = useCart((s) => s.updateQty)
  const removeItem = useCart((s) => s.removeItem)

  return (
    <div className="cart-item">
      <div className="cart-item-image">
        {item.image ? (
          <img src={item.image} alt={item.name} />
        ) : (
          <div className="cart-item-placeholder">📷</div>
        )}
      </div>

      <div className="cart-item-info">
        <p className="cart-item-name">{item.name}</p>
        <p className="cart-item-size">{item.size}</p>
        <p className="cart-item-price">${item.price.toLocaleString('es-MX')} MXN</p>

        <div className="cart-item-controls">
          <div className="qty-control">
            <button onClick={() => updateQty(item.id, item.size, item.qty - 1)}>−</button>
            <span>{item.qty}</span>
            <button onClick={() => updateQty(item.id, item.size, item.qty + 1)}>+</button>
          </div>
          <button className="cart-item-remove" onClick={() => removeItem(item.id, item.size)}>
            Eliminar
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── CartDrawer principal ─────────────────────────────────────────────────────

export default function CartDrawer() {
  const items = useCart((s) => s.items)
  const isOpen = useCart((s) => s.isOpen)
  const closeCart = useCart((s) => s.closeCart)
  const subtotal = useCart((s) => s.subtotal())

  const shipping = subtotal >= 800 ? 0 : 150
  const total = subtotal + shipping

  if (!isOpen) return null

  return (
    <>
      {/* Overlay oscuro detrás del drawer */}
      <div className="drawer-overlay" onClick={closeCart} />

      {/* Drawer */}
      <div className="drawer">
        {/* Header */}
        <div className="drawer-header">
          <div>
            <h2 className="drawer-title">Mi bolsa</h2>
            <p className="drawer-count">{items.reduce((s, i) => s + i.qty, 0)} artículos</p>
          </div>
          <button className="drawer-close" onClick={closeCart}>
            ✕
          </button>
        </div>

        {/* Lista de productos */}
        <div className="drawer-items">
          {items.length === 0 ? (
            <div className="drawer-empty">
              <span>🛍️</span>
              <p>Tu bolsa está vacía</p>
              <small>Agrega algún rebozo para comenzar</small>
            </div>
          ) : (
            items.map((item) => <CartItemRow key={`${item.id}-${item.size}`} item={item} />)
          )}
        </div>

        {/* Footer con totales */}
        {items.length > 0 && (
          <div className="drawer-footer">
            <div className="drawer-row">
              <span>Subtotal</span>
              <span>${subtotal.toLocaleString('es-MX')} MXN</span>
            </div>

            <div className="drawer-row">
              <span style={{ color: shipping === 0 ? '#2E7D32' : 'var(--text-soft)' }}>
                Envío {shipping === 0 && '✓ GRATIS'}
              </span>
              <span style={{ color: shipping === 0 ? '#2E7D32' : 'var(--text-soft)' }}>
                {shipping === 0 ? 'Gratis' : `$${shipping} MXN`}
              </span>
            </div>

            {shipping > 0 && (
              <div className="drawer-threshold">
                ¡Agrega ${(800 - subtotal).toLocaleString('es-MX')} más para envío gratis!
              </div>
            )}

            <div className="drawer-total">
              <span>Total</span>
              <span>${total.toLocaleString('es-MX')} MXN</span>
            </div>

            <Link href="/checkout" onClick={closeCart} className="btn-checkout">
              Proceder al pago →
            </Link>

            <button onClick={closeCart} className="btn-keep-shopping">
              Seguir comprando
            </button>
          </div>
        )}
      </div>
    </>
  )
}
