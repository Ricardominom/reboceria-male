import type { CollectionConfig } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: { singular: 'Categoría', plural: 'Categorías' },
  admin: { useAsTitle: 'name', defaultColumns: ['name'] },
  access: { read: () => true },
  fields: [
    { name: 'name', type: 'text', label: 'Nombre de la categoría', required: true, unique: true },
    {
      name: 'description',
      type: 'text',
      label: 'Descripción corta',
      admin: { description: 'Ej: Suave, fresco y ligero' },
    },
    { name: 'icon', type: 'text', label: 'Ícono (emoji)', admin: { description: 'Ej: 🧵' } },
    {
      name: 'chipColor',
      type: 'text',
      label: 'Color de fondo del chip',
      admin: { description: 'Ej: #F8D7EA' },
    },
    {
      name: 'chipTextColor',
      type: 'text',
      label: 'Color del texto del chip',
      admin: { description: 'Ej: #C13584' },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Imagen de la categoría',
      admin: { description: 'Foto representativa que aparece en el home' },
    },
    {
      name: 'guiaImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Imagen editorial (Guía de Rebozos)',
      admin: {
        description:
          'Imagen grande que aparece en la página Guía de Rebozos. Si no se sube, se usará la imagen de categoría.',
      },
    },
  ],
}
