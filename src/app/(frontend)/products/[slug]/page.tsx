import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@/payload.config'
import type { Media } from '@/payload-types'
import { extractText, toCardData, resolveVariants } from '@/lib/products'
import ProductDetail from '@/components/ProductDetail'
import ProductCard from '@/components/ProductCard'
import type { ProductDetailData } from '@/types'
import type { Metadata } from 'next'
import ReviewList from '@/components/ReviewList'
import type { Review } from '@/payload-types'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayload({ config: await config })

  const { docs } = await payload.find({
    collection: 'products',
    where: { slug: { equals: slug } },
    depth: 1,
    limit: 1,
  })

  const product = docs[0]
  if (!product) return { title: 'Producto no encontrado — Rebozos Mary' }

  const firstVariant = product.variants?.[0]
  const firstImage = firstVariant?.images?.[0]
  const imageUrl =
    firstImage && typeof firstImage.image !== 'number' ? (firstImage.image as any).url : undefined

  return {
    title: `${product.name} — Rebozos Mary`,
    description: `Rebozo artesanal ${product.name}${product.origin ? ` de ${product.origin}` : ''}. ${product.material ? `Material: ${product.material}.` : ''} Envío a toda la República.`,
    openGraph: {
      title: `${product.name} — Rebozos Mary`,
      images: imageUrl ? [{ url: imageUrl }] : [],
    },
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payload = await getPayload({ config: await config })

  // ─── Busca el producto por slug ─────────────────────────────────────────
  const { docs } = await payload.find({
    collection: 'products',
    where: { slug: { equals: slug } },
    depth: 2,
    limit: 1,
  })

  const product = docs[0]
  if (!product) notFound()
  const storeSettings = await payload.findGlobal({ slug: 'store-settings', depth: 0 })

  // ─── Productos relacionados (misma categoría) ────────────────────────────
  const categoryId =
    typeof product.category === 'object' && product.category !== null
      ? (product.category as { id: number }).id
      : typeof product.category === 'number'
        ? product.category
        : null

  const related = categoryId
    ? (
        await payload.find({
          collection: 'products',
          where: {
            and: [{ category: { equals: categoryId } }, { slug: { not_equals: slug } }],
          },
          depth: 1,
          limit: 3,
        })
      ).docs
    : []

  const { docs: reviews } = await payload.find({
    collection: 'reviews',
    where: {
      and: [{ product: { equals: product.id } }, { status: { equals: 'approved' } }],
    },
    sort: '-createdAt',
    limit: 50,
  })

  // ─── Serializa los datos para el Client Component ────────────────────────
  const detail: ProductDetailData = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    origin: product.origin,
    price: product.price,
    comparePrice: product.comparePrice,
    tag: product.tag,
    rating: product.rating,
    reviewCount: product.reviewCount,
    material: product.material,
    description: extractText(product.description),
    careInstructions: extractText(product.careInstructions),
    variants: resolveVariants(product),
  }

  return (
    <div>
      <ProductDetail
        product={detail}
        shippingNotes={storeSettings.shippingNotes ?? undefined}
        sizeGuide={(storeSettings.sizeGuide ?? []) as any[]}
        sizeGuideNotes={storeSettings.sizeGuideNotes ?? undefined}
      />

      {/* ── Reseñas ── */}
      <section className="reviews-section">
        <h2 className="reviews-section-title">Reseñas del producto</h2>
        <ReviewList reviews={reviews as Review[]} />
      </section>

      {/* ── Productos relacionados ── */}
      {related.length > 0 && (
        <section className="related-products">
          <h2 className="section-title">También te puede gustar</h2>
          <div className="products-grid products-grid--3">
            {related.map((p) => (
              <ProductCard key={p.id} product={toCardData(p)} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
