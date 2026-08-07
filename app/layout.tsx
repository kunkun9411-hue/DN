import type { Metadata } from 'next';
import './globals.css';
import { CookieBanner, SiteFooter, SiteHeader } from '@/components/site-layout';
import { Providers } from '@/components/providers';

export const metadata: Metadata = {
  metadataBase: new URL('https://duonerds.online'),
  title: { default: 'DuoNerds — Game-Tech für Ideen, die weitergehen', template: '%s — DuoNerds' },
  description: 'DuoNerds entwickelt flexible Game-Tech-Services, Mods, Systeme, Plugins, Tools und Websites für Metin2, Palworld, Minecraft und individuelle Projekte.',
  keywords: ['DuoNerds', 'Metin2 Systeme', 'Palworld Mods', 'Minecraft Plugins', 'Game-Tech', 'Discord Tools'],
  openGraph: { title: 'DuoNerds — Game-Tech Studio', description: 'Game-Systeme, Mods, Plugins, Websites und Tools.', url: 'https://duonerds.online', siteName: 'DuoNerds', type: 'website' },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="de"><body><Providers><div className="site-shell"><div className="noise" /><SiteHeader />{children}<SiteFooter /><CookieBanner /></div></Providers></body></html>;
}
