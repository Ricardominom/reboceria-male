import type { GlobalConfig } from 'payload'

export const FaqSettings: GlobalConfig = {
  slug: 'faq-settings',
  label: 'Preguntas Frecuentes (FAQ)',
  fields: [
    {
      name: 'faqs',
      type: 'array',
      label: 'Preguntas y respuestas',
      labels: { singular: 'Pregunta', plural: 'Preguntas' },
      admin: {
        description: 'Agrega, edita o reordena las preguntas arrastrando cada fila.',
      },
      fields: [
        {
          name: 'question',
          type: 'text',
          label: 'Pregunta',
          required: true,
        },
        {
          name: 'answer',
          type: 'textarea',
          label: 'Respuesta',
          required: true,
        },
        {
          name: 'category',
          type: 'select',
          label: 'Categoría',
          defaultValue: 'general',
          options: [
            { label: 'Pedidos y envíos', value: 'envios' },
            { label: 'Pagos', value: 'pagos' },
            { label: 'Productos', value: 'productos' },
            { label: 'Cambios y devoluciones', value: 'devoluciones' },
            { label: 'General', value: 'general' },
          ],
        },
      ],
    },
  ],
}
