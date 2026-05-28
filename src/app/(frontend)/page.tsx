import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@/payload.config'
import type { Product, Media } from '@/payload-types'
import ProductCard from '@/components/ProductCard'
import type { ProductCardData } from '@/types'
import { toCardData } from '@/lib/products'
import ImageCarousel from '@/components/ImageCarousel'

// ─── Datos estáticos ──────────────────────────────────────────────────────────
const CATEGORIES = [
  { label: 'Telar de cintura', slug: 'Telar', color: '#F8D7EA', text: '#C13584', icon: '🧵' },
  { label: 'Seda pura', slug: 'Seda', color: '#E8EAF6', text: '#3949AB', icon: '🌸' },
  { label: 'Bordados', slug: 'Bordados', color: '#FFF3E0', text: '#E65100', icon: '🌺' },
  { label: 'Algodón natural', slug: 'Algodón', color: '#E8F5E9', text: '#2E7D32', icon: '🌿' },
  { label: 'Lana', slug: 'Lana', color: '#FCE4EC', text: '#AD1457', icon: '✨' },
]

const TRUST_ITEMS = [
  { icon: '🚚', title: 'Envío gratis', sub: 'En compras +$800 MXN' },
  { icon: '🔒', title: 'Pago seguro', sub: 'Tarjeta, OXXO, transferencia' },
  { icon: '↩️', title: 'Devoluciones', sub: '30 días sin preguntas' },
  { icon: '🌿', title: 'Comercio justo', sub: 'Precio directo a la artesana' },
]

// ─── Página ───────────────────────────────────────────────────────────────────
export default async function HomePage() {
  const payload = await getPayload({ config: await config })

  const { docs: featured } = await payload.find({
    collection: 'products',
    where: { featured: { equals: true } },
    depth: 1,
    limit: 4,
  })

  const homeSettings = await payload.findGlobal({
    slug: 'home-settings',
    depth: 1,
  })

  const heroUrls = (homeSettings.heroImages ?? [])
    .map((item) =>
      typeof item.image === 'object' && item.image ? (item.image as Media).url : null,
    )
    .filter((url): url is string => typeof url === 'string')

  const artisanUrls = (homeSettings.artisanImages ?? [])
    .map((item) =>
      typeof item.image === 'object' && item.image ? (item.image as Media).url : null,
    )
    .filter((url): url is string => typeof url === 'string')
  return (
    <div>
      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-image">
          {heroUrls.length > 0 ? (
            <ImageCarousel images={heroUrls} height={480} alt="Rebozos Mary" />
          ) : (
            <div className="hero-placeholder">
              📷<span>Fotografía principal</span>
            </div>
          )}
        </div>

        <div className="hero-content">
          <div className="hero-badge">✨ NUEVA COLECCIÓN 2026</div>

          <h1 className="hero-title">
            Rebozos que
            <br />
            <em>cuentan historias</em>
          </h1>

          <p className="hero-description">
            Tejidos a mano por artesanas mexicanas. Cada rebozo es una pieza única llena de cultura,
            arte y tradición ancestral.
          </p>

          <div className="hero-actions">
            <Link href="/catalog" className="btn-primary">
              Ver colección →
            </Link>
            <Link href="/#historia" className="btn-outline">
              Nuestra historia
            </Link>
          </div>

          <div className="hero-stats">
            {[
              ['50+', 'Artesanas'],
              ['12', 'Regiones'],
              ['1998', 'Desde'],
            ].map(([n, l]) => (
              <div key={l} className="hero-stat">
                <span className="hero-stat-number">{n}</span>
                <span className="hero-stat-label">{l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categorías ── */}
      <section className="section-categories">
        <h2 className="section-title">Explora por tipo</h2>
        <div className="categories-list">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/catalog?category=${cat.slug}`}
              className="category-chip"
              style={{ background: cat.color, color: cat.text }}
            >
              {cat.icon} {cat.label}
            </Link>
          ))}
        </div>
      </section>

      {/* ── Productos destacados ── */}
      <section className="section-featured">
        <div className="section-header">
          <h2 className="section-title">Más vendidos</h2>
          <Link href="/catalog" className="link-ver-todos">
            Ver todos →
          </Link>
        </div>

        {featured.length === 0 ? (
          <p className="empty-state">Aún no hay productos destacados. Márcalos en el admin.</p>
        ) : (
          <div className="products-grid products-grid--4">
            {featured.map((product) => (
              <ProductCard key={product.id} product={toCardData(product)} />
            ))}
          </div>
        )}
      </section>

      {/* ── Banner artesanas ── */}
      <section className="artisan-banner" id="historia">
        <div className="artisan-banner-image">
          {artisanUrls.length > 0 ? (
            <ImageCarousel images={artisanUrls} height={220} alt="Artesana tejiendo" />
          ) : (
            <div className="hero-placeholder">
              📷<span>Artesana tejiendo</span>
            </div>
          )}
        </div>
        <div className="artisan-banner-content">
          <p className="artisan-banner-label">NUESTRA HISTORIA</p>
          <blockquote className="artisan-banner-quote">
            "Cada hilo lleva el amor y el conocimiento de mujeres que aprendieron a tejer de sus
            madres y sus abuelas."
          </blockquote>
          <Link href="/#historia" className="btn-white">
            Conoce nuestra historia →
          </Link>
        </div>
      </section>

      {/* ── Trust bar ── */}
      <section className="trust-bar">
        {TRUST_ITEMS.map((item) => (
          <div key={item.title} className="trust-item">
            <span className="trust-icon">{item.icon}</span>
            <div>
              <p className="trust-title">{item.title}</p>
              <p className="trust-sub">{item.sub}</p>
            </div>
          </div>
        ))}
      </section>
    </div>
  )
}
