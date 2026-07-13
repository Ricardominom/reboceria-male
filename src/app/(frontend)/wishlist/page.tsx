'use client'

import { useWishlist } from '@/store/wishlist'
import { useCart } from '@/store/cart'
import Link from 'next/link'

export default function WishlistPage() {
  const { items, remove } = useWishlist()
  const addItem = useCart((s) => s.addItem)

  return (
    <div className="wishlist-page">
      <div className="wishlist-header">
        <h1 className="wishlist-title">Mis favoritos</h1>
        {items.length > 0 && (
          <p className="wishlist-count">
            {items.length} {items.length === 1 ? 'producto' : 'productos'}
          </p>
        )}
      </div>

      {items.length === 0 ? (
        <div className="wishlist-empty">
          <div className="wishlist-empty-icon">♡</div>
          <p>Aún no tienes favoritos guardados.</p>
          <Link href="/catalog" className="wishlist-cta">
            Explorar colección
          </Link>
        </div>
      ) : (
        <div className="wishlist-grid">
          {items.map((item) => (
            <div key={item.id} className="wishlist-card">
              <Link href={`/products/${item.slug}`} className="wishlist-card-img">
                {item.image ? (
                  <img src={item.image} alt={item.name} />
                ) : (
                  <div className="wishlist-card-placeholder">📷</div>
                )}
              </Link>
              <div className="wishlist-card-info">
                <Link href={`/products/${item.slug}`} className="wishlist-card-name">
                  {item.name}
                </Link>
                <p className="wishlist-card-price">
                  ${item.price.toLocaleString('es-MX')} <small>MXN</small>
                </p>
                <div className="wishlist-card-actions">
                  <button
                    className="wishlist-btn-add"
                    onClick={() => {
                      addItem({
                        id: item.id,
                        name: item.name,
                        short: item.name,
                        price: item.price,
                        color: '',
                        size: 'Único',
                        image: item.image,
                      })
                    }}
                  >
                    + Agregar al carrito
                  </button>
                  <button
                    className="wishlist-btn-remove"
                    aria-label="Quitar de favoritos"
                    onClick={() => remove(item.id)}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                        fill="currentColor"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
