import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { stripe } from '@/lib/stripe'
import { getPayload } from 'payload'
import config from '@/payload.config'

// Importante: desactivar el body parser de Next.js
// Stripe necesita el body RAW (sin parsear) para verificar la firma
export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'Sin firma' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error('Webhook signature error:', err)
    return NextResponse.json({ error: 'Firma inválida' }, { status: 400 })
  }

  // Pago completado (tarjeta o OXXO confirmado)
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    // Para OXXO, esperar async_payment_succeeded
    if (session.payment_status !== 'paid') {
      return NextResponse.json({ received: true })
    }

    const orderId = session.metadata?.orderId

    if (orderId) {
      const payload = await getPayload({ config: await config })

      // Actualizar status de la orden
      await payload.update({
        collection: 'orders',
        id: Number(orderId),
        data: {
          status: 'paid',
          stripeSessionId: session.id,
          stripePaymentIntentId:
            typeof session.payment_intent === 'string' ? session.payment_intent : undefined,
        },
      })

      // Reducir stock por cada producto comprado
      const order = await payload.findByID({
        collection: 'orders',
        id: Number(orderId),
        depth: 1,
      })

      if (order?.items?.length) {
        await Promise.all(
          order.items.map(async (item: any) => {
            const productId = typeof item.product === 'object' ? item.product?.id : item.product
            if (!productId) return

            const product = await payload.findByID({ collection: 'products', id: productId })
            const newStock = Math.max(0, (product.stock ?? 0) - (item.qty ?? 0))

            await payload.update({
              collection: 'products',
              id: productId,
              data: { stock: newStock },
            })
          }),
        )
        console.log(`✓ Stock actualizado para pedido #${orderId}`)
      }

      console.log(`✓ Pedido #${orderId} marcado como pagado`)
    }
  }

  // Pago OXXO confirmado (el dinero llegó)
  if (event.type === 'checkout.session.async_payment_succeeded') {
    const session = event.data.object as Stripe.Checkout.Session
    const orderId = session.metadata?.orderId

    if (orderId) {
      const payload = await getPayload({ config: await config })

      await payload.update({
        collection: 'orders',
        id: Number(orderId),
        data: {
          status: 'paid',
          stripeSessionId: session.id,
          stripePaymentIntentId:
            typeof session.payment_intent === 'string' ? session.payment_intent : undefined,
        },
      })

      const order = await payload.findByID({
        collection: 'orders',
        id: Number(orderId),
        depth: 1,
      })

      if (order?.items?.length) {
        await Promise.all(
          order.items.map(async (item: any) => {
            const productId = typeof item.product === 'object' ? item.product?.id : item.product
            if (!productId) return

            const product = await payload.findByID({ collection: 'products', id: productId })
            const newStock = Math.max(0, (product.stock ?? 0) - (item.qty ?? 0))

            await payload.update({
              collection: 'products',
              id: productId,
              data: { stock: newStock },
            })
          }),
        )
      }

      console.log(`✓ Pedido OXXO #${orderId} confirmado y stock actualizado`)
    }
  }

  return NextResponse.json({ received: true })
}
