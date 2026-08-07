export type ServiceKey = 'metin2' | 'palworld' | 'minecraft' | 'tools' | 'bots';

export type Service = {
  key: ServiceKey;
  href: string;
  icon: string;
  image: string;
  de: { tag: string; title: string; text: string; bullets: string[] };
  en: { tag: string; title: string; text: string; bullets: string[] };
};

export const services: Service[] = [
  { key: 'metin2', href: '/metin2', icon: 'swords', image: '/assets/duonerds-hero-pro.png', de: { tag: 'Metin2 / Systeme', title: 'Metin2 Systeme, UI und saubere Migration', text: 'Wir unterstÃ¼tzen bei bestehenden Clients, Server-Systemen, UI-Modernisierung und technischen ÃœbergÃ¤ngen.', bullets: ['UI und Client-Logik', 'Server-Systeme und DatenvertrÃ¤ge', 'Schrittweise Migration'] }, en: { tag: 'Metin2 / Systems', title: 'Metin2 systems, UI and careful migration', text: 'We support existing clients, server systems, UI modernization and technical transitions.', bullets: ['UI and client logic', 'Server systems and data contracts', 'Staged migration'] } },
  { key: 'palworld', href: '/palworld', icon: 'flame', image: '/assets/duonerds-systems-world.png', de: { tag: 'Palworld / Mods', title: 'Palworld Mods, Server-Helfer und Automationen', text: 'UE4SS-Mods, Statussignale, Balancing und kleine Helfer fÃ¼r einen stabilen Serveralltag.', bullets: ['UE4SS und Configs', 'Status- und Debug-Signale', 'Balancing und kleine Automationen'] }, en: { tag: 'Palworld / Mods', title: 'Palworld mods, server helpers and automations', text: 'UE4SS mods, status signals, balancing and small helpers for a stable server routine.', bullets: ['UE4SS and configs', 'Status and debug signals', 'Balancing and small automations'] } },
  { key: 'minecraft', href: '/minecraft', icon: 'blocks', image: '/assets/duonerds-service-map.png', de: { tag: 'Minecraft / Plugins', title: 'Minecraft Plugins fÃ¼r Server, Events und Communities', text: 'Fokussierte Paper-, Spigot- und Velocity-LÃ¶sungen, die dein Netzwerk Ã¼bersichtlicher und verlÃ¤sslicher machen.', bullets: ['Paper und Spigot', 'Velocity und Netzwerklogik', 'Events, Admin-Tools und Status'] }, en: { tag: 'Minecraft / Plugins', title: 'Minecraft plugins for servers, events and communities', text: 'Focused Paper, Spigot and Velocity solutions that make your network clearer and more reliable.', bullets: ['Paper and Spigot', 'Velocity and network logic', 'Events, admin tools and status'] } },
  { key: 'tools', href: '/tools', icon: 'wrench', image: '/assets/duonerds-service-map.png', de: { tag: 'Web / Tools', title: 'Websites, Dashboards und Tools mit System', text: 'Landingpages, interne Helfer und kleine Systeme, die Informationen dorthin bringen, wo sie gebraucht werden.', bullets: ['Websites und Dashboards', 'CLI- und Automations-Tools', 'Kleine interne Systeme'] }, en: { tag: 'Web / Tools', title: 'Websites, dashboards and tools with structure', text: 'Landing pages, internal helpers and small systems that put information where it belongs.', bullets: ['Websites and dashboards', 'CLI and automation tools', 'Small internal systems'] } },
  { key: 'bots', href: '/services/bots-tools', icon: 'bots', image: '/assets/duonerds-systems-world.png', de: { tag: 'Discord / Automationen', title: 'Bots und AblÃ¤ufe, die nicht im Chat stecken bleiben', text: 'Ticket-Flows, Statusmeldungen, Rollenlogik und kleine Automationen fÃ¼r Communities und Projektteams.', bullets: ['Discord-Tickets und Rollen', 'Status- und Benachrichtigungsflows', 'Kleine Integrationen und Helfer'] }, en: { tag: 'Discord / Automations', title: 'Bots and flows that do not get lost in chat', text: 'Ticket flows, status messages, role logic and small automations for communities and project teams.', bullets: ['Discord tickets and roles', 'Status and notification flows', 'Small integrations and helpers'] } },
];

export const serviceByKey = Object.fromEntries(services.map((service) => [service.key, service])) as Record<ServiceKey, Service>;

