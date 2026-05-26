import type { CollectionConfig } from 'payload'

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'customerName',
    defaultColumns: ['customerName', 'customerEmail', 'total', 'status', 'createdAt'],
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
  ],
}
