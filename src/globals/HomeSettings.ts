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
  ],
}
