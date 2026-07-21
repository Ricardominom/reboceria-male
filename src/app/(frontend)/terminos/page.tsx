import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Términos y Condiciones — Rebozos Mary',
  description: 'Consulta los términos y condiciones de compra en Rebozos Mary.',
}

export default function TerminosPage() {
  return (
    <div>
      <section className="contacto-hero">
        <p className="guia-eyebrow">LEGAL</p>
        <img src="/svg/ornamento-separador.svg" alt="" className="contacto-ornament" />
        <h1 className="contacto-hero-title">Términos y Condiciones</h1>
        <p className="contacto-hero-desc">Al realizar una compra aceptas estos términos</p>
      </section>

      <div className="legal-content">
        <p className="legal-last-update">Última actualización: julio de 2026</p>

        <div className="legal-section">
          <h2>1. Aceptación</h2>
          <p>
            Al navegar o realizar una compra en este sitio, aceptas estos Términos y Condiciones en
            su totalidad. Si no estás de acuerdo, te pedimos no utilizar el sitio.
          </p>
        </div>

        <div className="legal-section">
          <h2>2. Productos</h2>
          <p>
            Todos nuestros rebozos son elaborados a mano por artesanas mexicanas. Por su naturaleza
            artesanal, pueden existir pequeñas variaciones en color, textura o dimensiones respecto
            a las imágenes — esto forma parte de la autenticidad de cada pieza y no constituye un
            defecto.
          </p>
          <p>
            Las imágenes son referenciales; los colores pueden variar ligeramente según la
            calibración de tu pantalla.
          </p>
        </div>

        <div className="legal-section">
          <h2>3. Precios y pagos</h2>
          <ul>
            <li>Todos los precios están expresados en pesos mexicanos (MXN) con IVA incluido.</li>
            <li>Aceptamos tarjeta de crédito/débito, pago en OXXO y transferencia bancaria.</li>
            <li>
              Los pagos con tarjeta y OXXO son procesados por Stripe bajo los más altos estándares
              de seguridad (PCI DSS).
            </li>
            <li>
              El voucher de OXXO tiene vigencia de 48 horas; vencido ese plazo el pedido se cancela
              automáticamente.
            </li>
          </ul>
        </div>

        <div className="legal-section">
          <h2>4. Envíos</h2>
          <ul>
            <li>Enviamos a toda la República Mexicana.</li>
            <li>
              <strong>Envío estándar:</strong> 3–5 días hábiles tras confirmar el pago. Gratis en
              pedidos mayores a $800 MXN; $150 MXN en pedidos menores.
            </li>
            <li>
              <strong>Envío express:</strong> 1–2 días hábiles. Disponible como opción durante el
              proceso de compra; el costo se muestra antes de confirmar el pago.
            </li>
            <li>Recibirás un correo con tu número de rastreo una vez que tu pedido sea enviado.</li>
          </ul>
        </div>

        <div className="legal-section">
          <h2>5. Cambios y devoluciones</h2>
          <p>
            Tienes hasta 15 días naturales desde la entrega para solicitar un cambio o devolución.
            Consulta todos los detalles en nuestra{' '}
            <Link href="/devoluciones">Política de Cambios y Devoluciones</Link>.
          </p>
        </div>

        <div className="legal-section">
          <h2>6. Cancelaciones</h2>
          <p>
            Puedes solicitar cancelar tu pedido dentro de las primeras 2 horas después de realizada
            la compra, siempre que no haya sido enviado aún. Contáctanos de inmediato por{' '}
            <Link href="/contacto">WhatsApp o correo</Link>.
          </p>
        </div>

        <div className="legal-section">
          <h2>7. Limitación de responsabilidad</h2>
          <p>
            Rebozos Mary no se hace responsable por retrasos ocasionados por la paquetería, casos de
            fuerza mayor, ni por el uso que el cliente dé al producto.
          </p>
        </div>

        <div className="legal-section">
          <h2>8. Legislación aplicable</h2>
          <p>
            Estos términos se rigen por las leyes de los Estados Unidos Mexicanos, en particular la
            Ley Federal de Protección al Consumidor (LFPC).
          </p>
        </div>
      </div>
    </div>
  )
}
