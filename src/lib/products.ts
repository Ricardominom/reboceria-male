import type { Product, Media, Color } from '@/payload-types'
import type { ProductCardData, Variant } from '@/types'

export function resolveVariants(product: Product): Variant[] {
  return (product.variants ?? []).map((v) => {
    const color = typeof v.color === 'number' ? null : (v.color as Color)
    return {
      colorName: color?.name ?? 'Sin color',
      colorHex: color?.hex ?? null,
      images: (v.images ?? [])
        .map((i) => (typeof i.image !== 'number' ? (i.image as Media).url : null))
        .filter((url): url is string => url !== null),
      sizes: (v.sizes ?? []).map((s) => ({
        label: s.label,
        price: s.price ?? 0,
        stock: s.stock ?? 0,
      })),
    }
  })
}

export function toCardData(product: Product): ProductCardData {
  const variants = resolveVariants(product)
  const firstVariant = variants[0]
  const totalStock = variants.reduce(
    (sum, v) => sum + v.sizes.reduce((s2, s) => s2 + s.stock, 0),
    0,
  )
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
    image: firstVariant?.images[0] ?? null,
    color: firstVariant?.colorName ?? '',
    sizes: firstVariant?.sizes.map((s) => s.label) ?? [],
    stock: totalStock,
    variants,
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
