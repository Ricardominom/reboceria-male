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
