import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@/payload.config'
import type { Media } from '@/payload-types'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Guía de Rebozos — Rebozos Mary',
  description:
    'Un viaje por el mundo de los rebozos artesanales mexicanos. Descubre los diferentes tipos de rebozos.',
}

const TIPOS = [
  {
    num: '01',
    name: 'Artisela',
    tagline: 'Ligero como el viento, elegante en cada ocasión.',
    desc: 'Suave, fresco y delicado. Ideal para climas cálidos y para quienes buscan un rebozo ligero para el día a día.',
  },
  {
    num: '02',
    name: 'Algodón',
    tagline: 'Natural, resistente y versátil.',
    desc: 'El algodón es un clásico que acompaña tu día a día. Cómodo, duradero y fácil de cuidar.',
  },
  {
    num: '03',
    name: 'Seda',
    tagline: 'Elegancia que se siente, lujo que se ve.',
    desc: 'Brillante, ligera y sofisticada. Perfecta para ocasiones especiales y para elevar cualquier look.',
  },
  {
    num: '04',
    name: 'Estambre',
    tagline: 'Calidez y suavidad en cada hilo.',
    desc: 'Ideal para climas fríos. Su textura brinda abrigo y confort sin perder la belleza artesanal.',
  },
  {
    num: '05',
    name: 'Ceñidor',
    tagline: 'Tradición que envuelve y da forma.',
    desc: 'Tejido de cintura tradicional, fuerte y con gran simbolismo en nuestra cultura.',
  },
  {
    num: '06',
    name: 'Chal',
    tagline: 'El complemento perfecto para cualquier estilo.',
    desc: 'Versátil y atemporal. Úsalo de diferentes maneras y transforma tu look.',
  },
]

const RATINGS: Record<string, number[]> = {
  // [ligero, fresco, elegante, uso diario, climas fríos, ocasiones especiales]
  Artisela: [5, 5, 3, 4, 1, 3],
  Algodón: [4, 4, 3, 5, 2, 3],
  Seda: [4, 2, 5, 2, 1, 5],
  Estambre: [2, 1, 3, 4, 5, 3],
  Ceñidor: [3, 3, 4, 4, 2, 3],
  Chal: [4, 3, 4, 5, 3, 4],
}

function Stars({ count, max = 5 }: { count: number; max?: number }) {
  return (
    <span className="guia-stars">
      {Array.from({ length: max }).map((_, i) => (
        <span key={i} className={i < count ? 'guia-star guia-star--filled' : 'guia-star'}>
          ★
        </span>
      ))}
    </span>
  )
}

