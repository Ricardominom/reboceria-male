import type { CollectionConfig } from 'payload'

export const Orders: CollectionConfig = {
  slug: 'orders',
  labels: {
    singular: 'Orden',
    plural: 'Órdenes',
  },
  admin: {
    useAsTitle: 'customerName',
    defaultColumns: [
      'customerName',
      'customerEmail',
      'total',
      'status',
      'trackingNumber',
      'createdAt',
    ],
  },
  access: {
    // Cualquiera puede crear un pedido (el cliente al hacer checkout)
    create: () => true,
    // Admin ve todos. Un cliente solo ve los suyos.
    read: ({ req }) => {
      if (!req.user) return false
      if ((req.user as any)?.role === 'admin') return true
      return {
        customer: {
          equals: req.user.id,
        },
      }
    },
    // Solo admin puede actualizar (cambiar status, etc.)
    update: ({ req }) => (req.user as any)?.role === 'admin',
    // Solo admin puede eliminar
    delete: ({ req }) => (req.user as any)?.role === 'admin',
  },
  fields: [
    //  Cliente
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'users',
      label: 'Cliente (cuenta)',
      admin: {
        description: 'Se llena automáticamente si el cliente tiene cuenta activa',
      },
    },
    {
      name: 'customerName',
      type: 'text',
      label: 'Nombre del cliente',
      required: true,
    },
    {
      name: 'customerEmail',
      type: 'email',
      label: 'Correo electrónico',
      required: true,
    },
    {
      name: 'customerPhone',
      type: 'text',
      label: 'Teléfono',
    },

    //  Dirección de envío
    {
      name: 'address',
      type: 'group',
      label: 'Dirección de envío',
      fields: [
        {
          name: 'street',
          type: 'text',
          label: 'Calle',
          required: true,
        },
        {
          name: 'number',
          type: 'text',
          label: 'Número',
        },
        {
          name: 'colonia',
          type: 'text',
          label: 'Colonia',
        },
        {
          name: 'city',
          type: 'text',
          label: 'Ciudad',
          required: true,
        },
        {
          name: 'state',
          type: 'text',
          label: 'Estado',
          required: true,
        },
        {
          name: 'postalCode',
          type: 'text',
          label: 'Código postal',
          required: true,
        },
      ],
    },

    //  Artículos del pedido
    {
      name: 'items',
      type: 'array',
      label: 'Artículos',
      minRows: 1,
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
          label: 'Producto',
          admin: {
            description: 'Referencia al producto original',
          },
        },
        {
          name: 'productName',
          type: 'text',
          label: 'Nombre del producto',
          required: true,
          admin: {
            description:
              'Guardado al momento de la compra. No cambia aunque el producto se edite después.',
          },
        },
        {
          name: 'color',
          type: 'text',
          label: 'Color',
        },
        {
          name: 'size',
          type: 'text',
          label: 'Talla',
        },
        {
          name: 'qty',
          type: 'number',
          label: 'Cantidad',
          required: true,
          min: 1,
        },
        {
          name: 'unitPrice',
          type: 'number',
          label: 'Precio unitario (MXN)',
          required: true,
          admin: {
            description:
              'Precio al momento de la compra. No cambia aunque el producto cambie de precio.',
          },
        },
      ],
    },

    //  Totales
    {
      name: 'subtotal',
      type: 'number',
      label: 'Subtotal (MXN)',
      required: true,
    },
    {
      name: 'shippingCost',
      type: 'number',
      label: 'Costo de envío (MXN)',
      required: true,
      admin: {
        description: 'Gratis si el subtotal supera $800 MXN',
      },
    },
    {
      name: 'total',
      type: 'number',
      label: 'Total (MXN)',
      required: true,
    },

    //  Pago
    {
      name: 'paymentMethod',
      type: 'select',
      label: 'Método de pago',
      options: [
        { label: 'Tarjeta', value: 'tarjeta' },
        { label: 'OXXO', value: 'oxxo' },
        { label: 'Transferencia', value: 'transferencia' },
      ],
    },
    {
      name: 'stripePaymentIntentId',
      type: 'text',
      label: 'Stripe Payment Intent ID',
      admin: {
        description: 'Se llena automáticamente cuando Stripe confirma el pago',
      },
    },
    {
      name: 'stripeSessionId',
      type: 'text',
      label: 'Stripe Session ID',
      admin: {
        description: 'ID de la sesión de pago en Stripe',
      },
    },
    {
      name: 'trackingNumber',
      type: 'text',
      label: 'Número de rastreo',
      admin: { description: 'Ej: 1234567890 · Se muestra al cliente en el correo de envío' },
    },
    {
      name: 'trackingCarrier',
      type: 'select',
      label: 'Paquetería',
      options: [
        { label: 'Estafeta', value: 'estafeta' },
        { label: 'DHL', value: 'dhl' },
        { label: 'FedEx', value: 'fedex' },
        { label: 'J&T Express', value: 'jt' },
        { label: 'Correos de México', value: 'correos' },
        { label: 'Otra', value: 'otra' },
      ],
    },
    {
      name: 'reviewToken',
      type: 'text',
      label: 'Token de reseña',
      admin: {
        readOnly: true,
        description: 'Token único para el link de reseña. Se genera automáticamente.',
      },
    },
    {
      name: 'reviewTokenUsed',
      type: 'checkbox',
      label: 'Reseña enviada',
      defaultValue: false,
      admin: {
        description: 'Se marca automáticamente cuando el cliente escribe su reseña.',
      },
    },

    //  Estado
    {
      name: 'status',
      type: 'select',
      label: 'Estado del pedido',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pendiente de pago', value: 'pending' },
        { label: 'Pagado', value: 'paid' },
        { label: 'Enviado', value: 'shipped' },
        { label: 'Entregado', value: 'delivered' },
        { label: 'Cancelado', value: 'cancelled' },
      ],
    },
    {
      name: 'couponCode',
      type: 'text',
      label: 'Cupón aplicado',
      admin: { readOnly: true },
    },
    {
      name: 'discountAmount',
      type: 'number',
      label: 'Descuento (MXN)',
      defaultValue: 0,
      admin: { readOnly: true },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, operation }) => {
        if (operation === 'create') {
          data.reviewToken = crypto.randomUUID()
        }
        return data
      },
    ],
    afterChange: [
      async ({ doc, previousDoc, operation }) => {
        if (
          operation === 'update' &&
          doc.status === 'shipped' &&
          previousDoc?.status !== 'shipped'
        ) {
          const { sendShippingNotification } = await import('@/lib/email')
          sendShippingNotification({
            to: doc.customerEmail,
            customerName: doc.customerName,
            orderId: doc.id,
            trackingNumber: doc.trackingNumber ?? undefined,
            trackingCarrier: doc.trackingCarrier ?? undefined,
            items: (doc.items ?? []).map((item: any) => ({
              productName: item.productName,
              color: item.color ?? '',
              size: item.size ?? 'Único',
              qty: item.qty,
            })),
            total: doc.total,
            address: {
              street: doc.address?.street,
              number: doc.address?.number ?? undefined,
              colonia: doc.address?.colonia ?? undefined,
              city: doc.address?.city,
              state: doc.address?.state,
              postalCode: doc.address?.postalCode,
            },
          }).catch((err: unknown) => console.error('Error enviando correo de envío:', err))
        }
        // — Delivered: email de reseña —
        if (
          operation === 'update' &&
          doc.status === 'delivered' &&
          previousDoc?.status !== 'delivered' &&
          doc.reviewToken &&
          !doc.reviewTokenUsed
        ) {
          const { sendReviewRequestEmail } = await import('@/lib/email')
          const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? ''
          sendReviewRequestEmail({
            to: doc.customerEmail,
            customerName: doc.customerName,
            products: (doc.items ?? []).map((item: any) => ({
              name: item.productName,
              image: null,
            })),
            reviewUrl: `${siteUrl}/review/${doc.reviewToken}`,
          }).catch((err: unknown) => console.error('Error enviando correo de reseña:', err))
        }
      },
    ],
  },
}
