import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@/payload.config'
import type { Media } from '@/payload-types'
import ProductCard from '@/components/ProductCard'
import { toCardData } from '@/lib/products'
import ImageCarousel from '@/components/ImageCarousel'
import AnimateIn from '@/components/AnimateIn'

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

const GIFT_IDEAS = [
  {
    icon: '🌸',
    label: 'Para mamá',
    sub: 'Rebozos suaves y florales',
    bg: '#FDF0F7',
    color: '#C13584',
    slug: 'Algodón',
  },
  {
    icon: '💍',
    label: 'Para boda',
    sub: 'Seda y bordados elegantes',
    bg: '#EEF0FF',
    color: '#3949AB',
    slug: 'Seda',
  },
  {
    icon: '🎉',
    label: 'Para XV años',
    sub: 'Colores y bordados vibrantes',
    bg: '#FFF3E0',
    color: '#E65100',
    slug: 'Bordados',
  },
  {
    icon: '🌎',
    label: 'Para viajera',
    sub: 'Tejidos auténticos de México',
    bg: '#E8F5E9',
    color: '#2E7D32',
    slug: 'Telar',
  },
]

const HOW_TO_STEPS = [
  {
    icon: '🧣',
    step: '01',
    title: 'Como chal',
    desc: 'Envuélvelo sobre los hombros para calidez y estilo. Va con cualquier outfit, en cualquier ocasión.',
  },
  {
    icon: '👶',
    step: '02',
    title: 'Como cargador',
    desc: 'La técnica ancestral para cargar al bebé con seguridad y ternura, cerca del corazón.',
  },
  {
    icon: '👗',
    step: '03',
    title: 'Como accesorio',
    desc: 'Llévalo en la bolsa y úsalo de mil formas: falda, top, turbante o cinturón.',
  },
]

export default async function HomePage() {
  const payload = await getPayload({ config: await config })

  const { docs: featured } = await payload.find({
    collection: 'products',
    where: { featured: { equals: true } },
    depth: 1,
    limit: 4,
  })

  const homeSettings = await payload.findGlobal({ slug: 'home-settings', depth: 1 })

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
      <AnimateIn>
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
      </AnimateIn>

      {/* ── Productos destacados ── */}
      <AnimateIn>
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
      </AnimateIn>

      {/* ── El regalo perfecto ── */}
      <AnimateIn>
        <section className="section-gifts">
          <div className="section-gifts-header">
            <p className="section-eyebrow">PORQUE REGALAR ARTE VALE MÁS</p>
            <h2 className="section-title">El regalo perfecto</h2>
            <p className="section-gifts-desc">
              Un rebozo artesanal es un regalo que dura toda la vida. Elige la ocasión.
            </p>
          </div>
          <div className="gifts-grid">
            {GIFT_IDEAS.map((gift) => (
              <Link
                key={gift.slug}
                href={`/catalog?category=${gift.slug}`}
                className="gift-card"
                style={{ background: gift.bg }}
              >
                <span className="gift-icon">{gift.icon}</span>
                <span className="gift-label" style={{ color: gift.color }}>
                  {gift.label}
                </span>
                <span className="gift-sub">{gift.sub}</span>
              </Link>
            ))}
          </div>
        </section>
      </AnimateIn>

      {/* ── Artesana del mes ── */}
      <AnimateIn>
        <section className="section-artisan-month" id="artesana">
          <div className="artisan-month-inner">
            <div className="artisan-month-photo">
              <div className="artisan-month-photo-placeholder">🧵</div>
            </div>
            <div className="artisan-month-content">
              <p className="section-eyebrow">ARTESANA DEL MES</p>
              <h2 className="artisan-month-name">María de los Ángeles Cruz</h2>
              <p className="artisan-month-region">📍 Teotitlán del Valle, Oaxaca</p>
              <p className="artisan-month-bio">
                Con más de 35 años tejiendo en telar de cintura, María aprendió el oficio de su
                abuela. Cada pieza lleva horas de dedicación y diseños que narran la cosmogonía
                zapoteca. Su trabajo ha viajado a Japón, Europa y toda América Latina.
              </p>
              <div className="artisan-month-tags">
                <span>Telar de cintura</span>
                <span>Zapoteca</span>
                <span>Oaxaca</span>
              </div>
              <Link href="/catalog?category=Telar" className="btn-primary">
                Ver sus piezas →
              </Link>
            </div>
          </div>
        </section>
      </AnimateIn>

      {/* ── Banner artesanas ── */}
      <AnimateIn>
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
      </AnimateIn>

      {/* ── Cómo usar tu rebozo ── */}
      <AnimateIn>
        <section className="section-howto">
          <div className="section-howto-header">
            <p className="section-eyebrow section-eyebrow--light">VERSÁTIL Y ATEMPORAL</p>
            <h2 className="section-title section-title--light">¿Cómo usar tu rebozo?</h2>
          </div>
          <div className="howto-grid">
            {HOW_TO_STEPS.map((s) => (
              <div key={s.step} className="howto-card">
                <span className="howto-step">{s.step}</span>
                <span className="howto-icon">{s.icon}</span>
                <h3 className="howto-title">{s.title}</h3>
                <p className="howto-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </AnimateIn>

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
