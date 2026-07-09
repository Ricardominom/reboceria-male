import type { Metadata } from 'next'
import { Nunito, Lora, Playfair_Display, Montserrat } from 'next/font/google'
import './styles.css'
import Navbar from '@/components/Navbar'
import CartDrawer from '@/components/CartDrawer'
import Footer from '@/components/Footer'
import { getPayload } from 'payload'
import config from '@/payload.config'

const nunito = Nunito({ subsets: ['latin'], variable: '--font-nunito' })
const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-montserrat' })
const lora = Lora({ subsets: ['latin'], variable: '--font-lora', style: ['normal', 'italic'] })
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  style: ['normal', 'italic'],
})

export const metadata: Metadata = {
  title: 'Rebozos Mary — Artesanías Mexicanas',
  description:
    'Rebozos artesanales tejidos a mano por artesanas mexicanas. Envío a toda la República.',
}

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  const payload = await getPayload({ config: await config })
  const settings = await payload.findGlobal({ slug: 'store-settings' })

  const promoMessages = (settings.promoMessages ?? []).map((m: any) => m.text).filter(Boolean)

  const { docs: categories } = await payload.find({
    collection: 'categories',
    limit: 20,
    sort: 'name',
    depth: 0,
  })
  const tiposNav = categories.map((c) => c.name)

  return (
    <html
      lang="es"
      className={`${nunito.variable} ${lora.variable} ${playfair.variable} ${montserrat.variable}`}
    >
      <body>
        <Navbar promoMessages={promoMessages} tiposNav={tiposNav} />
        <CartDrawer />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
