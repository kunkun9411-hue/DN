import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://duonerds.online';
  const paths = ['', '/metin2', '/palworld', '/minecraft', '/tools', '/shop', '/calculator', '/services/game-servers', '/services/minecraft', '/services/web-development', '/services/bots-tools', '/datenschutz'];
  return paths.map((path) => ({ url: `${base}${path}/`, lastModified: new Date('2026-08-07'), changeFrequency: 'monthly', priority: path === '' ? 1 : .7 }));
}