export default async function GuiaPage() {
  const payload = await getPayload({ config: await config })

  const { docs: categories } = await payload.find({
    collection: 'categories',
    limit: 20,
    sort: 'name',
    depth: 1,
  })

  const homeSettings = await payload.findGlobal({ slug: 'home-settings', depth: 1 })

  const guiaHeroImage =
    typeof homeSettings.guiaHeroImage === 'object' && homeSettings.guiaHeroImage
      ? ((homeSettings.guiaHeroImage as Media).url ?? null)
      : null

  const artisanImg =
    guiaHeroImage ??
    (homeSettings.artisanImages ?? [])
      .map((item) =>
        typeof item.image === 'object' && item.image ? (item.image as Media).url : null,
      )
      .filter((url): url is string => typeof url === 'string')[0] ??
    null

  const guiaCtaImg =
    typeof homeSettings.guiaCtaImage === 'object' && homeSettings.guiaCtaImage
      ? ((homeSettings.guiaCtaImage as Media).url ?? null)
      : artisanImg

  const getCategoryImage = (name: string): string | null => {
    const cat = categories.find((c) => c.name.toLowerCase() === name.toLowerCase())
    if (!cat) return null
    const guia =
      typeof cat.guiaImage === 'object' && cat.guiaImage ? (cat.guiaImage as Media).url : null
    const fallback = typeof cat.image === 'object' && cat.image ? (cat.image as Media).url : null
    return guia ?? fallback ?? null
  }

  return (
    <div className="guia-page">
      {/* ── Hero ── */}
      <section className="guia-hero">
        <div className="guia-hero-content">
          <p className="guia-eyebrow">GUÍA DE REBOZOS</p>
          <img src="/svg/ornamento-separador.svg" className="guia-ornament" alt="" />
          <h1 className="guia-hero-title">
            Un viaje por el
            <br />
            mundo de los rebozos
          </h1>
          <p className="guia-hero-desc">
            Cada hilo cuenta una historia. Descubre los tejidos que durante generaciones han dado
            vida a nuestros rebozos artesanales.
          </p>
          <a href="#recorrido" className="guia-btn">
            Comenzar el recorrido →
          </a>
        </div>
        <div className="guia-hero-image">
          {artisanImg ? (
            <img src={artisanImg} alt="Artesana tejiendo un rebozo" className="guia-hero-img" />
          ) : (
            <div className="guia-hero-img-placeholder" />
          )}
          <div className="guia-hero-overlay" />
        </div>
      </section>

      {/* ── Beneficios ── */}
      <section className="guia-benefits">
        {[
          { icon: '/svg/hecho-mano.svg', title: 'Hecho a mano', sub: 'por artesanas mexicanas' },
          {
            icon: '/svg/seleccion-hilo.svg',
            title: 'Materiales naturales',
            sub: 'de la más alta calidad',
          },
          {
            icon: '/svg/tejido-mano.svg',
            title: 'Tradición que perdura',
            sub: 'de generación en generación',
          },
          { icon: '/svg/envio.svg', title: 'Envío gratis', sub: 'en compras +$800 MXN' },
        ].map((b) => (
          <div key={b.title} className="guia-benefit">
            <img src={b.icon} alt="" className="guia-benefit-icon" />
            <div>
              <p className="guia-benefit-title">{b.title}</p>
              <p className="guia-benefit-sub">{b.sub}</p>
            </div>
          </div>
        ))}
      </section>
      {/* ── Recorrido por tipos ── */}
      <section className="guia-recorrido" id="recorrido">
        {TIPOS.map((tipo, i) => {
          const img = getCategoryImage(tipo.name)
          const isInverted = i % 2 !== 0
          return (
            <div key={tipo.num} className={`guia-tipo${isInverted ? ' guia-tipo--invertido' : ''}`}>
              <div className="guia-tipo-text">
                <p className="guia-tipo-num">{tipo.num}</p>
                <h2 className="guia-tipo-name">{tipo.name}</h2>
                <p className="guia-tipo-tagline">{tipo.tagline}</p>
                <p className="guia-tipo-desc">{tipo.desc}</p>
                <Link href={`/catalog?category=${tipo.name}`} className="guia-tipo-link">
                  Descubrir {tipo.name} →
                </Link>
              </div>
              <div className="guia-tipo-image">
                {img ? (
                  <img src={img} alt={tipo.name} className="guia-tipo-img" />
                ) : (
                  <div className="guia-tipo-img-placeholder" />
                )}
              </div>
            </div>
          )
        })}
      </section>

      {/* ── Comparador ── */}
      <section className="guia-comparador">
        <h2 className="guia-comparador-title">¿Cuál rebozo es ideal para ti?</h2>
        <img src="/svg/ornamento-separador.svg" className="guia-ornament" alt="" />
        <div className="guia-table-wrap">
          <table className="guia-table">
            <thead>
              <tr>
                <th></th>
                <th>Ligero</th>
                <th>Fresco</th>
                <th>Elegante</th>
                <th>Uso diario</th>
                <th>Climas fríos</th>
                <th>Ocasiones especiales</th>
              </tr>
            </thead>
            <tbody>
              {TIPOS.map((tipo) => {
                const r = RATINGS[tipo.name] ?? [0, 0, 0, 0, 0, 0]
                return (
                  <tr key={tipo.name}>
                    <td className="guia-table-name">{tipo.name}</td>
                    {r.map((v, idx) => (
                      <td key={idx}>
                        <Stars count={v} />
                      </td>
                    ))}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── CTA final ── */}
      <section className="guia-cta">
        <div className="guia-cta-content">
          <h2 className="guia-cta-title">¿Ya encontraste el tejido ideal?</h2>
          <p className="guia-cta-desc">
            Explora nuestra colección completa y encuentra el rebozo perfecto para ti.
          </p>
          <Link href="/catalog" className="guia-btn">
            Ver todos los rebozos →
          </Link>
        </div>
        <div className="guia-cta-image">
          {guiaCtaImg ? (
            <img src={guiaCtaImg} alt="" className="guia-cta-img" />
          ) : (
            <div className="guia-cta-img-placeholder" />
          )}
        </div>
      </section>
    </div>
  )
}
