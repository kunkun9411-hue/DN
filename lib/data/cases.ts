export type ProjectCase = {
  slug: string;
  image: string;
  type: string;
  status: string;
  de: { title: string; summary: string; result: string; tags: string[] };
  en: { title: string; summary: string; result: string; tags: string[] };
};

export const projectCases: ProjectCase[] = [
  {
    slug: 'metin2-ui-reforge',
    image: '/assets/duonerds-hero-pro.png',
    type: 'Metin2 / UI & Client',
    status: 'Interne Arbeitsprobe',
    de: { title: 'Legacy-UI in klare Bausteine Ã¼bersetzen', summary: 'Wie aus gewachsenen Fenster- und DatenvertrÃ¤gen ein modernisierbarer Client-Bereich wird.', result: 'Strukturierte UI-Schicht, sichtbare Grenzen zwischen Client und Server und ein Migrationsweg, der bestehende Ymir-VertrÃ¤ge respektiert.', tags: ['Python 2.7 / Ymir', 'UI-Architektur', 'Staged Migration'] },
    en: { title: 'Turning legacy UI into clear building blocks', summary: 'How a grown client and its data contracts become a surface that can be modernized safely.', result: 'A structured UI layer, visible client/server boundaries and a migration path that respects existing Ymir contracts.', tags: ['Python 2.7 / Ymir', 'UI architecture', 'Staged migration'] },
  },
  {
    slug: 'palworld-runtime-tooling',
    image: '/assets/duonerds-systems-world.png',
    type: 'Palworld / Runtime Tools',
    status: 'Modul-Arbeitsprobe',
    de: { title: 'Runtime sichtbar machen, bevor es kritisch wird', summary: 'Ein Werkzeug-Ansatz fÃ¼r Mods, Configs und Statussignale im echten Serveralltag.', result: 'Klare Deploy-Marker, begrenzte Eingriffe und nachvollziehbare Signale fÃ¼r Debugging, Versionen und sichere Ãœbergaben.', tags: ['UE4SS', 'Statussignale', 'Config & Deploy'] },
    en: { title: 'Make runtime visible before it becomes critical', summary: 'A tooling approach for mods, configs and status signals in real server operations.', result: 'Clear deployment markers, bounded interventions and traceable signals for debugging, versions and safe handover.', tags: ['UE4SS', 'Status signals', 'Config & deploy'] },
  },
  {
    slug: 'duonerds-customer-portal',
    image: '/assets/duonerds-service-map.png',
    type: 'Web / Portal Foundation',
    status: 'DuoNerds Eigenprojekt',
    de: { title: 'Kundenarbeit nicht in ChatverlÃ¤ufen verlieren', summary: 'Ein Kundenportal fÃ¼r Tickets, Systemfreigaben und klare ZustÃ¤ndigkeiten.', result: 'Ein ernsthaftes GrundgerÃ¼st mit Kundenbereich, Admin-FlÃ¤che, Rollenmodell und RLS-Migration â€“ bereit fÃ¼r die echte Backend-Verbindung.', tags: ['Next.js', 'Supabase / RLS', 'Tickets & Access'] },
    en: { title: 'Do not lose customer work in chat history', summary: 'A customer portal for tickets, system access and clear ownership.', result: 'A serious foundation with customer and admin areas, role model and RLS migration â€“ ready for the real backend connection.', tags: ['Next.js', 'Supabase / RLS', 'Tickets & access'] },
  },
];

export const projectCaseBySlug = Object.fromEntries(projectCases.map((project) => [project.slug, project])) as Record<string, ProjectCase>;

