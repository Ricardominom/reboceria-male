import type { CollectionConfig } from 'payload'

export const Colors: CollectionConfig = {
  slug: 'colors',
  labels: {
    singular: 'Color',
    plural: 'Colores',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'hex'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Nombre del color',
      required: true,
      unique: true,
      admin: { description: 'Ej: Azul, Negro, Café, Palomo' },
    },
    {
      name: 'hex',
      type: 'text',
      label: 'Color',
      admin: {
        components: {
          Field: '@/components/admin/ColorPickerField',
          Cell: '@/components/admin/ColorSwatchCell',
        },
      },
    },
  ],
}
