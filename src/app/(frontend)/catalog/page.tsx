import { getPayload } from 'payload'
import config from '@/payload.config'
import { toCardData } from '@/lib/products'
import ProductCard from '@/components/ProductCard'
import CatalogFilters from '@/components/CatalogFilters'

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string
    category?: string
    sort?: string
    maxPrice?: string
  }>
}) {
  const params = await searchParams
  const q = params.q ?? ''
  const category = params.category ?? 'Todas'
  const sort = params.sort ?? 'relevancia'
  const maxPrice = Number(params.maxPrice ?? 5000)

  // ─── Construcción del filtro para Payload ────────────────────────────────
  const where: Record<string, unknown> = {}

  if (category !== 'Todas') {
    where.category = { equals: category }
  }
  if (q) {
    where.or = [{ name: { like: q } }, { origin: { like: q } }]
  }
  if (maxPrice < 5000) {
    where.price = { less_than_equal: maxPrice }
  }

  const payloadSort =
    sort === 'precio-asc'
      ? 'price'
      : sort === 'precio-desc'
        ? '-price'
        : sort === 'rating'
          ? '-rating'
          : '-createdAt'

  // ─── Consulta a la base de datos ─────────────────────────────────────────
  const payload = await getPayload({ config: await config })
  const { docs: products } = await payload.find({
    collection: 'products',
    where,
    sort: payloadSort,
    depth: 1,
    limit: 50,
  })

  const cards = products.map(toCardData)
  const title = category === 'Todas' ? 'Toda la colección' : `Rebozos de ${category}`

  return (
    <div className="catalog-layout">
      <CatalogFilters
        currentCategory={category}
        currentSort={sort}
        currentMaxPrice={maxPrice}
        searchQuery={q}
      />

      <div className="catalog-main">
        {/* Header */}
        <div className="catalog-header">
          <div>
            <h1 className="catalog-title">{title}</h1>
            <p className="catalog-count">
              {cards.length} {cards.length === 1 ? 'producto' : 'productos'}
              {q && (
                <>
                  {' '}
                  · búsqueda: "<strong>{q}</strong>"
                </>
              )}
            </p>
          </div>
        </div>

        {/* Productos */}
        {cards.length === 0 ? (
          <div className="catalog-empty">
            <span>🔍</span>
            <p>Sin resultados</p>
            <small>Intenta con otros filtros o términos de búsqueda</small>
          </div>
        ) : (
          <div className="products-grid products-grid--3">
            {cards.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
