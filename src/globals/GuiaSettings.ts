import type { GlobalConfig } from 'payload'

export const GuiaSettings: GlobalConfig = {
  slug: 'guia-settings',
  label: 'Guía de Rebozos',
  fields: [
    {
      name: 'tipos',
      type: 'array',
      label: 'Tipos de Rebozo',
      admin: {
        description: 'Un bloque por cada tipo de rebozo que aparece en la Guía.',
      },
      fields: [
        {
          name: 'category',
          type: 'relationship',
          relationTo: 'categories',
          required: true,
          label: 'Categoría vinculada',
          admin: { description: 'Conecta este bloque con una categoría existente.' },
        },
        {
          name: 'subtitle',
          type: 'text',
          label: 'Subtítulo del hero',
          admin: { description: 'Ej: Ligereza, elegancia y tradición en cada hilo.' },
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Descripción del hero',
        },
        {
          name: 'originText',
          type: 'textarea',
          label: 'Texto de Origen',
          admin: { description: 'Historia y procedencia de este tipo de rebozo.' },
        },
        {
          name: 'howToUseText',
          type: 'textarea',
          label: 'Texto "Cómo usarlo"',
        },
        {
          name: 'howToUseImages',
          type: 'array',
          label: 'Imágenes "Cómo usarlo"',
          maxRows: 3,
          fields: [
            { name: 'image', type: 'upload', relationTo: 'media', required: true, label: 'Foto' },
          ],
        },
        {
          name: 'caracteristicas',
          type: 'array',
          label: 'Características',
          maxRows: 4,
          fields: [
            {
              name: 'icon',
              type: 'select',
              label: 'Ícono',
              required: true,
              options: [
                { label: 'Ligero', value: 'ligero' },
                { label: 'Fresco', value: 'fresco' },
                { label: 'Elegante', value: 'elegante' },
                { label: 'Versátil', value: 'versatil' },
                { label: 'Natural', value: 'natural' },
                { label: 'Resistente', value: 'resistente' },
                { label: 'Fácil cuidado', value: 'facil_cuidado' },
                { label: 'Brillante', value: 'brillante' },
                { label: 'Exclusivo', value: 'exclusivo' },
                { label: 'Cálido', value: 'calido' },
                { label: 'Suave', value: 'suave' },
                { label: 'Acogedor', value: 'acogedor' },
                { label: 'Tradicional', value: 'tradicional' },
                { label: 'Colorido', value: 'colorido' },
                { label: 'Cultural', value: 'cultural' },
                { label: 'Amplio', value: 'amplio' },
                { label: 'Atemporal', value: 'atemporal' },
              ],
            },
            { name: 'title', type: 'text', label: 'Título', required: true },
            { name: 'desc', type: 'textarea', label: 'Descripción', required: true },
          ],
        },
      ],
    },
  ],
}
