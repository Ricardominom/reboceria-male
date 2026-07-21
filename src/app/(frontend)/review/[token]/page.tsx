import { getPayload } from 'payload'
import config from '@/payload.config'
import { notFound } from 'next/navigation'
import TokenReviewForm from '@/components/TokenReviewForm'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Deja tu reseña — Rebozos Mary',
  robots: { index: false, follow: false },
}

export default async function ReviewTokenPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const payload = await getPayload({ config: await config })

  const { docs } = await payload.find({
    collection: 'orders',
    where: { reviewToken: { equals: token } },
    limit: 1,
  })

  const order = docs[0]
  if (!order) return notFound()

  if (order.reviewTokenUsed) {
    return (
      <div className="review-page">
        <div className="review-token-msg review-token-msg--used">
          <h2>Este enlace ya fue usado</h2>
          <p>Ya escribiste una reseña con este enlace. ¡Gracias por tu opinión!</p>
        </div>
      </div>
    )
  }

  const items = (order.items as any[]) ?? []
  const uniqueProducts: { productId: number; name: string; image: string | null }[] = []
  const seen = new Set<number>()
  for (const item of items) {
    const id = typeof item.product === 'number' ? item.product : (item.product as any)?.id
    if (id && !seen.has(id)) {
      seen.add(id)
      uniqueProducts.push({ productId: id, name: item.productName, image: null })
    }
  }

  return (
    <div className="review-page">
      <div className="review-page-header">
        <h1>¿Cómo te quedó tu rebozo?</h1>
        <p>
          Hola <strong>{order.customerName as string}</strong>, tu opinión es muy importante para
          nosotras.
        </p>
      </div>
      <TokenReviewForm
        token={token}
        products={uniqueProducts}
        customerName={(order.customerName as string) ?? ''}
        customerEmail={(order.customerEmail as string) ?? ''}
      />
    </div>
  )
}
