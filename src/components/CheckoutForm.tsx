'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { useCart } from '@/store/cart'
import { createOrder } from '@/actions/orders'

// ─── Schema de validación ─────────────────────────────────────────────────────
const schema = z.object({
  nombre: z.string().min(2, 'Nombre requerido'),
  email: z.string().email('Email inválido'),
  tel: z.string().min(10, 'Mínimo 10 dígitos'),
  calle: z.string().min(1, 'Calle requerida'),
  numero: z.string().optional(),
  colonia: z.string().optional(),
  ciudad: z.string().min(1, 'Ciudad requerida'),
  estado: z.string().min(1, 'Estado requerido'),
  cp: z.string().length(5, 'Debe tener 5 dígitos'),
  paymentMethod: z.enum(['tarjeta', 'oxxo', 'transferencia']),
})

type FormData = z.infer<typeof schema>
type BankDetails = {
  bankName: string
  bankHolder: string
  bankClabe: string
  bankAccount: string
  transferNotes: string
}

// Qué campos validar en cada paso
const STEP_FIELDS: Record<number, (keyof FormData)[]> = {
  1: ['nombre', 'email', 'tel'],
  2: ['calle', 'ciudad', 'estado', 'cp'],
  3: ['paymentMethod'],
}

const STEPS = ['Contacto', 'Envío', 'Pago']

// ─── Helper: campo de texto ───────────────────────────────────────────────────
function Field({
  label,
  name,
  type = 'text',
  placeholder = '',
  register,
  errors,
}: {
  label: string
  name: keyof FormData
  type?: string
  placeholder?: string
  register: any
  errors: any
}) {
  return (
    <div className="field">
      <label className="field-label">{label}</label>
      <input
        {...register(name)}
        type={type}
        placeholder={placeholder}
        className={`field-input ${errors[name] ? 'field-input--error' : ''}`}
      />
      {errors[name] && <p className="field-error">{errors[name]?.message as string}</p>}
    </div>
  )
}

