import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { token, author, email, reviews } = body

    if (!token || !author || !email || !Array.isArray(reviews) || reviews.length === 0) {
      return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 })
    }

    const payload = await getPayload({ config: await config })

    const { docs } = await payload.find({
      collection: 'orders',
      where: { reviewToken: { equals: token } },
      limit: 1,
    })

    const order = docs[0]
    if (!order) return NextResponse.json({ error: 'Token inválido' }, { status: 404 })
    if (order.reviewTokenUsed)
      return NextResponse.json({ error: 'Token ya usado' }, { status: 409 })

    for (const r of reviews) {
      if (!r.productId || !r.rating || !r.body) continue
      if (r.rating < 1 || r.rating > 5) continue

      await payload.create({
        collection: 'reviews',
        data: {
          product: r.productId,
          author,
          email,
          rating: Number(r.rating),
          title: r.title || undefined,
          body: r.body,
          status: 'pending',
          verified: true,
        },
      })
    }

    await payload.update({
      collection: 'orders',
      id: order.id,
      data: { reviewTokenUsed: true },
    })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
