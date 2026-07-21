import type { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  labels: {
    singular: 'Producto',
    plural: 'Productos',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'price', 'featured'],
  },
  access: {
    read: () => true,
  },
  fields: [
    //  Identidad
    {
      name: 'name',
      type: 'text',
      label: 'Nombre completo',
      required: true,
    },
    {
      name: 'short',
      type: 'text',
      label: 'Nombre corto (para tarjetas)',
      admin: {
        hidden: true,
      },
      hooks: {
        beforeChange: [({ siblingData }) => siblingData.name],
      },
    },
    {
      name: 'slug',
      type: 'text',
      label: 'Slug (URL)',
      required: true,
      unique: true,
      admin: {
        hidden: true,
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value, originalDoc, operation }) => {
            const toSlug = (name: string) =>
              name
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-z0-9\s-]/g, '')
                .trim()
                .replace(/\s+/g, '-')

            if (operation === 'create') return toSlug(siblingData.name ?? '')
            if (siblingData.name && siblingData.name !== originalDoc?.name)
              return toSlug(siblingData.name)
            return value
          },
        ],
      },
    },

    //  Origen y características
    {
      name: 'origin',
      type: 'text',
      label: 'Origen',
      admin: {
        description: 'Ej: Tenancingo, Edo. Méx.',
      },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      label: 'Categoría',
    },
    {
      name: 'material',
      type: 'text',
      label: 'Material',
      admin: {
        description: 'Ej: Algodón y seda',
      },
    },

    //  Precio
    {
      name: 'price',
      type: 'number',
      label: 'Precio base (MXN)',
      required: true,
    },
    {
      name: 'comparePrice',
      type: 'number',
      label: 'Precio anterior (MXN)',
      admin: {
        description: 'Opcional. Si se llena, aparece tachado junto al precio actual',
      },
    },

    //  Etiqueta y variantes
    {
      name: 'tag',
      type: 'select',
      label: 'Etiqueta',
      admin: {
        description: 'Badge que aparece sobre la imagen del producto',
      },
      options: [
        { label: 'Más vendido', value: 'MÁS VENDIDO' },
        { label: 'Premium', value: 'PREMIUM' },
        { label: 'Oferta', value: 'OFERTA' },
        { label: 'Nuevo', value: 'NUEVO' },
      ],
    },
    {
      name: 'variants',
      type: 'array',
      label: 'Colores disponibles',
      minRows: 1,
      admin: {
        components: {
          RowLabel: '@/components/admin/VariantRowLabel#VariantRowLabel',
        },
      },
      fields: [
        {
          name: 'color',
          type: 'relationship',
          relationTo: 'colors',
          required: true,
          label: 'Color',
        },
        {
          name: 'images',
          type: 'array',
          label: 'Fotos de este color',
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
          name: 'sizes',
          type: 'array',
          label: 'Tallas disponibles',
          minRows: 1,
          fields: [
            {
              name: 'label',
              type: 'text',
              label: 'Talla',
              required: true,
              admin: {
                description: 'Ej: Chica, Grande, Único, 170cm',
              },
            },
            {
              name: 'price',
              type: 'number',
              label: 'Precio (MXN)',
              required: true,
            },
            {
              name: 'stock',
              type: 'number',
              label: 'Piezas disponibles',
              defaultValue: 0,
              min: 0,
            },
          ],
        },
      ],
    },

    //  Contenido
    {
      name: 'description',
      type: 'richText',
      label: 'Descripción',
    },
    {
      name: 'careInstructions',
      type: 'richText',
      label: 'Instrucciones de cuidado',
    },

    //  Reseñas
    {
      name: 'rating',
      type: 'number',
      label: 'Calificación promedio',
      min: 1,
      max: 5,
      admin: {
        description: 'Del 1 al 5. Se actualiza manualmente por ahora',
      },
    },
    {
      name: 'reviewCount',
      type: 'number',
      label: 'Número de reseñas',
    },

    //  Estado
    {
      name: 'inStock',
      type: 'checkbox',
      label: 'En stock',
      defaultValue: true,
      admin: {
        hidden: true,
        components: {
          Cell: '@/components/admin/InStockCell',
        },
      },
      hooks: {
        beforeChange: [
          ({ siblingData }) =>
            (siblingData.variants ?? []).some((v: any) =>
              (v.sizes ?? []).some((s: any) => (s.stock ?? 0) > 0),
            ),
        ],
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Destacado',
      defaultValue: false,
      admin: {
        description: 'Aparece en la sección "Más vendidos" de la página de inicio',
      },
    },
  ],
}
