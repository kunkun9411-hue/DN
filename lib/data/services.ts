export type ServiceKey = 'metin2' | 'palworld' | 'minecraft' | 'tools';

export type Service = {
  key: ServiceKey;
  href: string;
  icon: string;
  image: string;
  de: { tag: string; title: string; text: string; bullets: string[] };
  en: { tag: string; title: string; text: string; bullets: string[] };
};

export const services: Service[] = [
  { key: 'metin2', href: '/metin2', icon: 'swords', image: '/assets/duonerds-hero-pro.png', de: { tag: 'Metin2 / Systeme', title: 'Metin2 Systeme, UI und saubere Migration', text: 'Wir helfen dir bei bestehenden Clients, Server-Systemen, UI-Modernisierung und technischen Übergängen.', bullets: ['UI und Client-Logik', 'Server-Systeme und Datenverträge', 'Schrittweise Migration'] }, en: { tag: 'Metin2 / Systems', title: 'Metin2 systems, UI and careful migration', text: 'We help with existing clients, server systems, UI modernization and technical transitions.', bullets: ['UI and client logic', 'Server systems and data contracts', 'Staged migration'] } },
  { key: 'palworld', href: '/palworld', icon: 'flame', image: '/assets/duonerds-systems-world.png', de: { tag: 'Palworld / Mods', title: 'Palworld Mods, Server-Helfer und Automationen', text: 'UE4SS-Mods, Statussignale, Balancing und kleine Helfer, die im echten Serveralltag bestehen.', bullets: ['UE4SS und Configs', 'Status- und Debug-Signale', 'Balancing und kleine Automationen'] }, en: { tag: 'Palworld / Mods', title: 'Palworld mods, server helpers and automations', text: 'UE4SS mods, status signals, balancing and small helpers that hold up in real server work.', bullets: ['UE4SS and configs', 'Status and debug signals', 'Balancing and small automations'] } },
  { key: 'minecraft', href: '/minecraft', icon: 'blocks', image: '/assets/duonerds-service-map.png', de: { tag: 'Minecraft / Plugins', title: 'Minecraft Plugins für Server, Events und Communities', text: 'Fokussierte Paper-, Spigot- und Velocity-Lösungen, die dein Netzwerk übersichtlicher und spielbarer machen.', bullets: ['Paper und Spigot', 'Velocity und Netzwerklogik', 'Events, Admin-Tools und Status'] }, en: { tag: 'Minecraft / Plugins', title: 'Minecraft plugins for servers, events and communities', text: 'Focused Paper, Spigot and Velocity solutions that make your network clearer and more playable.', bullets: ['Paper and Spigot', 'Velocity and network logic', 'Events, admin tools and status'] } },
  { key: 'tools', href: '/tools', icon: 'wrench', image: '/assets/duonerds-service-map.png', de: { tag: 'Web / Tools', title: 'Websites, Dashboards und Tools ohne Baustellengefühl', text: 'Landingpages, interne Helfer und kleine Systeme, die Informationen dorthin bringen, wo sie gebraucht werden.', bullets: ['Websites und Dashboards', 'CLI- und Automations-Tools', 'Kleine interne Systeme'] }, en: { tag: 'Web / Tools', title: 'Websites, dashboards and tools without the unfinished feeling', text: 'Landing pages, internal helpers and small systems that put information where it belongs.', bullets: ['Websites and dashboards', 'CLI and automation tools', 'Small internal systems'] } },
];

export const serviceByKey = Object.fromEntries(services.map((service) => [service.key, service])) as Record<ServiceKey, Service>;
