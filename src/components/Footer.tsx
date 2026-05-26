import Link from 'next/link'

function Logo({ size = 32 }: { size?: number }) {
  const color = '#E8A0C8'
  const angles = [0, 60, 120, 180, 240, 300]

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <circle cx="50" cy="50" r="47" stroke={color} strokeWidth="3" fill="none" />
      <circle cx="50" cy="50" r="34" stroke={color} strokeWidth="1.5" fill="none" opacity="0.35" />
      <circle cx="50" cy="50" r="8" fill={color} opacity="0.85" />
      {angles.map((a) => (
        <line
          key={a}
          x1={50 + 10 * Math.cos((a * Math.PI) / 180)}
          y1={50 + 10 * Math.sin((a * Math.PI) / 180)}
          x2={50 + 32 * Math.cos((a * Math.PI) / 180)}
          y2={50 + 32 * Math.sin((a * Math.PI) / 180)}
          stroke={color}
          strokeWidth="1.5"
          opacity="0.45"
        />
      ))}
    </svg>
  )
}

const COLUMNS = [
  {
    title: 'Tienda',
    links: [
      { label: 'Colección', href: '/catalog' },
      { label: 'Novedades', href: '/catalog?sort=newest' },
      { label: 'Ofertas', href: '/catalog?tag=OFERTA' },
    ],
  },
  {
    title: 'Ayuda',
    links: [
      { label: 'Cómo comprar', href: '/' },
      { label: 'Envíos', href: '/' },
      { label: 'Devoluciones', href: '/' },
    ],
  },
  {
    title: 'Empresa',
    links: [
      { label: 'Nosotras', href: '/#historia' },
      { label: 'Contacto', href: '/#contacto' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        {/* Columna principal */}
        <div className="footer-brand">
          <div className="footer-logo">
            <Logo />
            <div>
              <p className="footer-brand-name">Rebozos Mary</p>
              <p className="footer-brand-tagline">ARTESANÍAS MEXICANAS</p>
            </div>
          </div>
          <p className="footer-description">
            Llevamos el arte textil mexicano a todo el mundo, apoyando directamente a las artesanas
            que mantienen viva esta tradición ancestral.
          </p>
          <div className="footer-social">
            {['Instagram', 'Facebook', 'TikTok'].map((s) => (
              <button key={s} className="footer-social-btn">
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Columnas de links */}
        {COLUMNS.map((col) => (
          <div key={col.title}>
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
      </div>

      <div className="footer-bottom">
        <span>© 2026 Rebozos Mary. Todos los derechos reservados.</span>
        <span>Hecho con ❤️ en México</span>
      </div>
    </footer>
  )
}
