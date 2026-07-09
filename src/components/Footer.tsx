import Link from 'next/link'
import Image from 'next/image'

const COLUMNS = [
  {
    title: 'Tienda',
    links: [
      { label: 'Colección', href: '/catalog' },
      { label: 'Guía de rebozo', href: '/#categorias' },
      { label: 'Más vendidos', href: '/catalog' },
      { label: 'Ofertas', href: '/catalog?tag=OFERTA' },
    ],
  },
  {
    title: 'Ayuda',
    links: [
      { label: 'Preguntas frecuentes', href: '/#contacto' },
      { label: 'Envíos', href: '/#contacto' },
      { label: 'Cambios y devoluciones', href: '/#contacto' },
      { label: 'Guía de cuidados', href: '/#contacto' },
      { label: 'Cómo usar tu rebozo', href: '/#contacto' },
    ],
  },
  {
    title: 'Nosotras',
    links: [
      { label: 'Nuestra historia', href: '/#historia' },
      { label: 'Artesanas', href: '/#historia' },
      { label: 'Contacto', href: '/#contacto' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        {/* Columna principal */}
        <div className="footer-brand-col">
          <div className="footer-logo">
            <Image src="/img/LOGO-REB-03.png" alt="Rebozos Mary" width={38} height={38} />
            <div>
              <p className="footer-brand-name">Rebozos Mary</p>
              <p className="footer-brand-tagline">ARTESANÍAS MEXICANAS</p>
            </div>
          </div>
          <p className="footer-description">
            Llevamos el arte textil mexicano al mundo, apoyando directamente a las artesanas que
            mantienen viva esta tradición ancestral.
          </p>
          <div className="footer-social">
            {/* Instagram */}
            <a
              href="https://instagram.com/rebozosmary"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-icon"
              aria-label="Instagram"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="4.5" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
              </svg>
            </a>
            {/* Facebook */}
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-icon"
              aria-label="Facebook"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
            {/* TikTok */}
            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-icon"
              aria-label="TikTok"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V9.05a8.16 8.16 0 0 0 4.77 1.52V7.13a4.85 4.85 0 0 1-1-.44z" />
              </svg>
            </a>
            {/* Pinterest */}
            <a
              href="https://pinterest.com"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-icon"
              aria-label="Pinterest"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12c0 4.24 2.65 7.86 6.39 9.29-.09-.78-.17-1.98.03-2.83.19-.77 1.27-5.38 1.27-5.38s-.32-.65-.32-1.61c0-1.51.88-2.63 1.96-2.63.93 0 1.38.7 1.38 1.53 0 .93-.59 2.33-.9 3.62-.26 1.08.53 1.96 1.59 1.96 1.9 0 3.17-2.44 3.17-5.33 0-2.2-1.48-3.85-4.16-3.85-3.04 0-4.93 2.27-4.93 4.8 0 .87.25 1.48.65 1.96.18.21.21.3.14.54-.05.17-.16.58-.2.74-.06.24-.25.33-.46.24-1.31-.54-1.92-1.98-1.92-3.6 0-2.67 2.25-5.88 6.73-5.88 3.61 0 5.99 2.62 5.99 5.43 0 3.72-2.07 6.51-5.11 6.51-1.02 0-1.99-.55-2.32-1.17l-.63 2.45c-.23.88-.85 1.97-1.27 2.64.96.3 1.97.46 3.02.46 5.52 0 10-4.48 10-10S17.52 2 12 2z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Columnas de links */}
        {COLUMNS.map((col) => (
          <div key={col.title} className="footer-col">
            <p className="footer-col-title">{col.title.toUpperCase()}</p>
            <ul className="footer-links">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="footer-link">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Pago seguro */}
        <div className="footer-col">
          <p className="footer-col-title">PAGO SEGURO</p>
          <div className="footer-payments">
            <span className="footer-payment-badge">
              <img
                src="/img/visa-logo.png"
                alt="Visa"
                height="15"
                style={{ borderRadius: '4px' }}
              />
            </span>
            <span className="footer-payment-badge">
              <img
                src="/img/mastercard-logo.png"
                alt="Mastercard"
                height="15"
                style={{ borderRadius: '4px' }}
              />
            </span>
            <span className="footer-payment-badge">
              <img
                src="/img/paypal-logo.png"
                alt="PayPal"
                height="15"
                style={{ borderRadius: '4px' }}
              />
            </span>
            <span className="footer-payment-badge">
              <img
                src="/img/oxxo-logo.png"
                alt="OXXO"
                height="15"
                style={{ borderRadius: '4px' }}
              />
            </span>
          </div>
          <p className="footer-secure">
            Sitio 100% seguro
            <br />
            Tus datos están protegidos
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2026 Rebozos Mary. Todos los derechos reservados.</span>
        <span>Hecho con amor en México</span>
      </div>
    </footer>
  )
}
