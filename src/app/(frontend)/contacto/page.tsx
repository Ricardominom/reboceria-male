import { getPayload } from 'payload'
import config from '@/payload.config'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Contacto — Rebozos Mary',
  description:
    'Contáctanos por WhatsApp, correo o teléfono. Estamos aquí para ayudarte con tu compra.',
}

export const dynamic = 'force-dynamic'

export default async function ContactoPage() {
  const payload = await getPayload({ config: await config })
  const storeSettings = await payload.findGlobal({ slug: 'store-settings', depth: 0 })

  return (
    <div className="contacto-page">
      {/* ── Hero ── */}
      <section className="contacto-hero">
        <p className="guia-eyebrow">CONTACTO</p>
        <img src="/svg/ornamento-separador.svg" alt="" className="contacto-ornament" />
        <h1 className="contacto-hero-title">¿Tienes alguna pregunta?</h1>
        <p className="contacto-hero-desc">
          Estamos aquí para ayudarte. Contáctanos y te respondemos a la brevedad.
        </p>
      </section>

      {/* ── Tarjetas ── */}
      <section className="contacto-cards-section">
        <div className="contacto-cards-grid">
          {storeSettings.whatsapp && (
            <a
              href={`https://wa.me/${storeSettings.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="contacto-card contacto-card--whatsapp"
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.554 4.104 1.523 5.83L.057 23.882a.5.5 0 0 0 .606.634l6.288-1.643A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 0 1-5.019-1.378l-.36-.214-3.732.977.995-3.64-.235-.374A9.818 9.818 0 1 1 12 21.818z" />
              </svg>
              <div>
                <p className="contacto-card-title">WhatsApp</p>
                <p className="contacto-card-sub">Respuesta rápida · Escríbenos ahora</p>
              </div>
            </a>
          )}

          {storeSettings.contactEmail && (
            <a href={`mailto:${storeSettings.contactEmail}`} className="contacto-card">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <polyline points="2,4 12,13 22,4" />
              </svg>
              <div>
                <p className="contacto-card-title">Correo electrónico</p>
                <p className="contacto-card-sub">{storeSettings.contactEmail}</p>
              </div>
            </a>
          )}

          {storeSettings.phone && (
            <a href={`tel:${storeSettings.phone}`} className="contacto-card">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.77a16 16 0 0 0 6.29 6.29l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <div>
                <p className="contacto-card-title">Teléfono</p>
                <p className="contacto-card-sub">{storeSettings.phone}</p>
              </div>
            </a>
          )}

          {storeSettings.businessHours && (
            <div className="contacto-card contacto-card--info">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <div>
                <p className="contacto-card-title">Horario de atención</p>
                <p className="contacto-card-sub" style={{ whiteSpace: 'pre-line' }}>
                  {storeSettings.businessHours}
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── Cierre ── */}
      <section className="contacto-closing">
        <p className="contacto-closing-quote">
          "Cada rebozo tiene su historia.
          <br />
          Cuéntanos la tuya."
        </p>
        <Link href="/catalog" className="contacto-closing-link">
          Ver toda la colección →
        </Link>
      </section>
    </div>
  )
}
