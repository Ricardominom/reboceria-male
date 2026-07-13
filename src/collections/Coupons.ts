import type { CollectionConfig } from 'payload'

export const Coupons: CollectionConfig = {
  slug: 'coupons',
  labels: { singular: 'Cupón', plural: 'Cupones' },
  admin: {
    useAsTitle: 'code',
    defaultColumns: ['code', 'type', 'value', 'usedCount', 'active', 'expiresAt'],
  },
  access: {
    read: ({ req }) => req.user != null,
    create: ({ req }) => req.user != null,
    update: ({ req }) => req.user != null,
    delete: ({ req }) => req.user != null,
  },
  fields: [
    {
      name: 'code',
      type: 'text',
      label: 'Código',
      required: true,
      unique: true,
      admin: { description: 'Ej: VERANO20 (sin espacios, mayúsculas)' },
    },
    {
      name: 'type',
      type: 'select',
      label: 'Tipo de descuento',
      required: true,
      options: [
        { label: 'Porcentaje (%)', value: 'percentage' },
        { label: 'Monto fijo (MXN)', value: 'fixed' },
      ],
    },
    {
      name: 'value',
      type: 'number',
      label: 'Valor',
      required: true,
      min: 0,
      admin: {
        description: 'Para porcentaje: 20 = 20% de descuento. Para monto fijo: 100 = $100 MXN.',
      },
    },
    {
      name: 'minPurchase',
      type: 'number',
      label: 'Compra mínima (MXN)',
      defaultValue: 0,
      admin: { description: 'Subtotal mínimo requerido para aplicar el cupón. 0 = sin mínimo.' },
    },
    {
      name: 'maxUses',
      type: 'number',
      label: 'Usos máximos',
      admin: { description: 'Dejar vacío para usos ilimitados.' },
    },
    {
      name: 'usedCount',
      type: 'number',
      label: 'Veces usado',
      defaultValue: 0,
      admin: { readOnly: true },
    },
    {
      name: 'expiresAt',
      type: 'date',
      label: 'Fecha de vencimiento',
      admin: { description: 'Dejar vacío para que nunca venza.' },
    },
    {
      name: 'active',
      type: 'checkbox',
      label: 'Activo',
      defaultValue: true,
    },
    {
      name: 'description',
      type: 'text',
      label: 'Nota interna',
      admin: { description: 'Solo visible en el admin. Ej: Campaña de verano 2026.' },
    },
  ],
}
