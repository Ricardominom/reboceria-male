import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const email = searchParams.get('email')?.toLowerCase().trim()
  const orderId = Number(searchParams.get('orderId'))

  if (!email || !orderId) {
    return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 })
  }

  const payload = await getPayload({ config: await config })

  const order = await payload
    .findByID({
      collection: 'orders',
      id: orderId,
      depth: 0,
    })
    .catch(() => null)

  if (!order || order.customerEmail?.toLowerCase() !== email) {
    return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 })
  }

  return NextResponse.json({
    id: order.id,
    status: order.status,
    total: order.total,
    paymentMethod: order.paymentMethod,
    createdAt: order.createdAt,
    items: order.items,
  })
}
