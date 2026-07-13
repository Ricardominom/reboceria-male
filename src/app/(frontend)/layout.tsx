import type { Metadata } from 'next'
import { Nunito, Lora, Playfair_Display, Montserrat } from 'next/font/google'
import './styles.css'
import Navbar from '@/components/Navbar'
import CartDrawer from '@/components/CartDrawer'
import Footer from '@/components/Footer'
import { getPayload } from 'payload'
import config from '@/payload.config'
import WhatsAppButton from '@/components/WhatsAppButton'
import { Analytics } from '@vercel/analytics/react'
import Script from 'next/script'

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
  const whatsapp = settings.whatsapp ?? undefined
  const social = {
    instagram: settings.socialInstagram ?? undefined,
    facebook: settings.socialFacebook ?? undefined,
    tiktok: settings.socialTiktok ?? undefined,
    pinterest: settings.socialPinterest ?? undefined,
  }

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
      <head>
        {process.env.NEXT_PUBLIC_GTM_ID && (
          <Script
            id="gtm-head"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GTM_ID}');`,
            }}
          />
        )}
      </head>
      <body>
        {process.env.NEXT_PUBLIC_GTM_ID && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GTM_ID}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        )}
        <Navbar promoMessages={promoMessages} tiposNav={tiposNav} />
        <CartDrawer />
        <main>{children}</main>
        <Footer social={social} />
        <WhatsAppButton whatsapp={whatsapp} />
        <Analytics />
      </body>
    </html>
  )
}
