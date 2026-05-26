import type { Metadata } from 'next'
import { Nunito, Lora } from 'next/font/google'
import './styles.css'
import Navbar from '@/components/Navbar'
import CartDrawer from '@/components/CartDrawer'
import Footer from '@/components/Footer'

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
})

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
  style: ['normal', 'italic'],
})

export const metadata: Metadata = {
  title: 'Rebozos Mary — Artesanías Mexicanas',
  description:
    'Rebozos artesanales tejidos a mano por artesanas mexicanas. Envío a toda la República.',
}

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${nunito.variable} ${lora.variable}`}>
      <body>
        <Navbar />
        <CartDrawer />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
