import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@/payload.config'
import type { Media } from '@/payload-types'
import ProductCard from '@/components/ProductCard'
import { toCardData } from '@/lib/products'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

function CaractSvg({ icon }: { icon: string }) {
  return <img src={`/svg/caracteristicas/${icon}.svg`} alt="" className="tipo-caract-svg" />
}

// ── Metadata ──────────────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayload({ config: await config })

  const { docs: categories } = await payload.find({
    collection: 'categories',
    limit: 100,
    depth: 0,
  })
  const category = categories.find((c) => toSlug(c.name) === slug)
  if (!category) return { title: 'Rebozos Mary' }

  const guiaSettings = await payload.findGlobal({ slug: 'guia-settings', depth: 1 })
  const tipoData = (guiaSettings.tipos ?? []).find((t: any) => {
    const cat = typeof t.category === 'object' ? t.category : null
    return cat && toSlug(cat.name) === slug
  })

  return {
    title: `Rebozo de ${category.name} — Guía de Rebozos Mary`,
    description:
      tipoData?.description ?? `Descubre los rebozos de ${category.name} de Rebozos Mary.`,
  }
}

// ── Página ────────────────────────────────────────────────────────────────────
export default async function TipoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payload = await getPayload({ config: await config })

  const [{ docs: categories }, guiaSettings] = await Promise.all([
    payload.find({ collection: 'categories', limit: 100, depth: 1 }),
    payload.findGlobal({ slug: 'guia-settings', depth: 2 }),
  ])

  const category = categories.find((c) => toSlug(c.name) === slug)
  if (!category) notFound()

  const tipoData = (guiaSettings.tipos ?? []).find((t: any) => {
    const cat = typeof t.category === 'object' ? t.category : null
    return cat && toSlug(cat.name) === slug
  })
  if (!tipoData) notFound()

  const { docs: products } = await payload.find({
    collection: 'products',
    where: { category: { equals: category.id } },
    depth: 1,
    limit: 4,
  })

  const heroImg =
    typeof category.guiaImage === 'object' && category.guiaImage
      ? ((category.guiaImage as Media).url ?? null)
      : null

  const howToUseImgs = (tipoData.howToUseImages ?? [])
    .map((item: any) =>
      typeof item.image === 'object' && item.image ? (item.image as Media).url : null,
    )
    .filter((url: unknown): url is string => typeof url === 'string')

  const caracteristicas: { icon: string; title: string; desc: string }[] =
    tipoData.caracteristicas ?? []

  return (
    <div className="tipo-page">
      {/* ── Hero ── */}
      <section className="tipo-hero">
        <div className="tipo-hero-content">
          <nav className="tipo-breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Inicio</Link>
            <span>/</span>
            <Link href="/guia">Guía de Rebozos</Link>
            <span>/</span>
            <span>{category.name}</span>
          </nav>
          <img src="/svg/ornamento-separador.svg" className="tipo-ornament" alt="" />
          <h1 className="tipo-hero-title">{category.name}</h1>
          <div className="tipo-hero-divider" />
          {tipoData.subtitle && <p className="tipo-hero-subtitle">{tipoData.subtitle}</p>}
          {tipoData.description && <p className="tipo-hero-desc">{tipoData.description}</p>}
          <Link href={`/catalog?category=${category.name}`} className="tipo-hero-btn">
            Ver productos de {category.name} →
          </Link>
        </div>
        <div className="tipo-hero-image">
          {heroImg ? (
            <img src={heroImg} alt={category.name} className="tipo-hero-img" />
          ) : (
            <div className="tipo-hero-img-placeholder" />
          )}
          <div className="tipo-hero-overlay" />
        </div>
      </section>

      {/* ── Origen + Características ── */}
      <section className="tipo-origen">
        <div className="tipo-origen-container">
          <div className="tipo-origen-left">
            <h2 className="tipo-section-title">Origen</h2>
            <div className="tipo-section-divider" />
            {tipoData.originText && <p className="tipo-origen-text">{tipoData.originText}</p>}
            <div className="tipo-origen-badge">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#8B1E3F"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <div>
                <p className="tipo-badge-title">Hecho en México</p>
                <p className="tipo-badge-sub">con orgullo artesanal</p>
              </div>
            </div>
          </div>
          <div className="tipo-origen-right">
            <h2 className="tipo-section-title">Características</h2>
            <div className="tipo-section-divider" />
            <div className="tipo-caract-grid">
              {caracteristicas.map((c, i) => (
                <div key={i} className="tipo-caract-item">
                  <div className="tipo-caract-icon">
                    <CaractSvg icon={c.icon} />
                  </div>
                  <p className="tipo-caract-name">{c.title}</p>
                  <p className="tipo-caract-desc">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Cómo usarlo ── */}
      <section className="tipo-uso">
        <div className="tipo-uso-container">
          <div className="tipo-uso-text">
            <h2 className="tipo-section-title">Cómo usarlo</h2>
            <div className="tipo-section-divider" />
            {tipoData.howToUseText && <p className="tipo-uso-desc">{tipoData.howToUseText}</p>}
            <Link href={`/catalog?category=${category.name}`} className="tipo-uso-link">
              Ver ideas y estilos →
            </Link>
          </div>
          <div className="tipo-uso-gallery">
            {howToUseImgs.length > 0
              ? howToUseImgs
                  .slice(0, 3)
                  .map((url, i) => <img key={i} src={url} alt="" className="tipo-uso-img" />)
              : Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="tipo-uso-img-placeholder" />
                ))}
          </div>
        </div>
      </section>

      {/* ── Productos ── */}
      <section className="tipo-productos">
        <div className="tipo-productos-header">
          <div>
            <h2 className="tipo-section-title">Productos de {category.name}</h2>
            <p className="tipo-productos-sub">
              Piezas únicas tejidas a mano por artesanas mexicanas.
            </p>
          </div>
          <Link href={`/catalog?category=${category.name}`} className="tipo-productos-link">
            Ver todos los productos →
          </Link>
        </div>
        {products.length > 0 ? (
          <div className="tipo-productos-grid">
            {products.map((p) => (
              <ProductCard key={p.id} product={toCardData(p)} />
            ))}
          </div>
        ) : (
          <p className="tipo-productos-empty">Próximamente productos de {category.name}.</p>
        )}
      </section>
    </div>
  )
}
