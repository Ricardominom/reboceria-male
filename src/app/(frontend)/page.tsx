import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@/payload.config'
import type { Media } from '@/payload-types'
import ProductCard from '@/components/ProductCard'
import { toCardData } from '@/lib/products'
import AnimateIn from '@/components/AnimateIn'
import NewsletterForm from '@/components/NewsletterForm'
import ImageCarousel from '@/components/ImageCarousel'
import TestimonialsCarousel from '@/components/TestimonialsCarousel'

export default async function HomePage() {
  const payload = await getPayload({ config: await config })

  const { docs: mediaItems } = await payload.find({
    collection: 'media',
    limit: 18,
    sort: '-createdAt',
    depth: 0,
  })

  const mediaUrls = mediaItems
    .map((item) => item.url)
    .filter((url): url is string => typeof url === 'string')

  const { docs: featured } = await payload.find({
    collection: 'products',
    where: { featured: { equals: true } },
    depth: 1,
    limit: 5,
  })

  const homeSettings = await payload.findGlobal({ slug: 'home-settings', depth: 1 })

  const { docs: allCategories } = await payload.find({
    collection: 'categories',
    limit: 20,
    sort: 'name',
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

  const testimonialUrls = (homeSettings.testimonialImages ?? [])
    .map((item) =>
      typeof item.image === 'object' && item.image ? (item.image as Media).url : null,
    )
    .filter((url): url is string => typeof url === 'string')

  return (
    <div>
      {/* ── Hero editorial ── */}
      <section className="hero-editorial">
        <div className="hero-editorial-carousel">
          <ImageCarousel images={heroUrls} height="100%" alt="Rebozos Mary" />
        </div>

        <div className="hero-editorial-overlay" />

        <div className="hero-editorial-content">
          <h1 className="hero-editorial-title">
            Tradición que
            <br />
            <em>envuelve historias</em>
          </h1>
          <img src="/svg/ornamento-separador.svg" className="hero-ornament" alt="" />
          <p className="hero-editorial-desc">
            Rebozos tejidos a mano por artesanas mexicanas con técnicas ancestrales que pasan de
            generación en generación.
          </p>
          <div className="hero-editorial-actions">
            <Link href="/catalog" className="btn-primary-dark">
              Descubre la colección
            </Link>
            <Link href="/#historia" className="btn-outline-light">
              Nuestra historia
            </Link>
          </div>

          <div className="hero-benefits">
            {(
              [
                {
                  icon: '/svg/hecho-mano.svg',
                  title: 'Hecho a mano',
                  sub: 'por artesanas mexicanas',
                },
                { icon: '/svg/envio.svg', title: 'Envío gratis', sub: 'en compras +$800 MXN' },
                {
                  icon: '/svg/pago-seguro.svg',
                  title: 'Pago seguro',
                  sub: 'con tarjetas y transferencias',
                },
                { icon: '/svg/cambios.svg', title: 'Cambios fáciles', sub: 'sin complicaciones' },
              ] as const
            ).map((b) => (
              <div key={b.title} className="hero-benefit">
                <img src={b.icon} alt="" className="hero-benefit-icon" />
                <div>
                  <p className="hero-benefit-title">{b.title}</p>
                  <p className="hero-benefit-sub">{b.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categorías ── */}
      {allCategories.length > 0 && (
        <section className="section-categories" id="categorias">
          <div className="section-categories-header">
            <h2 className="section-categories-title">
              Explora nuestros
              <br />
              rebozos por tipo
            </h2>
            <img src="/svg/ornamento-separador.svg" className="hero-ornament" alt="" />
            <Link href="/catalog" className="link-ver-todos">
              Ver todos los tipos →
            </Link>
          </div>
          <div className="category-cards-row">
            {allCategories.map((cat) => {
              const img =
                typeof cat.image === 'object' && cat.image ? (cat.image as Media).url : null
              return (
                <Link key={cat.id} href={`/catalog?category=${cat.name}`} className="category-card">
                  {img ? (
                    <img src={img} alt={cat.name} className="category-card-img" />
                  ) : (
                    <div className="category-card-placeholder" />
                  )}
                  <div className="category-card-overlay" />
                  <div className="category-card-content">
                    <span className="category-card-name">{cat.name}</span>
                    {cat.description && (
                      <span className="category-card-desc">{cat.description}</span>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      )}

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
            <div className="products-grid products-grid--5">
              {featured.map((product) => (
                <ProductCard key={product.id} product={toCardData(product)} />
              ))}
            </div>
          )}
        </section>
      </AnimateIn>

      {/* ── Historia ── */}
      <section className="section-historia" id="historia">
        <div className="historia-image">
          {artisanUrls.length > 0 ? (
            <ImageCarousel images={artisanUrls} height="100%" alt="Artesana tejiendo un rebozo" />
          ) : (
            <div className="historia-img-placeholder" />
          )}
        </div>
        <div className="historia-content">
          <img
            src="/img/nuestra-historia.png"
            alt=""
            className="historia-ornamento"
            aria-hidden="true"
          />
          <p className="section-eyebrow">NUESTRA HISTORIA</p>
          <h2 className="historia-title">
            Hechos con paciencia,
            <br />
            dedicación y amor
          </h2>
          <img
            src="/svg/ornamento-separador.svg"
            alt=""
            className="historia-divisor"
            aria-hidden="true"
          />
          <p className="historia-text">
            Desde 1998 trabajamos de la mano con mujeres artesanas de diferentes regiones de México
            para preservar el arte del tejido ancestral y llevar su belleza al mundo.
          </p>
          <p className="historia-text">
            Cada rebozo cuenta una historia, hecha de tradición, paciencia y orgullo por nuestras
            raíces.
          </p>
          <Link href="/#historia" className="btn-historia">
            Conoce nuestra historia
          </Link>
        </div>
      </section>

      {/* ── Proceso artesanal ── */}
      <section className="section-proceso">
        <h2 className="section-proceso-title">Así es como elaboramos cada rebozo</h2>
        <div className="proceso-steps">
          {(
            [
              {
                icon: '/svg/seleccion-hilo.svg',
                num: '1',
                title: 'Selección del hilo',
                desc: 'Elegimos cuidadosamente los mejores materiales.',
              },
              {
                icon: '/svg/tenido-artesanal.svg',
                num: '2',
                title: 'Teñido artesanal',
                desc: 'Utilizamos tintes de calidad para colores duraderos.',
              },
              {
                icon: '/svg/tejido-mano.svg',
                num: '3',
                title: 'Tejido a mano',
                desc: 'Artesanas expertas tejen cada pieza con dedicación.',
              },
              {
                icon: '/svg/revision-calidad.svg',
                num: '4',
                title: 'Revisión de calidad',
                desc: 'Cada rebozo es revisado cuidadosamente.',
              },
              {
                icon: '/svg/envio-hogar.svg',
                num: '5',
                title: 'Envío a tu hogar',
                desc: 'Empaquetamos con cuidado para que llegue perfecto.',
              },
            ] as const
          ).map((step, i, arr) => (
            <div key={step.num} className="proceso-step-wrapper">
              <div className="proceso-step">
                <div className="proceso-step-icon">
                  <img src={step.icon} alt="" />
                </div>
                <p className="proceso-step-num">
                  {step.num}. {step.title}
                </p>
                <p className="proceso-step-desc">{step.desc}</p>
              </div>
              {i < arr.length - 1 && <span className="proceso-arrow">→</span>}
            </div>
          ))}
        </div>
      </section>

      {/* ── Testimonios ── */}
      <section className="section-testimonios">
        <TestimonialsCarousel />
        <div className="testimonios-images">
          {testimonialUrls.slice(0, 4).map((url, i) => (
            <img key={i} src={url} alt="" className="testimonios-img" />
          ))}
          {testimonialUrls.length === 0 && (
            <>
              <div className="testimonios-img-placeholder" />
              <div className="testimonios-img-placeholder" />
              <div className="testimonios-img-placeholder" />
              <div className="testimonios-img-placeholder" />
            </>
          )}
        </div>
      </section>

      {/* ── Valores de marca ── */}
      <section className="section-valores">
        {(
          [
            {
              icon: '/svg/revision-calidad.svg',
              title: 'Apoyas a comunidades',
              sub: 'y tradiciones mexicanas',
            },
            {
              icon: '/svg/disenos-unicos.svg',
              title: 'Diseños únicos',
              sub: 'piezas que cuentan historias',
            },
            {
              icon: '/svg/ediciones-limitadas.svg',
              title: 'Ediciones limitadas',
              sub: 'producción artesanal',
            },
            {
              icon: '/svg/calidad-perdura.svg',
              title: 'Calidad que perdura',
              sub: 'tejidos para toda la vida',
            },
          ] as const
        ).map((v) => (
          <div key={v.title} className="valor-item">
            <img src={v.icon} alt="" className="valor-icon" />
            <div>
              <p className="valor-title">{v.title}</p>
              <p className="valor-sub">{v.sub}</p>
            </div>
          </div>
        ))}
      </section>

      {/* ── Instagram ── */}
      <section className="section-instagram">
        <div className="instagram-header">
          <h2 className="section-instagram-title">Síguenos en Instagram</h2>
          <a
            href="https://instagram.com/rebozosmary"
            target="_blank"
            rel="noopener noreferrer"
            className="instagram-handle"
          >
            @rebozosmary
          </a>
        </div>
        <div className="instagram-grid">
          {mediaUrls.slice(0, 6).map((url, i) => (
            <div key={i} className="instagram-item">
              <img src={url} alt="" className="instagram-img" />
            </div>
          ))}
          {mediaUrls.length === 0 &&
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="instagram-item instagram-item--placeholder" />
            ))}
        </div>
      </section>

      {/* ── Newsletter ── */}
      <section className="section-newsletter">
        <div className="newsletter-icon">
          <svg
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <polyline points="2,4 12,13 22,4" />
          </svg>
        </div>{' '}
        <div className="newsletter-copy">
          <p className="newsletter-title">Recibe novedades, historias</p>
          <p className="newsletter-sub">y promociones especiales</p>
        </div>
        <NewsletterForm />
      </section>
    </div>
  )
}
