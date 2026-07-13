import type { CollectionConfig } from 'payload'

export const Reviews: CollectionConfig = {
  slug: 'reviews',
  labels: { singular: 'Reseña', plural: 'Reseñas' },
  admin: {
    defaultColumns: ['product', 'author', 'rating', 'status', 'createdAt'],
    useAsTitle: 'author',
  },
  access: {
    read: () => true,
    create: () => true,
    update: ({ req }) => req.user != null,
    delete: ({ req }) => req.user != null,
  },
  fields: [
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      required: true,
    },
    {
      name: 'author',
      type: 'text',
      required: true,
      label: 'Nombre',
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      label: 'Email',
      admin: { description: 'No se muestra públicamente' },
    },
    {
      name: 'rating',
      type: 'number',
      required: true,
      min: 1,
      max: 5,
      label: 'Calificación (1–5)',
    },
    {
      name: 'title',
      type: 'text',
      label: 'Título de la reseña',
    },
    {
      name: 'body',
      type: 'textarea',
      required: true,
      label: 'Reseña',
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'pending',
      label: 'Estado',
      options: [
        { label: 'Pendiente', value: 'pending' },
        { label: 'Aprobada', value: 'approved' },
        { label: 'Rechazada', value: 'rejected' },
      ],
    },
    {
      name: 'verified',
      type: 'checkbox',
      defaultValue: false,
      label: 'Compra verificada',
      admin: {
        description: 'Se marca automáticamente cuando la reseña viene de un comprador real',
      },
    },
  ],
}
