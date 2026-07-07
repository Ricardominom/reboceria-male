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
  ],
}
