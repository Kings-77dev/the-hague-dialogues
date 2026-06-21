import type {MetadataRoute} from 'next'
import {client} from '@/sanity/client'
import {SITEMAP_SLUGS_QUERY} from '@/sanity/queries'
import {SITE_URL} from '@/lib/site'

const STATIC_ROUTES: {path: string; priority: number}[] = [
  {path: '/', priority: 1.0},
  {path: '/about', priority: 0.8},
  {path: '/events', priority: 0.9},
  {path: '/news', priority: 0.9},
  {path: '/media', priority: 0.8},
  {path: '/get-involved', priority: 0.7},
  {path: '/contact', priority: 0.6},
]

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const data = await client.fetch(SITEMAP_SLUGS_QUERY)
  const now = new Date()

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map(({path, priority}) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority,
  }))

  const eventEntries: MetadataRoute.Sitemap = data.events.map((e) => ({
    url: `${SITE_URL}/events/${e.slug}`,
    lastModified: new Date(e._updatedAt),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  const articleEntries: MetadataRoute.Sitemap = data.articles.map((a) => ({
    url: `${SITE_URL}/news/${a.slug}`,
    lastModified: new Date(a._updatedAt),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [...staticEntries, ...eventEntries, ...articleEntries]
}
