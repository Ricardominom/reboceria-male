import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Products } from './collections/Products'
import { Orders } from './collections/Orders'
import { cloudinaryStorage } from 'payloadcms-storage-cloudinary'
import { HomeSettings } from './globals/HomeSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      graphics: {
        Logo: '@/components/admin/AdminLogo',
        Icon: '@/components/admin/AdminIcon',
      },
      providers: ['@/components/admin/AdminProvider'],
      beforeNavLinks: ['@/components/admin/ThemeToggle'],
      beforeLogin: ['@/components/admin/BeforeLogin'],
    },
  },
  collections: [Users, Media, Products, Orders],
  globals: [HomeSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  sharp,
  i18n: {
    fallbackLanguage: 'en',
    translations: {
      en: {
        authentication: {
          login: 'Iniciar sesión',
          emailOrUsername: 'Correo electrónico',
          password: 'Contraseña',
          forgotPassword: '¿Olvidaste tu contraseña?',
          forgotPasswordQuestion: '¿Olvidaste tu contraseña?',
          forgotPasswordEmailInstructions:
            'Ingresa tu correo y te enviaremos instrucciones para restablecer tu contraseña.',
          resetPassword: 'Restablecer contraseña',
          newPassword: 'Nueva contraseña',
          confirmPassword: 'Confirmar contraseña',
          backToLogin: 'Volver al inicio de sesión',
          loggedOut: 'Sesión cerrada correctamente.',
          successfullyLoggedIn: 'Sesión iniciada correctamente.',
        },
        fields: {
          collapseAll: 'Contraer todo',
          showAll: 'Mostrar todo',
          addLabel: 'Agregar {{label}}',
          moreOptions: 'Más opciones',
        },
        upload: {
          filename: 'Nombre de archivo',
          filesize: 'Tamaño',
          width: 'Ancho',
          height: 'Alto',
          addFile: 'Agregar archivo',
          dragAndDrop: 'Arrastra y suelta o',
          selectFile: 'selecciona un archivo',
          pasteURL: 'Pegar URL',
          uploadFile: 'Subir archivo',
        },
        general: {
          dashboard: 'Panel de control',
          welcome: 'Bienvenida',
          submit: 'Enviar',
          save: 'Guardar',
          cancel: 'Cancelar',
          delete: 'Eliminar',
          confirm: 'Confirmar',
          edit: 'Editar',
          search: 'Buscar',
          loading: 'Cargando...',
          noResults: 'Sin resultados',
          create: 'Crear',
          filters: 'Filtros',
          of: 'de',
          collections: 'Contenido',
          globals: 'Configuración',
          createNew: 'Crear',
          columns: 'Columnas',
          updatedAt: 'Actualizado',
          createdAt: 'Creado',
          searchBy: 'Buscar por {{label}}',
          perPage: 'Por página',
          rowsPerPage: 'Por página',
          editingLabel: 'Editando',
          editAll: 'Editar lista',
          collapseAll: 'Contraer todo',
          showAll: 'Mostrar todo',
          addLabel: 'Agregar',
        },
      },
    },
  },
  plugins: [
    cloudinaryStorage({
      collections: {
        media: true,
      },
      cloudinaryConfig: {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      },
      folder: process.env.CLOUDINARY_FOLDER,
    }),
  ],
})