// ─── Componente ───────────────────────────────────────────────────────────────
export default function CheckoutForm({
  bankDetails,
  expressShippingCost = 0,
  expressShippingDays = '1–2 días hábiles',
}: {
  bankDetails: BankDetails
  expressShippingCost?: number
  expressShippingDays?: string
}) {
  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [orderDone, setOrderDone] = useState(false)
  const [orderId, setOrderId] = useState<number | null>(null)
  const [serverError, setServerError] = useState('')
  const [orderTotal, setOrderTotal] = useState(0)
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard')

  const items = useCart((s) => s.items)
  const subtotal = useCart((s) => s.subtotal())
  const clearCart = useCart((s) => s.clearCart)

  const coupon = useCart((s) => s.coupon)
  const discount = useCart((s) => s.discount())

  const standardShipping = subtotal >= 800 ? 0 : 150
  const shipping = shippingMethod === 'express' ? expressShippingCost : standardShipping
  const total = Math.max(0, subtotal - discount + shipping)

  const {
    register,
    trigger,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { paymentMethod: 'tarjeta' },
  })

  const paymentMethod = watch('paymentMethod')

  const nextStep = async () => {
    const valid = await trigger(STEP_FIELDS[step])
    if (valid) setStep((s) => s + 1)
  }

  const onSubmit = async (data: FormData) => {
    setSubmitting(true)
    setServerError('')

    const result = await createOrder({
      ...data,
      items: items.map((i) => ({
        productId: i.id,
        productName: i.name,
        color: i.color,
        size: i.size,
        qty: i.qty,
        unitPrice: i.price,
      })),
      subtotal,
      shippingCost: shipping,
      total,
      bankDetails,
      couponCode: coupon?.code,
      discountAmount: discount,
    })

    setSubmitting(false)

    if (!result.success) {
      setServerError(result.error)
      return
    }

    // Redirigir a Stripe si aplica
    if (result.stripeUrl) {
      window.location.href = result.stripeUrl
      return
    }

    // Transferencia bancaria → mostrar éxito directo
    setOrderId(result.orderId)
    setOrderTotal(total)
    clearCart()
    setOrderDone(true)
  }

  // ─── Pantalla de éxito ────────────────────────────────────────────────────
  if (orderDone) {
    return (
      <div className="checkout-success">
        <span>🎊</span>
        <h1>¡Pedido confirmado!</h1>
        <p>
          Tu pedido <strong>#{orderId}</strong> fue registrado.
        </p>
        <p className="success-sub">
          Recibirás un correo con los detalles. Tu rebozo artesanal estará en camino en 1–2 días
          hábiles.
        </p>
        <Link href="/" className="btn-primary">
          Volver a la tienda →
        </Link>
        {bankDetails.bankClabe && (
          <div className="bank-details">
            <p>Realiza tu transferencia a:</p>
            <p>
              <strong>Banco:</strong> {bankDetails.bankName}
            </p>
            <p>
              <strong>Titular:</strong> {bankDetails.bankHolder}
            </p>
            <p>
              <strong>CLABE:</strong> {bankDetails.bankClabe}
            </p>
            <p>
              <strong>Monto:</strong> ${orderTotal.toLocaleString('es-MX')} MXN
            </p>
            {bankDetails.transferNotes && <p>{bankDetails.transferNotes}</p>}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="checkout-wrapper">
      <Link href="/catalog" className="checkout-back">
        ← Seguir comprando
      </Link>
      <h1 className="checkout-title">Finalizar compra</h1>

      {/* Progress */}
      <div className="checkout-steps">
        {STEPS.map((label, i) => {
          const n = i + 1
          const done = step > n
          const current = step === n
          return (
            <div key={label} className="checkout-step-wrapper">
              <div
                className={`step-circle ${done ? 'step-circle--done' : ''} ${current ? 'step-circle--current' : ''}`}
              >
                {done ? '✓' : n}
              </div>
              <p className={`step-label ${current ? 'step-label--active' : ''}`}>{label}</p>
              {i < STEPS.length - 1 && (
                <div className={`step-line ${done ? 'step-line--done' : ''}`} />
              )}
            </div>
          )
        })}
      </div>

      <div className="checkout-grid">
        {/* Formulario */}
        <form onSubmit={handleSubmit(onSubmit)} className="checkout-form">
          {step === 1 && (
            <div>
              <h2 className="form-section-title">Información de contacto</h2>
              <Field
                label="NOMBRE COMPLETO"
                name="nombre"
                placeholder="María García"
                register={register}
                errors={errors}
              />
              <Field
                label="CORREO ELECTRÓNICO"
                name="email"
                type="email"
                placeholder="maria@ejemplo.com"
                register={register}
                errors={errors}
              />
              <Field
                label="TELÉFONO"
                name="tel"
                type="tel"
                placeholder="55 1234 5678"
                register={register}
                errors={errors}
              />
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="form-section-title">Dirección de envío</h2>
              <Field
                label="CALLE"
                name="calle"
                placeholder="Av. Insurgentes Sur"
                register={register}
                errors={errors}
              />
              <div className="field-row">
                <Field
                  label="NÚMERO"
                  name="numero"
                  placeholder="1234"
                  register={register}
                  errors={errors}
                />
                <Field
                  label="COLONIA"
                  name="colonia"
                  placeholder="Del Valle"
                  register={register}
                  errors={errors}
                />
              </div>
              <Field
                label="CIUDAD"
                name="ciudad"
                placeholder="Ciudad de México"
                register={register}
                errors={errors}
              />
              <div className="field-row">
                <Field
                  label="ESTADO"
                  name="estado"
                  placeholder="CDMX"
                  register={register}
                  errors={errors}
                />
                <Field
                  label="CÓDIGO POSTAL"
                  name="cp"
                  placeholder="03100"
                  register={register}
                  errors={errors}
                />
              </div>
              {/* Método de envío */}
              <div className="shipping-options">
                <p className="detail-label" style={{ marginBottom: '.75rem' }}>
                  MÉTODO DE ENVÍO
                </p>

                <label
                  className={`shipping-option ${shippingMethod === 'standard' ? 'shipping-option--active' : ''}`}
                >
                  <input
                    type="radio"
                    name="shippingMethod"
                    checked={shippingMethod === 'standard'}
                    onChange={() => setShippingMethod('standard')}
                  />
                  <div className="shipping-option-info">
                    <span className="shipping-option-name">Envío estándar</span>
                    <span className="shipping-option-days">3–5 días hábiles</span>
                  </div>
                  <span className="shipping-option-price">
                    {standardShipping === 0 ? '✓ GRATIS' : `$${standardShipping} MXN`}
                  </span>
                </label>

                {expressShippingCost > 0 && (
                  <label
                    className={`shipping-option ${shippingMethod === 'express' ? 'shipping-option--active' : ''}`}
                  >
                    <input
                      type="radio"
                      name="shippingMethod"
                      checked={shippingMethod === 'express'}
                      onChange={() => setShippingMethod('express')}
                    />
                    <div className="shipping-option-info">
                      <span className="shipping-option-name">⚡ Envío express</span>
                      <span className="shipping-option-days">{expressShippingDays}</span>
                    </div>
                    <span className="shipping-option-price">${expressShippingCost} MXN</span>
                  </label>
                )}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="form-section-title">Método de pago</h2>
              {(
                [
                  ['tarjeta', '💳 Tarjeta de crédito / débito'],
                  ['oxxo', '🏪 Pago en OXXO'],
                  ['transferencia', '🏦 Transferencia bancaria'],
                ] as [string, string][]
              ).map(([value, label]) => (
                <label
                  key={value}
                  className={`payment-option ${paymentMethod === value ? 'payment-option--active' : ''}`}
                >
                  <input {...register('paymentMethod')} type="radio" value={value} />
                  <span>{label}</span>
                </label>
              ))}

              {paymentMethod === 'transferencia' && bankDetails.bankClabe && (
                <div className="bank-details">
                  <p>
                    <strong>Banco:</strong> {bankDetails.bankName}
                  </p>
                  <p>
                    <strong>Titular:</strong> {bankDetails.bankHolder}
                  </p>
                  <p>
                    <strong>CLABE:</strong> {bankDetails.bankClabe}
                  </p>
                  {bankDetails.bankAccount && (
                    <p>
                      <strong>Cuenta:</strong> {bankDetails.bankAccount}
                    </p>
                  )}
                  {bankDetails.transferNotes && (
                    <p className="transfer-notes">{bankDetails.transferNotes}</p>
                  )}
                </div>
              )}
            </div>
          )}

          {serverError && <p className="server-error">{serverError}</p>}

          <div className="checkout-actions">
            {step > 1 && (
              <button type="button" onClick={() => setStep((s) => s - 1)} className="btn-back-step">
                ← Atrás
              </button>
            )}

            {step < 3 ? (
              <button
                key="next"
                type="button"
                onClick={nextStep}
                className="btn-primary checkout-btn-next"
              >
                Continuar: {STEPS[step]} →
              </button>
            ) : (
              <button
                key="submit"
                type="submit"
                disabled={submitting}
                className="btn-primary checkout-btn-next"
              >
                {submitting ? 'Procesando...' : '✓ Confirmar pedido'}
              </button>
            )}
          </div>
        </form>

        {/* Resumen del pedido */}
        <aside className="order-summary">
          <h3 className="summary-title">Resumen del pedido</h3>

          {items.map((item) => (
            <div key={`${item.id}-${item.size}-${item.color}`} className="summary-item">
              <div className="summary-item-image">
                {item.image ? <img src={item.image} alt={item.name} /> : <span>📷</span>}
              </div>
              <div className="summary-item-info">
                <p className="summary-item-name">{item.name}</p>
                <p className="summary-item-meta">
                  {item.color} · {item.size} · ×{item.qty}
                </p>
                <p className="summary-item-price">
                  ${(item.price * item.qty).toLocaleString('es-MX')} MXN
                </p>
              </div>
            </div>
          ))}

          <div className="summary-totals">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${subtotal.toLocaleString('es-MX')}</span>
            </div>
            {discount > 0 && (
              <div className="summary-row" style={{ color: '#2e7d32', fontWeight: 600 }}>
                <span>Descuento ({coupon?.code})</span>
                <span>−${discount.toLocaleString('es-MX')}</span>
              </div>
            )}
            <div className="summary-row">
              <span style={{ color: shipping === 0 ? '#2E7D32' : 'var(--text-soft)' }}>
                {shippingMethod === 'express' ? '⚡ Express' : 'Envío'}
                {shipping === 0 && ' ✓ GRATIS'}
              </span>
              <span style={{ color: shipping === 0 ? '#2E7D32' : 'var(--text-soft)' }}>
                {shipping === 0 ? 'Gratis' : `$${shipping} MXN`}
              </span>
            </div>
            <div className="summary-total">
              <span>Total</span>
              <span>${total.toLocaleString('es-MX')} MXN</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
