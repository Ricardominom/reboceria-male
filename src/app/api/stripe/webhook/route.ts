import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { stripe } from '@/lib/stripe'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { sendOrderConfirmation } from '@/lib/email'

export const runtime = 'nodejs'

async function reduceVariantStock(payload: any, item: any) {
  const productId = typeof item.product === 'object' ? item.product?.id : item.product
  if (!productId) return

  const product = await payload.findByID({ collection: 'products', id: productId, depth: 1 })

  const updatedVariants = (product.variants ?? []).map((v: any) => {
    const colorName = typeof v.color === 'object' ? v.color?.name : null
    const colorId = typeof v.color === 'object' ? v.color?.id : v.color
    return {
      ...v,
      color: colorId,
      stock:
        colorName === item.color ? Math.max(0, (v.stock ?? 0) - (item.qty ?? 0)) : (v.stock ?? 0),
      images: (v.images ?? []).map((img: any) => ({
        ...img,
        image: typeof img.image === 'object' ? img.image?.id : img.image,
      })),
    }
  })

  await payload.update({
    collection: 'products',
    id: productId,
    data: { variants: updatedVariants },
  })
}

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

  // Pago completado (tarjeta)
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    // Para OXXO, esperar async_payment_succeeded
    if (session.payment_status !== 'paid') {
      return NextResponse.json({ received: true })
    }

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
        await Promise.all(order.items.map((item: any) => reduceVariantStock(payload, item)))
        console.log(`✓ Stock actualizado para pedido #${orderId}`)

        sendOrderConfirmation({
          to: order.customerEmail,
          customerName: order.customerName,
          orderId: order.id,
          items: order.items.map((item: any) => ({
            productName: item.productName,
            color: item.color ?? '',
            size: item.size ?? 'Único',
            qty: item.qty,
            unitPrice: item.unitPrice,
          })),
          subtotal: order.subtotal,
          shippingCost: order.shippingCost,
          total: order.total,
          paymentMethod: 'tarjeta',
          address: {
            street: order.address?.street,
            number: order.address?.number ?? undefined,
            colonia: order.address?.colonia ?? undefined,
            city: order.address?.city,
            state: order.address?.state,
            postalCode: order.address?.postalCode,
          },
        }).catch((err) => console.error('Error enviando email post-pago:', err))
      }

      console.log(`✓ Pedido #${orderId} marcado como pagado`)
    }
  }

  // Pago OXXO confirmado
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
        await Promise.all(order.items.map((item: any) => reduceVariantStock(payload, item)))
        console.log(`✓ Pedido OXXO #${orderId} confirmado y stock actualizado`)

        sendOrderConfirmation({
          to: order.customerEmail,
          customerName: order.customerName,
          orderId: order.id,
          items: order.items.map((item: any) => ({
            productName: item.productName,
            color: item.color ?? '',
            size: item.size ?? 'Único',
            qty: item.qty,
            unitPrice: item.unitPrice,
          })),
          subtotal: order.subtotal,
          shippingCost: order.shippingCost,
          total: order.total,
          paymentMethod: 'oxxo',
          address: {
            street: order.address?.street,
            number: order.address?.number ?? undefined,
            colonia: order.address?.colonia ?? undefined,
            city: order.address?.city,
            state: order.address?.state,
            postalCode: order.address?.postalCode,
          },
        }).catch((err) => console.error('Error enviando email post-pago:', err))
      }
    }
  }

  return NextResponse.json({ received: true })
}
