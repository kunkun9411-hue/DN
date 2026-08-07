export type ProductCategory = 'metin2' | 'palworld' | 'minecraft' | 'web' | 'bots' | 'custom';

export type Product = {
  id: string;
  category: ProductCategory;
  title: string;
  description: string;
  price: string;
  duration: string;
  featured?: boolean;
  badge?: string;
  image: string;
  features: string[];
  requirements: string[];
  images?: string[];
};

export const products: Product[] = [
  { id: 'metin2-ui-check', category: 'metin2', title: 'Metin2 UI Check', description: 'VertrÃ¤ge, Boundaries und nÃ¤chste Schritte fÃ¼r ein bestehendes UI-Modul.', price: 'Preis auf Anfrage', duration: '1â€“3 Tage', image: '/assets/duonerds-hero-pro.png', images: ['/assets/duonerds-hero-pro.png', '/assets/duonerds-service-map.png'], featured: true, badge: 'Review', features: ['UI-Struktur prÃ¼fen', 'Client-/Server-VertrÃ¤ge markieren', 'Konkreten nÃ¤chsten Schritt dokumentieren'], requirements: ['Bestehende UI-Dateien', 'Kurze Beschreibung des Problems'] },
  { id: 'palworld-mod-starter', category: 'palworld', title: 'Palworld Mod Starter', description: 'Ein fokussierter UE4SS-Einstieg mit Config, Statussignal und sauberer Ãœbergabe.', price: 'ab 79 â‚¬', duration: '3â€“7 Tage', image: '/assets/duonerds-systems-world.png', images: ['/assets/duonerds-systems-world.png', '/assets/duonerds-hero-pro.png'], featured: true, badge: 'Starter', features: ['Modul-Grundstruktur', 'Konfiguration und Logging', 'Installations- und Ãœbergabehinweise'], requirements: ['Spielversion', 'GewÃ¼nschtes Verhalten', 'Vorhandene Mods, falls relevant'] },
  { id: 'minecraft-plugin-starter', category: 'minecraft', title: 'Minecraft Plugin Starter', description: 'Ein fokussiertes Paper-, Spigot- oder Velocity-Modul fÃ¼r ein klares Feature.', price: 'ab 99 â‚¬', duration: '3â€“10 Tage', image: '/assets/duonerds-service-map.png', images: ['/assets/duonerds-service-map.png', '/assets/duonerds-systems-world.png'], features: ['Feature-Konzeption', 'Plugin-Modul', 'Test- und Konfigurationsdatei'], requirements: ['Server-Software und Version', 'Feature-Beschreibung'] },
  { id: 'launchpage-sprint', category: 'web', title: 'Launchpage Sprint', description: 'Eine responsive Landingpage mit eigener Bildwelt, Kontaktweg und sinnvoller Struktur.', price: 'ab 149 â‚¬', duration: '5â€“12 Tage', image: '/assets/duonerds-service-map.png', images: ['/assets/duonerds-service-map.png', '/assets/duonerds-hero-pro.png'], features: ['Responsive Seitenstruktur', 'Eigene Texte und Asset-Platzhalter', 'Deployment-Hinweise'], requirements: ['Branding oder Richtung', 'Inhalte und Kontaktweg'] },
  { id: 'discord-ticket-flow', category: 'bots', title: 'Discord Ticket Flow', description: 'Ein klarer Anfragefluss fÃ¼r Support, Produkte und individuelle Projekte.', price: 'ab 129 â‚¬', duration: '4â€“10 Tage', image: '/assets/duonerds-hero-pro.png', images: ['/assets/duonerds-hero-pro.png', '/assets/duonerds-service-map.png'], features: ['Ticket-Kategorien', 'Status- und Rollenlogik', 'Ãœbergabe an eure AblÃ¤ufe'], requirements: ['Discord-Struktur', 'Rollen und gewÃ¼nschter Ablauf'] },
  { id: 'custom-infrastructure', category: 'custom', title: 'Individuelle Infrastruktur', description: 'Wenn dein Vorhaben nicht in ein Paket passt, planen wir einen sinnvollen ersten Schnitt.', price: 'Preis auf Anfrage', duration: 'nach Umfang', image: '/assets/duonerds-systems-world.png', images: ['/assets/duonerds-systems-world.png', '/assets/duonerds-service-map.png'], features: ['Technische VorprÃ¼fung', 'Modulare Roadmap', 'Begleitung bis zur Ãœbergabe'], requirements: ['Projektziel', 'Aktueller Stand', 'GewÃ¼nschter Zeitraum'] },
];

export const categoryLabels: Record<ProductCategory, { de: string; en: string }> = {
  metin2: { de: 'Metin2 Systems', en: 'Metin2 systems' },
  palworld: { de: 'Palworld Mods', en: 'Palworld mods' },
  minecraft: { de: 'Minecraft Plugins', en: 'Minecraft plugins' },
  web: { de: 'Web & Dashboards', en: 'Web & dashboards' },
  bots: { de: 'Discord & Bots', en: 'Discord & bots' },
  custom: { de: 'Custom Infrastructure', en: 'Custom infrastructure' },
};

