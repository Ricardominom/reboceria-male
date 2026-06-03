import type { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  labels: {
    singular: 'Producto',
    plural: 'Productos',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'price', 'inStock', 'featured'],
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
        description: 'Ej: "Telar Tenancingo" — aparece en las cards del catálogo',
      },
    },
    {
      name: 'slug',
      type: 'text',
      label: 'Slug (URL)',
      required: true,
      unique: true,
      admin: {
        description: 'Identificador único en la URL. Ej: rebozo-telar-tenancingo',
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
      type: 'select',
      label: 'Categoría',
      options: [
        { label: 'Telar', value: 'Telar' },
        { label: 'Seda', value: 'Seda' },
        { label: 'Algodón', value: 'Algodón' },
        { label: 'Bordados', value: 'Bordados' },
        { label: 'Lana', value: 'Lana' },
      ],
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
      label: 'Precio (MXN)',
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
      name: 'colors',
      type: 'array',
      label: 'Colores disponibles',
      fields: [
        {
          name: 'hex',
          type: 'text',
          label: 'Color (código hex)',
          required: true,
          admin: {
            description: 'Ej: #8B2252',
          },
        },
      ],
    },
    {
      name: 'sizes',
      type: 'array',
      label: 'Tallas disponibles',
      fields: [
        {
          name: 'label',
          type: 'text',
          label: 'Etiqueta de talla',
          required: true,
          admin: {
            description: 'Ej: Clásico 170cm',
          },
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
    {
      name: 'images',
      type: 'array',
      label: 'Imágenes',
      admin: {
        description: 'La primera imagen es la principal. Las siguientes son la galería',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
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
