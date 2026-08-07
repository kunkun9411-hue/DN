export type PortalSystemStatus = 'pending' | 'active' | 'paused' | 'revoked';

export type PortalSystem = {
  slug: string;
  name: string;
  category: string;
  description: string;
  status: PortalSystemStatus;
  updatedAt: string;
};

export type PortalTicket = {
  id: string;
  subject: string;
  status: 'open' | 'in_progress' | 'waiting' | 'closed';
  priority: 'normal' | 'high';
  updatedAt: string;
};

export const previewSystems: PortalSystem[] = [
  { slug: 'metin2-core', name: 'Metin2 Core System', category: 'Metin2', description: 'Freigeschaltete Version mit Support-Kanal und Changelog.', status: 'active', updatedAt: 'Heute, 09:42' },
  { slug: 'palworld-toolkit', name: 'Palworld Toolkit', category: 'Palworld', description: 'Werkzeugpaket fÃ¼r Konfiguration, Monitoring und Mod-Workflows.', status: 'pending', updatedAt: 'Gestern, 16:18' },
  { slug: 'minecraft-network', name: 'Minecraft Network Tools', category: 'Minecraft', description: 'Plugin- und Netzwerkbausteine fÃ¼r deine Serverlandschaft.', status: 'paused', updatedAt: '12. Juli 2026' },
];

export const previewTickets: PortalTicket[] = [
  { id: 'DN-1048', subject: 'Deployment des neuen Metin2-Systems', status: 'in_progress', priority: 'high', updatedAt: 'vor 18 Minuten' },
  { id: 'DN-1036', subject: 'Zugriff fÃ¼r Testserver erweitern', status: 'waiting', priority: 'normal', updatedAt: 'gestern' },
  { id: 'DN-1012', subject: 'Dashboard: zusÃ¤tzliche Rollen', status: 'closed', priority: 'normal', updatedAt: '12. Juli 2026' },
];

export const previewMembers = [
  { name: 'Emre K.', email: 'emre@example.com', role: 'Admin', status: 'Aktiv', initials: 'EK' },
  { name: 'Projekt Nordwind', email: 'kunde@example.com', role: 'Kunde', status: 'Aktiv', initials: 'PN' },
  { name: 'Mara S.', email: 'mara@example.com', role: 'Support', status: 'Einladung offen', initials: 'MS' },
];

export const previewRequests = [
  { name: 'Projekt Nordwind', system: 'Palworld Toolkit', requestedAt: 'vor 2 Stunden', initials: 'PN' },
  { name: 'Studio Meridian', system: 'Minecraft Network Tools', requestedAt: 'gestern', initials: 'SM' },
];

