import type { GlobalConfig } from 'payload'

export const HomeSettings: GlobalConfig = {
  slug: 'home-settings',
  label: 'Configuración del Home',
  fields: [
    {
      name: 'heroImages',
      label: 'Imágenes del Hero (carrusel)',
      type: 'array',
      labels: {
        singular: 'Imagen',
        plural: 'Imágenes',
      },
      minRows: 1,
      maxRows: 6,
      fields: [
        { name: 'image', label: 'Imagen', type: 'upload', relationTo: 'media', required: true },
      ],
    },
    {
      name: 'artisanImages',
      label: 'Imágenes banner artesanas (carrusel)',
      type: 'array',
      labels: {
        singular: 'Imagen',
        plural: 'Imágenes',
      },
      minRows: 1,
      maxRows: 6,
      fields: [
        { name: 'image', label: 'Imagen', type: 'upload', relationTo: 'media', required: true },
      ],
    },
    {
      name: 'testimonialImages',
      label: 'Imágenes de testimonios',
      type: 'array',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    {
      name: 'guiaHeroImage',
      label: 'Imagen hero — Guía de Rebozos',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description:
          'Imagen que aparece en el lado derecho del hero de la página Guía de Rebozos. Recomendado: artesana trabajando en telar.',
      },
    },
    {
      name: 'guiaCtaImage',
      label: 'Imagen CTA — Guía de Rebozos',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description:
          'Imagen decorativa del banner final en la página Guía de Rebozos (sección "¿Ya encontraste el tejido ideal?").',
      },
    },
    {
      name: 'giftIdeas',
      type: 'array',
      label: 'Sección "El regalo perfecto"',
      maxRows: 4,
      fields: [
        { name: 'icon', type: 'text', label: 'Ícono (emoji)', required: true },
        {
          name: 'label',
          type: 'text',
          label: 'Ocasión',
          required: true,
          admin: { description: 'Ej: Para mamá' },
        },
        { name: 'sub', type: 'text', label: 'Descripción corta', required: true },
        {
          name: 'backgroundColor',
          type: 'text',
          label: 'Color de fondo',
          admin: { description: 'Ej: #FDF0F7' },
        },
        {
          name: 'textColor',
          type: 'text',
          label: 'Color del texto',
          admin: { description: 'Ej: #C13584' },
        },
        { name: 'category', type: 'relationship', relationTo: 'categories', label: 'Categoría' },
      ],
    },
  ],
}
