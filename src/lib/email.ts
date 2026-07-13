import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export type OrderEmailData = {
  to: string
  customerName: string
  orderId: number
  items: Array<{ productName: string; color: string; size: string; qty: number; unitPrice: number }>
  subtotal: number
  shippingCost: number
  total: number
  paymentMethod: string
  address: {
    street: string
    number?: string
    colonia?: string
    city: string
    state: string
    postalCode: string
  }
  bankDetails?: {
    bankName: string
    bankHolder: string
    bankClabe: string
    transferNotes: string
  }
}

export async function sendOrderConfirmation(data: OrderEmailData) {
  const itemsHtml = data.items
    .map(
      (i) => `
      <tr>
        <td style="padding:8px 0;border-bottom:1px solid #f3f4f6">${i.productName} — ${i.color} / ${i.size}</td>
        <td style="padding:8px 0;border-bottom:1px solid #f3f4f6;text-align:center">${i.qty}</td>
        <td style="padding:8px 0;border-bottom:1px solid #f3f4f6;text-align:right">$${(i.unitPrice * i.qty).toLocaleString('es-MX')} MXN</td>
      </tr>`,
    )
    .join('')

  const bankSection =
    data.paymentMethod === 'transferencia' && data.bankDetails?.bankClabe
      ? `<div style="margin-top:24px;padding:16px;background:#f0fdf4;border-radius:8px;border:1px solid #bbf7d0">
          <p style="margin:0 0 8px;font-weight:600">Datos para tu transferencia:</p>
          <p style="margin:4px 0">Banco: <strong>${data.bankDetails.bankName}</strong></p>
          <p style="margin:4px 0">Titular: <strong>${data.bankDetails.bankHolder}</strong></p>
          <p style="margin:4px 0">CLABE: <strong>${data.bankDetails.bankClabe}</strong></p>
          <p style="margin:4px 0">Monto: <strong>$${data.total.toLocaleString('es-MX')} MXN</strong></p>
          ${data.bankDetails.transferNotes ? `<p style="margin:8px 0 0;color:#6b7280">${data.bankDetails.transferNotes}</p>` : ''}
        </div>`
      : ''

  await resend.emails.send({
    from: process.env.RESEND_FROM ?? 'onboarding@resend.dev',
    to: data.to,
    subject: `Pedido #${data.orderId} confirmado — Rebozos Mary`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#111827">
        <div style="background:#C13584;padding:24px;text-align:center;border-radius:8px 8px 0 0">
          <h1 style="color:white;margin:0;font-size:22px">Rebozos Mary</h1>
        </div>

        <div style="padding:32px;background:white;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px">
          <h2 style="margin:0 0 8px">¡Gracias por tu pedido, ${data.customerName}!</h2>
          <p style="color:#6b7280;margin:0 0 24px">Pedido <strong>#${data.orderId}</strong></p>

          <table style="width:100%;border-collapse:collapse">
            <thead>
              <tr style="background:#f9fafb">
                <th style="text-align:left;padding:8px 0;font-size:12px;color:#6b7280;text-transform:uppercase">Producto</th>
                <th style="text-align:center;padding:8px 0;font-size:12px;color:#6b7280;text-transform:uppercase">Cant.</th>
                <th style="text-align:right;padding:8px 0;font-size:12px;color:#6b7280;text-transform:uppercase">Precio</th>
              </tr>
            </thead>
            <tbody>${itemsHtml}</tbody>
          </table>

          <div style="margin-top:16px;text-align:right">
            <p style="margin:4px 0;color:#6b7280">Subtotal: $${data.subtotal.toLocaleString('es-MX')} MXN</p>
            <p style="margin:4px 0;color:#6b7280">Envío: ${data.shippingCost === 0 ? 'Gratis' : `$${data.shippingCost} MXN`}</p>
            <p style="margin:8px 0 0;font-size:18px;font-weight:700">Total: $${data.total.toLocaleString('es-MX')} MXN</p>
          </div>

          <div style="margin-top:24px;padding:16px;background:#f9fafb;border-radius:8px">
            <p style="margin:0 0 8px;font-weight:600">Dirección de envío:</p>
            <p style="margin:0;color:#374151">
              ${data.address.street} ${data.address.number ?? ''}<br>
              ${data.address.colonia ? data.address.colonia + '<br>' : ''}
              ${data.address.city}, ${data.address.state}, CP ${data.address.postalCode}
            </p>
          </div>

          ${bankSection}

          <p style="margin-top:32px;color:#9ca3af;font-size:13px;text-align:center">
            Rebozos Mary · Arte textil mexicano hecho a mano
          </p>
        </div>
      </div>
    `,
  })
}

export async function sendAdminOrderNotification(data: OrderEmailData) {
  const adminEmail = process.env.ADMIN_EMAIL
  if (!adminEmail) return

  const itemsHtml = data.items
    .map(
      (i) =>
        `<li style="padding:4px 0">${i.qty}× <strong>${i.productName}</strong> — ${i.color} / ${i.size} · $${(i.unitPrice * i.qty).toLocaleString('es-MX')} MXN</li>`,
    )
    .join('')

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? ''

  await resend.emails.send({
    from: process.env.RESEND_FROM ?? 'onboarding@resend.dev',
    to: adminEmail,
    subject: `Nuevo pedido #${data.orderId} — $${data.total.toLocaleString('es-MX')} MXN (${data.paymentMethod})`,
    html: `
      <div style="font-family:sans-serif;max-width:580px;margin:0 auto;color:#111827">
        <div style="background:#7B1D3C;padding:20px 24px;border-radius:8px 8px 0 0">
          <h1 style="color:white;margin:0;font-size:18px">Nuevo pedido recibido — Rebozos Mary</h1>
        </div>
        <div style="padding:28px;background:white;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px">
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:6px 0;color:#6b7280;width:140px">Pedido</td><td><strong>#${data.orderId}</strong></td></tr>
            <tr><td style="padding:6px 0;color:#6b7280">Cliente</td><td>${data.customerName}</td></tr>
            <tr><td style="padding:6px 0;color:#6b7280">Correo</td><td>${data.to}</td></tr>
            <tr><td style="padding:6px 0;color:#6b7280">Forma de pago</td><td style="text-transform:capitalize">${data.paymentMethod}</td></tr>
            <tr><td style="padding:6px 0;color:#6b7280">Total</td><td><strong>$${data.total.toLocaleString('es-MX')} MXN</strong></td></tr>
          </table>

          <h3 style="margin:24px 0 8px;font-size:14px;text-transform:uppercase;color:#6b7280;letter-spacing:.05em">Productos</h3>
          <ul style="margin:0;padding-left:20px;color:#374151">${itemsHtml}</ul>

          <h3 style="margin:24px 0 8px;font-size:14px;text-transform:uppercase;color:#6b7280;letter-spacing:.05em">Dirección de envío</h3>
          <p style="margin:0;color:#374151;line-height:1.6">
            ${data.address.street} ${data.address.number ?? ''}<br>
            ${data.address.colonia ? data.address.colonia + '<br>' : ''}
            ${data.address.city}, ${data.address.state} · CP ${data.address.postalCode}
          </p>

          <a href="${siteUrl}/admin/collections/orders/${data.orderId}"
             style="display:inline-block;margin-top:28px;padding:12px 24px;background:#7B1D3C;color:white;text-decoration:none;border-radius:6px;font-weight:600;font-size:14px">
            Ver pedido en el admin →
          </a>
        </div>
      </div>
    `,
  })
}

