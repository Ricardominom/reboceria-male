import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Aviso de Privacidad — Rebozos Mary',
  description: 'Consulta nuestro aviso de privacidad y cómo protegemos tus datos personales.',
}

export default function PrivacidadPage() {
  return (
    <div>
      <section className="contacto-hero">
        <p className="guia-eyebrow">LEGAL</p>
        <img src="/svg/ornamento-separador.svg" alt="" className="contacto-ornament" />
        <h1 className="contacto-hero-title">Aviso de Privacidad</h1>
        <p className="contacto-hero-desc">Rebozos Mary · Conforme a la LFPDPPP</p>
      </section>

      <div className="legal-content">
        <p className="legal-last-update">Última actualización: julio de 2026</p>

        <div className="legal-section">
          <h2>1. Responsable</h2>
          <p>
            Rebozos Mary (en adelante "la Tienda") es responsable del tratamiento de tus datos
            personales. Para cualquier consulta sobre este aviso puedes escribirnos a{' '}
            <Link href="/contacto">nuestra página de contacto</Link>.
          </p>
        </div>

        <div className="legal-section">
          <h2>2. Datos que recabamos</h2>
          <p>Para procesar tu pedido recabamos:</p>
          <ul>
            <li>Nombre completo</li>
            <li>Correo electrónico</li>
            <li>Número de teléfono</li>
            <li>Dirección de entrega</li>
            <li>Datos de pago (procesados directamente por Stripe — no los almacenamos)</li>
          </ul>
        </div>

        <div className="legal-section">
          <h2>3. Finalidades</h2>
          <p>Usamos tus datos para:</p>
          <ul>
            <li>Procesar y entregar tu pedido</li>
            <li>Enviarte confirmaciones de compra y actualizaciones de envío</li>
            <li>Atender tus consultas o reclamaciones</li>
            <li>Enviarte novedades y promociones (solo si te suscribes al newsletter)</li>
          </ul>
        </div>

        <div className="legal-section">
          <h2>4. Transferencia de datos</h2>
          <p>Compartimos tus datos únicamente con terceros necesarios para cumplir el servicio:</p>
          <ul>
            <li>
              <strong>Stripe</strong> — procesamiento de pagos con tarjeta y OXXO
            </li>
            <li>
              <strong>Paquetería</strong> — nombre y dirección para realizar la entrega
            </li>
            <li>
              <strong>Resend</strong> — plataforma de envío de correos transaccionales
            </li>
          </ul>
          <p>No vendemos ni compartimos tus datos con fines publicitarios de terceros.</p>
        </div>

        <div className="legal-section">
          <h2>5. Derechos ARCO</h2>
          <p>
            Tienes derecho a Acceder, Rectificar, Cancelar u Oponerte al tratamiento de tus datos
            personales (derechos ARCO). Para ejercerlos contáctanos a través de{' '}
            <Link href="/contacto">nuestra página de contacto</Link> indicando el derecho que deseas
            ejercer.
          </p>
        </div>

        <div className="legal-section">
          <h2>6. Autoridad competente</h2>
          <p>
            Si consideras que tu derecho a la protección de datos personales ha sido lesionado por
            alguna conducta u omisión de nuestra parte, puedes interponer una queja o denuncia ante
            el INAI. Para más información visita{' '}
            <a href="https://www.inai.org.mx" target="_blank" rel="noopener noreferrer">
              www.inai.org.mx
            </a>
            .
          </p>
        </div>

        <div className="legal-section">
          <h2>7. Cookies</h2>
          <p>
            Este sitio utiliza cookies técnicas esenciales para el funcionamiento del carrito de
            compras. No utilizamos cookies de rastreo publicitario de terceros.
          </p>
        </div>

        <div className="legal-section">
          <h2>8. Cambios a este aviso</h2>
          <p>
            Podemos actualizar este aviso en cualquier momento. La fecha de última actualización
            aparece al inicio de esta página.
          </p>
        </div>
      </div>
    </div>
  )
}
