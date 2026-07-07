'use client'

import { useRouter, useSearchParams } from 'next/navigation'

const SORT_OPTIONS = [
  { value: 'relevancia', label: 'Relevancia' },
  { value: 'precio-asc', label: 'Precio: menor a mayor' },
  { value: 'precio-desc', label: 'Precio: mayor a menor' },
  { value: 'rating', label: 'Mejor calificados' },
]

interface Props {
  currentCategory: string
  currentSort: string
  currentMaxPrice: number
  searchQuery: string
  categories: string[]
}

export default function CatalogFilters({
  currentCategory,
  currentSort,
  currentMaxPrice,
  searchQuery,
  categories,
}: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value === '' || value === 'Todas' || value === 'relevancia') {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    router.push(`/catalog?${params.toString()}`)
  }

  return (
    <aside className="catalog-sidebar">
      {/* Búsqueda activa */}
      {searchQuery && (
        <div className="filter-group">
          <p className="filter-label">BÚSQUEDA</p>
          <div className="search-active">
            <span>"{searchQuery}"</span>
            <button onClick={() => updateParam('q', '')}>✕ Limpiar</button>
          </div>
        </div>
      )}

      {/* Categorías */}
      <div className="filter-group">
        <p className="filter-label">CATEGORÍA</p>
        <div className="filter-options">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => updateParam('category', cat)}
              className={`filter-option ${currentCategory === cat ? 'filter-option--active' : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Precio máximo */}
      <div className="filter-group">
        <p className="filter-label">PRECIO MÁXIMO</p>
        <input
          type="range"
          min={500}
          max={5000}
          step={100}
          defaultValue={currentMaxPrice}
          onPointerUp={(e) => updateParam('maxPrice', e.currentTarget.value)}
          className="price-slider"
        />
        <div className="price-range-labels">
          <span>$500</span>
          <span className="price-max">${currentMaxPrice.toLocaleString('es-MX')}</span>
        </div>
      </div>

      {/* Ordenar */}
      <div className="filter-group">
        <p className="filter-label">ORDENAR POR</p>
        <div className="filter-options">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => updateParam('sort', opt.value)}
              className={`filter-option ${currentSort === opt.value ? 'filter-option--active' : ''}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </aside>
  )
}