export type ShippingEmailData = {
  to: string
  customerName: string
  orderId: number
  trackingNumber?: string
  trackingCarrier?: string
  items: Array<{ productName: string; color: string; size: string; qty: number }>
  total: number
  address: {
    street: string
    number?: string
    colonia?: string
    city: string
    state: string
    postalCode: string
  }
}

const CARRIER_URLS: Record<string, string> = {
  estafeta: 'https://rastreo.estafeta.com/rastreo-envio?guia=',
  dhl: 'https://www.dhl.com/mx-es/home/rastreo.html?tracking-id=',
  fedex: 'https://www.fedex.com/apps/fedextrack/?tracknumbers=',
  jt: 'https://www.jtexpress.mx/index/query/gzquery.html?bills=',
  correos:
    'https://www.correosdemexico.gob.mx/SSLServicios/ConsultaCP/Paginas/consultacodigo.aspx?cp=',
}

const CARRIER_LABELS: Record<string, string> = {
  estafeta: 'Estafeta',
  dhl: 'DHL',
  fedex: 'FedEx',
  jt: 'J&T Express',
  correos: 'Correos de México',
  otra: 'Paquetería',
}

export async function sendShippingNotification(data: ShippingEmailData) {
  const itemsHtml = data.items
    .map(
      (i) =>
        `<li style="padding:4px 0">${i.qty}× <strong>${i.productName}</strong> — ${i.color} / ${i.size}</li>`,
    )
    .join('')

  const carrierLabel = data.trackingCarrier
    ? (CARRIER_LABELS[data.trackingCarrier] ?? 'Paquetería')
    : 'Paquetería'
  const trackingUrl =
    data.trackingNumber && data.trackingCarrier && CARRIER_URLS[data.trackingCarrier]
      ? `${CARRIER_URLS[data.trackingCarrier]}${data.trackingNumber}`
      : null

  const trackingSection = data.trackingNumber
    ? `<div style="margin-top:24px;padding:20px;background:#fdf8f3;border-radius:8px;border:1px solid #e8d5b7;text-align:center">
        <p style="margin:0 0 4px;font-size:13px;color:#6b7280;text-transform:uppercase;letter-spacing:.05em">Número de rastreo · ${carrierLabel}</p>
        <p style="margin:0;font-size:22px;font-weight:700;letter-spacing:.08em;color:#111827">${data.trackingNumber}</p>
        ${trackingUrl ? `<a href="${trackingUrl}" target="_blank" style="display:inline-block;margin-top:12px;padding:10px 20px;background:#7B1D3C;color:white;text-decoration:none;border-radius:6px;font-size:14px;font-weight:600">Rastrear mi paquete →</a>` : ''}
      </div>`
    : `<p style="margin-top:16px;color:#6b7280">Tu paquete ya está en camino. En cuanto tengamos el número de rastreo te lo enviamos.</p>`

  await resend.emails.send({
    from: process.env.RESEND_FROM ?? 'onboarding@resend.dev',
    to: data.to,
    subject: `Tu pedido #${data.orderId} está en camino — Rebozos Mary`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#111827">
        <div style="background:#7B1D3C;padding:24px;text-align:center;border-radius:8px 8px 0 0">
          <h1 style="color:white;margin:0;font-size:22px">Rebozos Mary</h1>
        </div>
        <div style="padding:32px;background:white;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px">
          <h2 style="margin:0 0 8px">¡Tu pedido está en camino, ${data.customerName}!</h2>
          <p style="color:#6b7280;margin:0 0 24px">Pedido <strong>#${data.orderId}</strong> · Total: <strong>$${data.total.toLocaleString('es-MX')} MXN</strong></p>

          ${trackingSection}

          <h3 style="margin:28px 0 8px;font-size:14px;text-transform:uppercase;color:#6b7280;letter-spacing:.05em">Productos enviados</h3>
          <ul style="margin:0;padding-left:20px;color:#374151">${itemsHtml}</ul>

          <h3 style="margin:24px 0 8px;font-size:14px;text-transform:uppercase;color:#6b7280;letter-spacing:.05em">Dirección de entrega</h3>
          <p style="margin:0;color:#374151;line-height:1.6">
            ${data.address.street} ${data.address.number ?? ''}<br>
            ${data.address.colonia ? data.address.colonia + '<br>' : ''}
            ${data.address.city}, ${data.address.state} · CP ${data.address.postalCode}
          </p>

          <p style="margin-top:32px;color:#9ca3af;font-size:13px;text-align:center">
            Rebozos Mary · Arte textil mexicano hecho a mano
          </p>
        </div>
      </div>
    `,
  })
}

export interface ReviewRequestEmailData {
  to: string
  customerName: string
  products: { name: string; image: string | null }[]
  reviewUrl: string
}

export async function sendReviewRequestEmail(data: ReviewRequestEmailData) {
  const productList = data.products.map((p) => `• ${p.name}`).join('\n')

  await resend.emails.send({
    from: process.env.RESEND_FROM ?? 'onboarding@resend.dev',
    to: data.to,
    subject: '¿Cómo te quedó tu rebozo? Deja tu reseña 🌸',
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;color:#3A2A2A">
        <h2 style="color:#6B1428">¡Hola, ${data.customerName}!</h2>
        <p>Nos alegra saber que ya tienes tu pedido. Nos encantaría conocer tu opinión sobre:</p>
        <p style="background:#F6F1EB;padding:12px 16px;border-radius:8px;white-space:pre-line">${productList}</p>
        <p>Tu reseña ayuda a otras personas a conocer nuestros rebozos artesanales.</p>
        <a href="${data.reviewUrl}"
           style="display:inline-block;margin:16px 0;padding:12px 28px;background:#6B1428;color:#fff;text-decoration:none;border-radius:6px;font-weight:600">
          Escribir mi reseña →
        </a>
        <p style="font-size:12px;color:#999">Este enlace es de un solo uso y expira después de escribir tu reseña.</p>
        <hr style="border:none;border-top:1px solid #eee;margin:24px 0">
        <p style="font-size:12px;color:#999">Rebozos Mary — Arte textil mexicano</p>
      </div>
    `,
  })
}
