import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Cambios y Devoluciones — Rebozos Mary',
  description: 'Conoce nuestra política de cambios y devoluciones.',
}

export default function DevolucionesPage() {
  return (
    <div>
      <section className="contacto-hero">
        <p className="guia-eyebrow">LEGAL</p>
        <img src="/svg/ornamento-separador.svg" alt="" className="contacto-ornament" />
        <h1 className="contacto-hero-title">Cambios y Devoluciones</h1>
        <p className="contacto-hero-desc">Tu satisfacción es lo más importante para nosotras</p>
      </section>

      <div className="legal-content">
        <p className="legal-last-update">Última actualización: julio de 2026</p>

        <div className="legal-section">
          <h2>1. Plazo para solicitudes</h2>
          <p>
            Tienes hasta <strong>15 días naturales</strong> a partir de la fecha de entrega para
            reportar cualquier problema con tu pedido. Pasado ese plazo no podemos procesar cambios
            ni devoluciones.
          </p>
        </div>

        <div className="legal-section">
          <h2>2. Condiciones para cambio o devolución</h2>
          <p>Para proceder con un cambio o devolución, el producto debe:</p>
          <ul>
            <li>Estar en su estado original, sin uso, lavado ni alteraciones</li>
            <li>Conservar su empaque original</li>
            <li>Presentar comprobante de compra (número de pedido)</li>
          </ul>
        </div>

        <div className="legal-section">
          <h2>3. Productos artesanales</h2>
          <p>
            Las pequeñas variaciones en color, textura o dimensiones propias del proceso artesanal{' '}
            <strong>no son consideradas defectos</strong> y no aplican para devolución. Cada rebozo
            es una pieza única hecha a mano.
          </p>
        </div>

        <div className="legal-section">
          <h2>4. Proceso</h2>
          <ol style={{ paddingLeft: 20, lineHeight: 1.9 }}>
            <li>
              Contáctanos por <Link href="/contacto">WhatsApp o correo</Link> con tu número de
              pedido y fotos del producto.
            </li>
            <li>Evaluamos tu caso en un plazo de 1 a 2 días hábiles.</li>
            <li>Si aplica, te indicamos la dirección a la que enviar el producto.</li>
            <li>
              El costo de envío de regreso corre a cargo del cliente, excepto cuando el error es
              nuestro.
            </li>
            <li>
              Una vez recibido el producto en buenas condiciones, procesamos el cambio o reembolso
              en 5 días hábiles.
            </li>
          </ol>
        </div>

        <div className="legal-section">
          <h2>5. Reembolsos</h2>
          <p>
            Los reembolsos se realizan por el mismo medio de pago original. En pagos con tarjeta, el
            tiempo de acreditación depende del banco (generalmente 5–10 días hábiles).
          </p>
        </div>

        <div className="legal-section">
          <h2>6. Excepciones</h2>
          <p>No aplican cambios ni devoluciones en:</p>
          <ul>
            <li>Productos en oferta o liquidación marcados como "sin cambios"</li>
            <li>Pedidos con personalización especial</li>
            <li>Productos que presenten signos de uso, lavado o daño por mal manejo</li>
          </ul>
        </div>

        <div className="legal-section">
          <h2>¿Tienes dudas?</h2>
          <p>
            Escríbenos directamente, buscamos siempre la mejor solución para ti.{' '}
            <Link href="/contacto">Contáctanos aquí →</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
