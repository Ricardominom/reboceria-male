'use server'

import { getPayload } from 'payload'
import config from '@/payload.config'
import { stripe } from '@/lib/stripe'

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
    size: string
    qty: number
    unitPrice: number
  }>
  subtotal: number
  shippingCost: number
  total: number
}

export async function createOrder(input: CreateOrderInput) {
  try {
    const payload = await getPayload({ config: await config })

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
          size: item.size,
          qty: item.qty,
          unitPrice: item.unitPrice,
        })),
        subtotal: input.subtotal,
        shippingCost: input.shippingCost,
        total: input.total,
        paymentMethod: input.paymentMethod,
        status: 'pending',
      },
    })

    // 2. Transferencia bancaria → sin Stripe, confirmación directa
    if (input.paymentMethod === 'transferencia') {
      return { success: true as const, orderId: order.id, stripeUrl: null }
    }

    // 3. Tarjeta u OXXO → crear sesión de Stripe
    const baseUrl = process.env.NEXT_PUBLIC_URL!

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      currency: 'mxn',
      customer_email: input.email,

      // Productos del pedido
      line_items: [
        ...input.items.map((item) => ({
          price_data: {
            currency: 'mxn',
            product_data: { name: `${item.productName} — ${item.size}` },
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
      metadata: { orderId: String(order.id) },
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
