import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { checkRateLimit } from '@/lib/rate-limit'

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
    if (!checkRateLimit(ip, 10, 60_000)) {
      return NextResponse.json(
        { valid: false, error: 'Demasiados intentos. Espera un momento.' },
        { status: 429 },
      )
    }
    const { code, subtotal } = await req.json()
    if (!code || typeof subtotal !== 'number') {
      return NextResponse.json({ valid: false, error: 'Datos inválidos' }, { status: 400 })
    }

    const payload = await getPayload({ config: await config })
    const { docs } = await payload.find({
      collection: 'coupons',
      where: { code: { equals: code.toUpperCase().trim() } },
      limit: 1,
    })

    const coupon = docs[0]
    if (!coupon) return NextResponse.json({ valid: false, error: 'Cupón no encontrado' })
    if (!coupon.active) return NextResponse.json({ valid: false, error: 'Cupón no disponible' })
    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return NextResponse.json({ valid: false, error: 'Cupón vencido' })
    }
    if (coupon.maxUses != null && (coupon.usedCount ?? 0) >= coupon.maxUses) {
      return NextResponse.json({ valid: false, error: 'Cupón agotado' })
    }
    if ((coupon.minPurchase ?? 0) > 0 && subtotal < coupon.minPurchase!) {
      return NextResponse.json({
        valid: false,
        error: `Compra mínima de $${coupon.minPurchase!.toLocaleString('es-MX')} MXN requerida`,
      })
    }

    const discountAmount =
      coupon.type === 'percentage'
        ? Math.round(subtotal * (coupon.value / 100))
        : Math.min(coupon.value, subtotal)

    return NextResponse.json({
      valid: true,
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      discountAmount,
    })
  } catch {
    return NextResponse.json({ valid: false, error: 'Error interno' }, { status: 500 })
  }
}
