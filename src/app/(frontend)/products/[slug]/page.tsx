import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@/payload.config'
import type { Media } from '@/payload-types'
import { extractText } from '@/lib/products'
import ProductDetail from '@/components/ProductDetail'
import ProductCard from '@/components/ProductCard'
import { toCardData } from '@/lib/products'
import type { ProductDetailData } from '@/types'

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

  // ─── Productos relacionados (misma categoría) ────────────────────────────
  const { docs: related } = await payload.find({
    collection: 'products',
    where: {
      and: [{ category: { equals: product.category } }, { slug: { not_equals: slug } }],
    },
    depth: 1,
    limit: 3,
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
    colors: product.colors?.map((c) => c.hex) ?? [],
    sizes: product.sizes?.map((s) => s.label) ?? [],
    images: (product.images ?? [])
      .map((i) => (typeof i.image !== 'number' ? (i.image as Media).url : null))
      .filter((url): url is string => url !== null),
    stock: product.stock,
  }

  return (
    <div>
      <ProductDetail product={detail} />

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
