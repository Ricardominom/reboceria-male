import { getPayload } from 'payload'
import config from '@/payload.config'
import { toCardData } from '@/lib/products'
import ProductCard from '@/components/ProductCard'
import CatalogFilters from '@/components/CatalogFilters'
import type { Metadata } from 'next'

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>
}): Promise<Metadata> {
  const params = await searchParams
  const category = params.category
  const q = params.q

  let title = 'Colección — Rebozos Mary'
  let description =
    'Explora nuestra colección de rebozos artesanales tejidos a mano por artesanas mexicanas. Envío a toda la República.'

  if (category) {
    title = `Rebozos de ${category} — Rebozos Mary`
    description = `Descubre nuestra colección de rebozos ${category} tejidos a mano. Arte textil mexicano con envío a toda la República.`
  } else if (q) {
    title = `"${q}" — Rebozos Mary`
    description = `Resultados para "${q}" en nuestra colección de rebozos artesanales mexicanos.`
  }

  return { title, description }
}

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string
    category?: string
    sort?: string
    maxPrice?: string
    page?: string
  }>
}) {
  const params = await searchParams
  const q = params.q ?? ''
  const category = params.category ?? 'Todas'
  const sort = params.sort ?? 'relevancia'
  const maxPrice = Number(params.maxPrice ?? 5000)
  const page = Math.max(1, Number(params.page ?? 1))
  const limit = 12
  const payload = await getPayload({ config: await config })

  // ─── Construcción del filtro para Payload ────────────────────────────────
  // Fetch categorías dinámicas
  const { docs: allCategories } = await payload.find({
    collection: 'categories',
    limit: 100,
    sort: 'name',
  })

  // ─── Construcción del filtro para Payload ────────────────────────────────
  const where: Record<string, unknown> = {}

  if (category !== 'Todas') {
    const matched = allCategories.find((c) => c.name === category)
    if (matched) {
      where.category = { equals: matched.id }
    }
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
  const {
    docs: products,
    totalDocs,
    totalPages,
  } = await payload.find({
    collection: 'products',
    where,
    sort: payloadSort,
    depth: 1,
    limit,
    page,
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
        categories={['Todas', ...allCategories.map((c) => c.name)]}
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

        {totalPages > 1 && (
          <div className="pagination">
            {page > 1 && (
              <a
                href={`/catalog?${new URLSearchParams({ ...(params.q ? { q: params.q } : {}), ...(params.category && params.category !== 'Todas' ? { category: params.category } : {}), ...(params.sort && params.sort !== 'relevancia' ? { sort: params.sort } : {}), ...(params.maxPrice && Number(params.maxPrice) < 5000 ? { maxPrice: params.maxPrice } : {}), page: String(page - 1) }).toString()}`}
                className="pagination-btn"
              >
                ← Anterior
              </a>
            )}
            <span className="pagination-info">
              Página {page} de {totalPages} · {totalDocs} productos
            </span>
            {page < totalPages && (
              <a
                href={`/catalog?${new URLSearchParams({ ...(params.q ? { q: params.q } : {}), ...(params.category && params.category !== 'Todas' ? { category: params.category } : {}), ...(params.sort && params.sort !== 'relevancia' ? { sort: params.sort } : {}), ...(params.maxPrice && Number(params.maxPrice) < 5000 ? { maxPrice: params.maxPrice } : {}), page: String(page + 1) }).toString()}`}
                className="pagination-btn"
              >
                Siguiente →
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
