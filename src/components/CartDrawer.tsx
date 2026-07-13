'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useCart } from '@/store/cart'
import type { CartItem } from '@/types'

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
        <p className="cart-item-size">
          {item.color} · {item.size}
        </p>
        <p className="cart-item-price">${item.price.toLocaleString('es-MX')} MXN</p>
        <div className="cart-item-controls">
          <div className="qty-control">
            <button onClick={() => updateQty(item.id, item.size, item.color, item.qty - 1)}>
              −
            </button>
            <span>{item.qty}</span>
            <button onClick={() => updateQty(item.id, item.size, item.color, item.qty + 1)}>
              +
            </button>
          </div>
          <button
            className="cart-item-remove"
            onClick={() => removeItem(item.id, item.size, item.color)}
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  )
}

export default function CartDrawer() {
  const items = useCart((s) => s.items)
  const isOpen = useCart((s) => s.isOpen)
  const closeCart = useCart((s) => s.closeCart)
  const subtotal = useCart((s) => s.subtotal())
  const discount = useCart((s) => s.discount())
  const coupon = useCart((s) => s.coupon)
  const applyCoupon = useCart((s) => s.applyCoupon)
  const removeCoupon = useCart((s) => s.removeCoupon)

  const [couponInput, setCouponInput] = useState('')
  const [couponLoading, setCouponLoading] = useState(false)
  const [couponError, setCouponError] = useState('')

  const shipping = subtotal >= 800 ? 0 : 150
  const total = Math.max(0, subtotal - discount + shipping)

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return
    setCouponLoading(true)
    setCouponError('')
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponInput.trim(), subtotal }),
      })
      const data = await res.json()
      if (data.valid) {
        applyCoupon(data)
        setCouponInput('')
      } else {
        setCouponError(data.error ?? 'Cupón inválido')
      }
    } catch {
      setCouponError('Error al validar el cupón')
    } finally {
      setCouponLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <>
      <div className="drawer-overlay" onClick={closeCart} />
      <div className="drawer">
        <div className="drawer-header">
          <div>
            <h2 className="drawer-title">Mi bolsa</h2>
            <p className="drawer-count">{items.reduce((s, i) => s + i.qty, 0)} artículos</p>
          </div>
          <button className="drawer-close" onClick={closeCart}>
            ✕
          </button>
        </div>

        <div className="drawer-items">
          {items.length === 0 ? (
            <div className="drawer-empty">
              <span>🛍️</span>
              <p>Tu bolsa está vacía</p>
              <small>Agrega algún rebozo para comenzar</small>
            </div>
          ) : (
            items.map((item) => (
              <CartItemRow key={`${item.id}-${item.size}-${item.color}`} item={item} />
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="drawer-footer">
            {/* Campo de cupón */}
            {coupon ? (
              <div className="coupon-applied">
                <span>
                  🏷️ <strong>{coupon.code}</strong> — -
                  {coupon.type === 'percentage' ? `${coupon.value}%` : `$${coupon.value} MXN`}
                </span>
                <button className="coupon-remove" onClick={removeCoupon}>
                  ✕
                </button>
              </div>
            ) : (
              <div className="coupon-field">
                <input
                  className="coupon-input"
                  placeholder="Código de descuento"
                  value={couponInput}
                  onChange={(e) => {
                    setCouponInput(e.target.value.toUpperCase())
                    setCouponError('')
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                />
                <button
                  className="coupon-btn"
                  onClick={handleApplyCoupon}
                  disabled={couponLoading || !couponInput.trim()}
                >
                  {couponLoading ? '...' : 'Aplicar'}
                </button>
              </div>
            )}
            {couponError && <p className="coupon-error">{couponError}</p>}

            {/* Totales */}
            <div className="drawer-row">
              <span>Subtotal</span>
              <span>${subtotal.toLocaleString('es-MX')} MXN</span>
            </div>

            {discount > 0 && (
              <div className="drawer-row drawer-row--discount">
                <span>Descuento</span>
                <span>−${discount.toLocaleString('es-MX')} MXN</span>
              </div>
            )}

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
