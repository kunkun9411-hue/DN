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
};

export const products: Product[] = [
  { id: 'metin2-ui-check', category: 'metin2', title: 'Metin2 UI Check', description: 'Verträge, Boundaries und nächste Schritte für ein bestehendes UI-Modul.', price: 'Preis auf Anfrage', duration: '1–3 Tage', image: '/assets/duonerds-hero-pro.png', featured: true, badge: 'Review', features: ['UI-Struktur prüfen', 'Client-/Server-Verträge markieren', 'Konkreten nächsten Schritt dokumentieren'], requirements: ['Bestehende UI-Dateien', 'Kurze Beschreibung des Problems'] },
  { id: 'palworld-mod-starter', category: 'palworld', title: 'Palworld Mod Starter', description: 'Ein fokussierter UE4SS-Einstieg mit Config, Statussignal und sauberer Übergabe.', price: 'ab 79 €', duration: '3–7 Tage', image: '/assets/duonerds-systems-world.png', featured: true, badge: 'Bestseller', features: ['Modul-Grundstruktur', 'Konfiguration und Logging', 'Installations- und Übergabehinweise'], requirements: ['Spielversion', 'Gewünschtes Verhalten', 'Vorhandene Mods, falls relevant'] },
  { id: 'minecraft-plugin-starter', category: 'minecraft', title: 'Minecraft Plugin Starter', description: 'Ein fokussiertes Paper-, Spigot- oder Velocity-Modul für ein klares Feature.', price: 'ab 99 €', duration: '3–10 Tage', image: '/assets/duonerds-service-map.png', features: ['Feature-Konzeption', 'Plugin-Modul', 'Test- und Konfigurationsdatei'], requirements: ['Server-Software und Version', 'Feature-Beschreibung'] },
  { id: 'launchpage-sprint', category: 'web', title: 'Launchpage Sprint', description: 'Eine responsive Landingpage mit eigener Bildwelt, Kontaktweg und sinnvoller Struktur.', price: 'ab 149 €', duration: '5–12 Tage', image: '/assets/duonerds-service-map.png', features: ['Responsive Seitenstruktur', 'Eigene Texte und Asset-Platzhalter', 'Deployment-Hinweise'], requirements: ['Branding oder Richtung', 'Inhalte und Kontaktweg'] },
  { id: 'discord-ticket-flow', category: 'bots', title: 'Discord Ticket Flow', description: 'Ein klarer Anfragefluss für Support, Produkte und individuelle Projekte.', price: 'ab 129 €', duration: '4–10 Tage', image: '/assets/duonerds-hero-pro.png', features: ['Ticket-Kategorien', 'Status- und Rollenlogik', 'Übergabe an eure Abläufe'], requirements: ['Discord-Struktur', 'Rollen und gewünschter Ablauf'] },
  { id: 'custom-infrastructure', category: 'custom', title: 'Individuelle Infrastruktur', description: 'Wenn dein Vorhaben nicht in ein Paket passt, planen wir einen sinnvollen ersten Schnitt.', price: 'Preis auf Anfrage', duration: 'nach Umfang', image: '/assets/duonerds-systems-world.png', features: ['Technische Vorprüfung', 'Modulare Roadmap', 'Begleitung bis zur Übergabe'], requirements: ['Projektziel', 'Aktueller Stand', 'Gewünschter Zeitraum'] },
];

export const categoryLabels: Record<ProductCategory, { de: string; en: string }> = {
  metin2: { de: 'Metin2 Systems', en: 'Metin2 systems' },
  palworld: { de: 'Palworld Mods', en: 'Palworld mods' },
  minecraft: { de: 'Minecraft Plugins', en: 'Minecraft plugins' },
  web: { de: 'Web & Dashboards', en: 'Web & dashboards' },
  bots: { de: 'Discord & Bots', en: 'Discord & bots' },
  custom: { de: 'Custom Infrastructure', en: 'Custom infrastructure' },
};
