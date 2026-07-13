import type { MetadataRoute } from 'next'
import { getPayload } from 'payload'
import config from '@/payload.config'

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '')

  const payload = await getPayload({ config: await config })

  const [{ docs: products }, { docs: categories }] = await Promise.all([
    payload.find({ collection: 'products', limit: 1000, depth: 0 }),
    payload.find({ collection: 'categories', limit: 100, depth: 0 }),
  ])

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${baseUrl}/catalog`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/guia`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/contacto`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/faq`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/devoluciones`, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${baseUrl}/privacidad`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/terminos`, changeFrequency: 'yearly', priority: 0.3 },
  ]

  const productPages: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${baseUrl}/products/${p.slug}`,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const guiaPages: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${baseUrl}/guia/${toSlug(c.name)}`,
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  return [...staticPages, ...productPages, ...guiaPages]
}
