import type { Product, Media } from '@/payload-types'
import type { ProductCardData } from '@/types'

export function getFirstImageUrl(product: Product): string | null {
  const first = product.images?.[0]
  if (!first || typeof first.image === 'number') return null
  return (first.image as Media).url ?? null
}

export function toCardData(product: Product): ProductCardData {
  return {
    id: product.id,
    name: product.name,
    short: product.short,
    slug: product.slug,
    origin: product.origin,
    price: product.price,
    comparePrice: product.comparePrice,
    tag: product.tag,
    rating: product.rating,
    reviewCount: product.reviewCount,
    image: getFirstImageUrl(product),
    sizes: product.sizes?.map((s) => s.label) ?? [],
    stock: product.stock,
  }
}

export function extractText(content: unknown): string {
  if (!content || typeof content !== 'object') return ''
  const obj = content as Record<string, unknown>
  if (obj.type === 'text' && typeof obj.text === 'string') return obj.text
  if (obj.root) return extractText(obj.root)
  if (Array.isArray(obj.children)) {
    return (obj.children as unknown[]).map(extractText).filter(Boolean).join(' ')
  }
  return ''
}
