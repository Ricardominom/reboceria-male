'use server'

import { getPayload } from 'payload'
import config from '@/payload.config'
import { stripe } from '@/lib/stripe'
import { sendOrderConfirmation } from '@/lib/email'

export type CreateOrderInput = {
  nombre: string
  email: string
  tel: string
  calle: string
  numero?: string
  colonia?: string
  ciudad: string
  estado: string
  cp: string
  paymentMethod: 'tarjeta' | 'oxxo' | 'transferencia'
  items: Array<{
    productId: number
    productName: string
    color: string
    size: string
    qty: number
    unitPrice: number
  }>
  subtotal: number
  shippingCost: number
  total: number
  bankDetails?: {
    bankName: string
    bankHolder: string
    bankClabe: string
    transferNotes: string
  }
  couponCode?: string
  discountAmount?: number
}

export async function createOrder(input: CreateOrderInput) {
  try {
    const payload = await getPayload({ config: await config })

    // Verificar stock disponible
    for (const item of input.items) {
      const product = await payload.findByID({
        collection: 'products',
        id: item.productId,
        depth: 1,
      })
      const variant = (product.variants ?? []).find((v) => {
        const c = typeof v.color === 'number' ? null : (v.color as any)
        return c?.name === item.color
      })
      const sizeData = (variant?.sizes ?? []).find((s: any) => s.label === item.size)
      if (!variant || !sizeData || (sizeData.stock ?? 0) < item.qty) {
        return {
          success: false as const,
          error: `"${item.productName} — ${item.color}" ya no tiene stock suficiente.`,
        }
      }
    }

    // 1. Crear el pedido en Payload
    const order = await payload.create({
      collection: 'orders',
      data: {
        customerName: input.nombre,
        customerEmail: input.email,
        customerPhone: input.tel,
        address: {
          street: input.calle,
          number: input.numero,
          colonia: input.colonia,
          city: input.ciudad,
          state: input.estado,
          postalCode: input.cp,
        },
        items: input.items.map((item) => ({
          product: item.productId,
          productName: item.productName,
          color: item.color,
          size: item.size,
          qty: item.qty,
          unitPrice: item.unitPrice,
        })),
        subtotal: input.subtotal,
        shippingCost: input.shippingCost,
        total: input.total,
        paymentMethod: input.paymentMethod,
        status: 'pending',
        couponCode: input.couponCode,
        discountAmount: input.discountAmount ?? 0,
      },
    })

    // Enviar email de confirmación (no bloquea el flujo si falla)
    if (input.paymentMethod === 'transferencia') {
      sendOrderConfirmation({
        to: input.email,
        customerName: input.nombre,
        orderId: order.id,
        items: input.items,
        subtotal: input.subtotal,
        shippingCost: input.shippingCost,
        total: input.total,
        paymentMethod: input.paymentMethod,
        address: {
          street: input.calle,
          number: input.numero,
          colonia: input.colonia,
          city: input.ciudad,
          state: input.estado,
          postalCode: input.cp,
        },
        bankDetails: input.bankDetails,
      }).catch((err) => console.error('Error enviando email de confirmación:', err))
    }

    // 2. Transferencia bancaria → sin Stripe, confirmación directa
    if (input.paymentMethod === 'transferencia') {
      return { success: true as const, orderId: order.id, stripeUrl: null }
    }

    // 3. Tarjeta u OXXO → crear sesión de Stripe
    const baseUrl = process.env.NEXT_PUBLIC_URL ?? 'http://localhost:3000'

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      currency: 'mxn',
      customer_email: input.email,

      // Productos del pedido
      line_items: [
        ...input.items.map((item) => ({
          price_data: {
            currency: 'mxn',
            product_data: { name: `${item.productName} — ${item.color} / ${item.size}` },
            unit_amount: Math.round(item.unitPrice * 100), // Stripe maneja centavos
          },
          quantity: item.qty,
        })),
        // Envío como línea separada (solo si aplica)
        ...(input.shippingCost > 0
          ? [
              {
                price_data: {
                  currency: 'mxn',
                  product_data: { name: 'Envío estándar' },
                  unit_amount: Math.round(input.shippingCost * 100),
                },
                quantity: 1,
              },
            ]
          : []),
      ],

      // Descuento con cupón
      ...(input.discountAmount && input.discountAmount > 0
        ? await (async () => {
            const stripeCoupon = await stripe.coupons.create({
              amount_off: Math.round(input.discountAmount! * 100),
              currency: 'mxn',
              duration: 'once',
              name: `Descuento: ${input.couponCode}`,
            })
            return { discounts: [{ coupon: stripeCoupon.id }] }
          })()
        : {}),

      // Métodos de pago según selección
      payment_method_types: input.paymentMethod === 'oxxo' ? ['oxxo'] : ['card'],

      // Opciones especiales para OXXO
      ...(input.paymentMethod === 'oxxo' && {
        payment_method_options: {
          oxxo: { expires_after_days: 2 },
        },
      }),

      // URLs de regreso
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/checkout/cancel`,

      // Guardamos el ID del pedido para actualizarlo en el webhook
      metadata: {
        orderId: String(order.id),
        couponCode: input.couponCode ?? '',
      },
    })

    return {
      success: true as const,
      orderId: order.id,
      stripeUrl: session.url,
    }
  } catch (error) {
    console.error('Error al crear pedido:', error)
    return {
      success: false as const,
      error: 'No se pudo procesar el pedido. Intenta de nuevo.',
    }
  }
}
