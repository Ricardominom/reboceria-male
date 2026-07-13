import { getPayload } from 'payload'
import config from '@/payload.config'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Preguntas Frecuentes — Rebozos Mary',
  description: 'Resolvemos tus dudas sobre envíos, pagos, productos y devoluciones.',
}

const FALLBACK_FAQS = [
  {
    category: 'productos',
    question: '¿Los rebozos son realmente hechos a mano?',
    answer:
      'Sí. Cada rebozo es tejido a mano por artesanas mexicanas usando técnicas ancestrales. Por eso pueden existir pequeñas variaciones entre piezas — eso es parte de su autenticidad.',
  },
  {
    category: 'productos',
    question: '¿Los colores son exactamente como en las fotos?',
    answer:
      'Las fotografías son lo más fieles posible, pero los colores pueden variar ligeramente según la calibración de tu pantalla. Si tienes dudas sobre un color específico, escríbenos.',
  },
  {
    category: 'envios',
    question: '¿Cuánto tarda en llegar mi pedido?',
    answer:
      'El tiempo estimado de entrega es de 3 a 5 días hábiles a partir de que confirmamos tu pago. Recibirás un correo con tu número de rastreo cuando tu pedido sea enviado.',
  },
  {
    category: 'envios',
    question: '¿Hacen envíos a toda la República Mexicana?',
    answer:
      'Sí, enviamos a cualquier estado de la República. El costo de envío es de $150 MXN, con envío gratis en pedidos mayores a $800 MXN.',
  },
  {
    category: 'pagos',
    question: '¿Qué métodos de pago aceptan?',
    answer:
      'Aceptamos tarjeta de crédito y débito (Visa, Mastercard), pago en efectivo en OXXO y transferencia bancaria (CLABE interbancaria).',
  },
  {
    category: 'pagos',
    question: '¿Es seguro pagar con tarjeta en su sitio?',
    answer:
      'Sí. Los pagos con tarjeta son procesados por Stripe, que cumple con el estándar PCI DSS. En ningún momento almacenamos los datos de tu tarjeta.',
  },
  {
    category: 'devoluciones',
    question: '¿Puedo hacer un cambio si el producto no es lo que esperaba?',
    answer:
      'Tienes 15 días naturales desde la entrega para solicitar un cambio. El producto debe estar sin uso y en su empaque original. Consulta nuestra política completa en la página de Cambios y Devoluciones.',
  },
  {
    category: 'devoluciones',
    question: '¿Qué hago si mi pedido llegó dañado?',
    answer:
      'Contáctanos de inmediato por WhatsApp o correo con fotos del daño y tu número de pedido. Resolveremos el caso lo antes posible sin costo para ti.',
  },
]

const CATEGORY_LABELS: Record<string, string> = {
  productos: 'Productos',
  envios: 'Pedidos y envíos',
  pagos: 'Pagos',
  devoluciones: 'Cambios y devoluciones',
  general: 'General',
}

const CATEGORY_ORDER = ['productos', 'envios', 'pagos', 'devoluciones', 'general']

export default async function FaqPage() {
  const payload = await getPayload({ config: await config })
  const faqSettings = await payload.findGlobal({ slug: 'faq-settings', depth: 0 })

  const faqs = faqSettings.faqs && faqSettings.faqs.length > 0 ? faqSettings.faqs : FALLBACK_FAQS

  const grouped = CATEGORY_ORDER.reduce<Record<string, typeof faqs>>((acc, cat) => {
    const items = faqs.filter((f: any) => (f.category ?? 'general') === cat)
    if (items.length > 0) acc[cat] = items
    return acc
  }, {})

  return (
    <div>
      <section className="contacto-hero">
        <p className="guia-eyebrow">AYUDA</p>
        <img src="/svg/ornamento-separador.svg" alt="" className="contacto-ornament" />
        <h1 className="contacto-hero-title">Preguntas frecuentes</h1>
        <p className="contacto-hero-desc">Todo lo que necesitas saber antes de hacer tu pedido.</p>
      </section>

      <div className="faq-categories">
        {Object.entries(grouped).map(([cat, items]) => (
          <div key={cat} className="faq-category">
            <p className="faq-category-title">{CATEGORY_LABELS[cat] ?? cat}</p>
            {items.map((faq: any, i: number) => (
              <details key={i} className="faq-item">
                <summary>{faq.question}</summary>
                <p className="faq-answer">{faq.answer}</p>
              </details>
            ))}
          </div>
        ))}

        <div className="faq-cta">
          <p>¿No encontraste lo que buscabas?</p>
          <Link href="/contacto" className="btn-primary-dark">
            Escríbenos directamente →
          </Link>
        </div>
      </div>
    </div>
  )
}
