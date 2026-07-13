import type { GlobalConfig } from 'payload'

export const StoreSettings: GlobalConfig = {
  slug: 'store-settings',
  label: 'Configuración de la tienda',
  fields: [
    {
      name: 'bankName',
      type: 'text',
      label: 'Banco',
      admin: { description: 'Ej: BBVA, Banamex, HSBC' },
    },
    {
      name: 'bankHolder',
      type: 'text',
      label: 'Titular de la cuenta',
    },
    {
      name: 'bankClabe',
      type: 'text',
      label: 'CLABE interbancaria (18 dígitos)',
    },
    {
      name: 'bankAccount',
      type: 'text',
      label: 'Número de cuenta (opcional)',
    },
    {
      name: 'transferNotes',
      type: 'textarea',
      label: 'Instrucciones adicionales',
      admin: { description: 'Ej: Enviar comprobante al WhatsApp...' },
    },
    {
      name: 'promoMessages',
      type: 'array',
      label: 'Mensajes de la barra promocional',
      labels: { singular: 'Mensaje', plural: 'Mensajes' },
      maxRows: 5,
      admin: {
        description: 'Aparecen rotando en la barra rosada del tope de la página',
      },
      fields: [
        {
          name: 'text',
          type: 'text',
          label: 'Mensaje',
          required: true,
        },
      ],
    },
    {
      name: 'whatsapp',
      type: 'text',
      label: 'WhatsApp',
      admin: { description: 'Número con código de país sin espacios. Ej: 525512345678' },
    },
    {
      name: 'contactEmail',
      type: 'email',
      label: 'Correo de contacto público',
      admin: { description: 'El que verán los clientes en la sección de contacto' },
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Teléfono',
      admin: { description: 'Ej: 55 1234 5678' },
    },
    {
      name: 'businessHours',
      type: 'textarea',
      label: 'Horario de atención',
      admin: { description: 'Ej: Lunes a viernes, 9:00 – 18:00 h' },
    },
    {
      name: 'shippingNotes',
      type: 'textarea',
      label: 'Información de envío (página de producto)',
      admin: {
        description:
          'Una línea por dato. Aparece en el acordeón "Envío y devoluciones" de cada producto. Ej: Envío estándar 3–5 días hábiles ($150 MXN)',
      },
    },
    {
      name: 'socialInstagram',
      type: 'text',
      label: 'Instagram',
      admin: { description: 'URL completa. Ej: https://instagram.com/rebozosmary' },
    },
    {
      name: 'socialFacebook',
      type: 'text',
      label: 'Facebook',
      admin: { description: 'URL completa. Ej: https://facebook.com/rebozosmary' },
    },
    {
      name: 'socialTiktok',
      type: 'text',
      label: 'TikTok',
      admin: { description: 'URL completa. Ej: https://tiktok.com/@rebozosmary' },
    },
    {
      name: 'socialPinterest',
      type: 'text',
      label: 'Pinterest',
      admin: { description: 'URL completa. Ej: https://pinterest.com/rebozosmary' },
    },
    {
      name: 'sizeGuide',
      type: 'array',
      label: 'Guía de tallas',
      labels: { singular: 'Talla', plural: 'Tallas' },
      admin: {
        description: 'Tabla que aparece en el modal "¿Cómo elegir mi talla?" en cada producto',
      },
      fields: [
        { name: 'label', type: 'text', label: 'Nombre de la talla', required: true },
        {
          name: 'dimensions',
          type: 'text',
          label: 'Dimensiones',
          admin: { description: 'Ej: 60 × 180 cm' },
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Ideal para',
          admin: { description: 'Ej: Usar como bufanda o chal ligero' },
        },
      ],
    },
    {
      name: 'sizeGuideNotes',
      type: 'textarea',
      label: 'Notas de la guía de tallas',
      admin: {
        description:
          'Texto introductorio del modal. Ej: Todos nuestros rebozos se miden de punta a punta extendidos.',
      },
    },
    {
      name: 'expressShippingCost',
      type: 'number',
      label: 'Costo de envío express (MXN)',
      admin: { description: 'Ej: 350. Dejar en 0 para desactivar la opción express.' },
      defaultValue: 0,
    },
    {
      name: 'expressShippingDays',
      type: 'text',
      label: 'Tiempo de entrega express',
      admin: { description: 'Ej: 1–2 días hábiles' },
      defaultValue: '1–2 días hábiles',
    },
  ],
}
