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
import { Colors } from './collections/Colors'
import { Categories } from './collections/Categories'
import { cloudinaryStorage } from 'payloadcms-storage-cloudinary'
import { HomeSettings } from './globals/HomeSettings'
import { es } from '@payloadcms/translations/languages/es'
import { StoreSettings } from './globals/StoreSettings'
import { GuiaSettings } from './globals/GuiaSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      icons: [{ url: '/img/LOGO-REB-03.png' }],
    },
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
    avatar: {
      Component: '@/components/admin/Avatar',
    },
  },
  collections: [Categories, Colors, Users, Media, Products, Orders],
  globals: [HomeSettings, StoreSettings, GuiaSettings],
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
    fallbackLanguage: 'es',
    supportedLanguages: { es },
    translations: {
      es: {
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
        general: {
          dashboard: 'Panel de control',
          welcome: 'Bienvenida',
          collections: 'Contenido',
          globals: 'Configuración',
          createNew: 'Crear nuevo',
          creatingNewLabel: 'Nuevo {{label}}',
          untitled: 'Sin título',
          noLabel: '<Sin {{label}}>',
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
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
        api_key: process.env.CLOUDINARY_API_KEY!,
        api_secret: process.env.CLOUDINARY_API_SECRET!,
      },
      folder: process.env.CLOUDINARY_FOLDER,
    }),
  ],
})
