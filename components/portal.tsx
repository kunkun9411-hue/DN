'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  BadgeCheck,
  Boxes,
  CheckCircle2,
  ChevronRight,
  CircleUserRound,
  Clock3,
  ExternalLink,
  FolderKanban,
  KeyRound,
  LockKeyhole,
  LogIn,
  Mail,
  MessageSquareText,
  MoreHorizontal,
  Plus,
  ShieldCheck,
  Ticket,
  Users,
} from 'lucide-react';
import { getSupabaseBrowserClient, isSupabaseConfigured } from '@/lib/supabase';

type PortalSystem = { slug: string; name: string; category: string; description: string; status: 'pending' | 'active' | 'paused' | 'revoked'; updatedAt: string };
type PortalTicket = { id: string; subject: string; status: 'open' | 'in_progress' | 'waiting' | 'closed'; priority: 'normal' | 'high'; updatedAt: string };

type PortalShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  active?: 'overview' | 'tickets' | 'systems' | 'admin';
  children: React.ReactNode;
};

const statusLabels: Record<string, string> = {
  active: 'Aktiv',
  pending: 'PrÃ¼fung lÃ¤uft',
  paused: 'Pausiert',
  revoked: 'Entzogen',
  open: 'Offen',
  in_progress: 'In Arbeit',
  waiting: 'Wartet auf dich',
  closed: 'Abgeschlossen',
};

export function PortalShell({ eyebrow, title, description, active = 'overview', children }: PortalShellProps) {
  return <main className="portal-page container-wide">
    <div className="portal-intro">
      <div>
        <p className="eyebrow"><CircleUserRound size={14} /> {eyebrow}</p>
        <h1>{title}</h1>
        <p className="portal-lead">{description}</p>
      </div>
      <div className="portal-trust"><ShieldCheck size={17} /><span>GeschÃ¼tzter Bereich<br /><strong>Nur fÃ¼r dein Projekt</strong></span></div>
    </div>
    <div className="portal-layout">
      <aside className="portal-sidebar">
        <div className="portal-sidebar-label">Arbeitsbereich</div>
        <nav className="portal-nav" aria-label="Portalnavigation">
          <Link className={active === 'overview' ? 'active' : ''} href="/dashboard"><FolderKanban size={16} /> Ãœbersicht</Link>
          <Link className={active === 'tickets' ? 'active' : ''} href="/dashboard/tickets"><Ticket size={16} /> Meine Tickets</Link>
          <Link className={active === 'systems' ? 'active' : ''} href="/dashboard/systeme"><Boxes size={16} /> Freigaben & Systeme</Link>
          <Link className={active === 'admin' ? 'active' : ''} href="/admin"><ShieldCheck size={16} /> Administration</Link>
        </nav>
        <div className="portal-sidebar-foot"><span className="status-dot" /> DuoNerds Support<br /><small>Antwort in der Regel innerhalb eines Werktags.</small></div>
      </aside>
      <section className="portal-content">{children}</section>
    </div>
  </main>;
}

export function SetupNotice() {
  return <div className="portal-setup-notice">
    <div className="portal-setup-icon"><LockKeyhole size={18} /></div>
    <div><strong>Portal-Backend wird eingerichtet</strong><p>Die OberflÃ¤che und die Rechte-Struktur stehen. FÃ¼r echte Konten wird noch das Supabase-Projekt verbunden â€“ bis dahin bleibt diese Vorschau sicher ohne Demo-Zugangsdaten.</p></div>
    <Link className="text-link" href="/datenschutz">Datenschutz <ArrowRight size={14} /></Link>
  </div>;
}

export function PortalUnavailable({ area = 'Portal' }: { area?: string }) {
  return <main className="portal-page container-wide"><div className="portal-locked"><span className="portal-locked-icon"><LockKeyhole size={22} /></span><span className="eyebrow">DuoNerds / {area}</span><h1>Dieser Bereich ist noch nicht Ã¶ffentlich freigeschaltet.</h1><p>Die Portal-OberflÃ¤che ist vorbereitet, aber noch nicht mit einem echten Backend verbunden. Deshalb zeigen wir hier bewusst keine Beispielkonten, Tickets oder internen Daten.</p><div className="hero-actions"><Link className="button-duo button-primary" href="/login">Zum Login <ArrowRight size={15} /></Link><Link className="button-duo button-ghost" href="/#kontakt">Frage stellen <MessageSquareText size={15} /></Link></div></div></main>;
}

export function AuthForm({ mode }: { mode: 'login' | 'register' }) {
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError('');
    setMessage('');
    if (!supabase) {
      setMessage('Die Verbindung zum Portal-Backend fehlt noch. Sobald der Supabase-SchlÃ¼ssel hinterlegt ist, funktioniert dieser Zugang live.');
      setBusy(false);
      return;
    }
    const result = mode === 'login'
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password, options: { data: { display_name: name } } });
    if (result.error) setError(result.error.message);
    else if (mode === 'register' && !result.data.session) setMessage('Fast geschafft. Bitte bestÃ¤tige zuerst deine E-Mail-Adresse.');
    else router.push('/dashboard');
    setBusy(false);
  }

  return <div className="auth-layout container-wide">
    <div className="auth-pitch">
      <p className="eyebrow"><KeyRound size={14} /> DuoNerds Portal</p>
      <h1>{mode === 'login' ? 'Alles zu deinem Projekt. An einem Ort.' : 'Dein Projektbereich startet hier.'}</h1>
      <p className="portal-lead">Tickets, Freigaben, Dateien und nÃ¤chste Schritte â€“ sauber sortiert und nur fÃ¼r dich und dein Projektteam sichtbar.</p>
      <div className="auth-proof-list"><span><CheckCircle2 size={16} /> Klare ProjektÃ¼bersicht</span><span><CheckCircle2 size={16} /> Direkter Support-Kanal</span><span><CheckCircle2 size={16} /> Freigaben nachvollziehbar verwaltet</span></div>
    </div>
    <div className="auth-card">
      <div className="auth-card-head"><span className="auth-card-icon"><LogIn size={18} /></span><div><p className="eyebrow">{mode === 'login' ? 'Willkommen zurÃ¼ck' : 'Neues Konto'}</p><h2>{mode === 'login' ? 'Einloggen' : 'Registrieren'}</h2></div></div>
      <form onSubmit={submit} className="portal-form">
        {mode === 'register' && <label>Dein Name<input value={name} onChange={(event) => setName(event.target.value)} placeholder="z. B. Alex / Projektname" required /></label>}
        <label>E-Mail-Adresse<div className="input-with-icon"><Mail size={15} /><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="du@beispiel.de" required /></div></label>
        <label>Passwort<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Mindestens 8 Zeichen" minLength={8} required /></label>
        {error && <p className="form-message form-error">{error}</p>}
        {message && <p className="form-message form-info">{message}</p>}
        <button className="button-duo button-primary portal-submit" type="submit" disabled={busy}>{busy ? 'Einen Moment â€¦' : mode === 'login' ? 'Zum Portal' : 'Konto anlegen'} <ArrowRight size={15} /></button>
      </form>
      <p className="auth-switch">{mode === 'login' ? 'Noch kein Konto?' : 'Schon registriert?'} <Link href={mode === 'login' ? '/registrieren' : '/login'}>{mode === 'login' ? 'Jetzt anfragen' : 'Einloggen'}</Link></p>
      <p className="auth-note"><LockKeyhole size={13} /> Deine Zugangsdaten werden nicht an Discord weitergegeben.</p>
    </div>
  </div>;
}

function Metric({ label, value, note, icon }: { label: string; value: string; note: string; icon: React.ReactNode }) {
  return <div className="portal-metric"><span className="portal-metric-icon">{icon}</span><span className="portal-metric-label">{label}</span><strong>{value}</strong><small>{note}</small></div>;
}

function StatusPill({ status }: { status: string }) {
  return <span className={`status-pill status-${status}`}><span /> {statusLabels[status] ?? status}</span>;
}

export function CustomerDashboard() {
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();
  const [systems, setSystems] = useState<PortalSystem[]>([]);
  const [tickets, setTickets] = useState<PortalTicket[]>([]);
  const [displayName, setDisplayName] = useState('Projekt Nordwind');
  const [loading, setLoading] = useState(Boolean(supabase));
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    if (!supabase) return;
    const client = supabase;
    let mounted = true;
    async function load() {
      const { data: userData } = await client.auth.getUser();
      if (!userData.user) { router.replace('/login'); return; }
      const [profileResult, systemsResult, ticketsResult] = await Promise.all([
        client.from('profiles').select('display_name').eq('id', userData.user.id).single(),
        client.from('user_systems').select('status, updated_at, systems(slug, name, category, description)').eq('user_id', userData.user.id),
        client.from('tickets').select('id, subject, status, priority, updated_at').eq('user_id', userData.user.id).order('updated_at', { ascending: false }).limit(5),
      ]);
      if (!mounted) return;
      if (profileResult.error && profileResult.error.code !== 'PGRST116') setAuthError(profileResult.error.message);
      if (profileResult.data?.display_name) setDisplayName(profileResult.data.display_name);
      if (!systemsResult.error && systemsResult.data) {
        const rows = systemsResult.data as unknown as Array<{ status: PortalSystem['status']; updated_at: string; systems: Omit<PortalSystem, 'status' | 'updatedAt'> | null }>;
        setSystems(rows.filter((row) => row.systems).map((row) => ({ ...row.systems!, status: row.status, updatedAt: new Date(row.updated_at).toLocaleDateString('de-DE') })));
      }
      if (!ticketsResult.error && ticketsResult.data) {
        setTickets((ticketsResult.data as unknown as Array<{ id: string; subject: string; status: PortalTicket['status']; priority: PortalTicket['priority']; updated_at: string }>).map((ticket) => ({ ...ticket, updatedAt: new Date(ticket.updated_at).toLocaleDateString('de-DE') })));
      }
      setLoading(false);
    }
    void load();
    return () => { mounted = false; };
  }, [router, supabase]);

  async function logout() {
    if (supabase) await supabase.auth.signOut();
    router.push('/login');
  }

  const activeSystems = useMemo(() => systems.filter((system) => system.status === 'active').length, [systems]);
  if (!supabase) return <PortalUnavailable area="Kundenbereich" />;
  if (loading) return <main className="portal-page container-wide"><div className="portal-loading">Portal wird geladen â€¦</div></main>;

  return <PortalShell eyebrow="Kundenbereich" title={`Moin, ${displayName}.`} description="Hier siehst du, was gerade lÃ¤uft, welche Systeme freigegeben sind und wo wir als NÃ¤chstes ansetzen." active="overview">
    {!isSupabaseConfigured && <SetupNotice />}
    {authError && <p className="form-message form-error">Backend-Antwort: {authError}</p>}
    <div className="portal-toolbar"><div><span className="portal-kicker">ProjektÃ¼bersicht</span><p>Zuletzt synchronisiert vor wenigen Augenblicken</p></div><div className="portal-toolbar-actions"><button className="button-duo button-ghost" onClick={logout}>Abmelden</button><Link className="button-duo button-primary" href="/dashboard/tickets">Ticket erstellen <Plus size={15} /></Link></div></div>
    <div className="portal-metrics"><Metric label="Aktive Systeme" value={`${activeSystems}`} note="fÃ¼r dein Team verfÃ¼gbar" icon={<Boxes size={17} />} /><Metric label="Offene Tickets" value={`${tickets.filter((ticket) => ticket.status !== 'closed').length}`} note="mit aktuellem Verlauf" icon={<Ticket size={17} />} /><Metric label="Support-Status" value="Bereit" note="direkter Ansprechpartner" icon={<MessageSquareText size={17} />} /></div>
    <div className="portal-section-grid">
      <section className="portal-panel"><div className="panel-heading"><div><span className="portal-kicker">Systeme</span><h2>Deine Freigaben</h2></div><Link className="text-link" href="/dashboard/systeme">Alle ansehen <ArrowRight size={14} /></Link></div><div className="portal-list">{systems.map((system) => <div className="portal-list-row" key={system.slug}><span className="portal-row-icon"><Boxes size={16} /></span><div><strong>{system.name}</strong><small>{system.category} Â· {system.updatedAt}</small></div><StatusPill status={system.status} /><ChevronRight size={15} className="row-chevron" /></div>)}</div></section>
      <section className="portal-panel"><div className="panel-heading"><div><span className="portal-kicker">Kommunikation</span><h2>Letzte Tickets</h2></div><Link className="text-link" href="/dashboard/tickets">Verlauf <ArrowRight size={14} /></Link></div><div className="portal-list">{tickets.map((ticket) => <div className="portal-list-row" key={ticket.id}><span className="portal-row-icon"><Ticket size={16} /></span><div><strong>{ticket.subject}</strong><small>{ticket.id} Â· {ticket.updatedAt}</small></div><StatusPill status={ticket.status} /></div>)}</div></section>
    </div>
    <section className="portal-next-step"><div className="portal-next-icon"><Clock3 size={19} /></div><div><span className="portal-kicker">NÃ¤chster sinnvoller Schritt</span><h2>Wir halten dein Projekt in Bewegung.</h2><p>Wenn sich Anforderungen Ã¤ndern oder du eine neue Idee hast, leg einfach ein Ticket an. Wir ordnen es ein, geben dir eine klare EinschÃ¤tzung und melden uns mit dem nÃ¤chsten konkreten Schritt.</p></div><Link className="button-duo button-ghost" href="/dashboard/tickets">Zum Support <ArrowRight size={15} /></Link></section>
    <div className="portal-bottom-actions"><button className="quiet-action" onClick={logout}><LogIn size={15} /> Abmelden</button><Link className="quiet-action" href="/datenschutz"><ExternalLink size={15} /> Datenschutz</Link></div>
  </PortalShell>;
}

export function TicketsDashboard() {
  const supabase = getSupabaseBrowserClient();
  const router = useRouter();
  const [tickets, setTickets] = useState<PortalTicket[]>([]);
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');

  async function createTicket(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');
    if (!supabase) { setMessage('Das Ticket-Backend wird mit deinem Supabase-Projekt verbunden. Die Vorschau ist bereits vorbereitet.'); return; }
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) { router.push('/login'); return; }
    const result = await supabase.from('tickets').insert({ user_id: userData.user.id, subject, description }).select('id, subject, status, priority, updated_at').single();
    if (result.error) setMessage(result.error.message);
    else if (result.data) { setTickets((current) => [{ id: result.data.id, subject: result.data.subject, status: result.data.status, priority: result.data.priority, updatedAt: 'gerade eben' }, ...current]); setSubject(''); setDescription(''); setMessage('Ticket angelegt. Wir melden uns, sobald wir es eingeordnet haben.'); }
  }

  if (!supabase) return <PortalUnavailable area="Support" />;
  return <PortalShell eyebrow="Kundenbereich / Support" title="Tickets, die weiterhelfen." description="Kurze Wege, klare Antworten und ein sauberer Verlauf fÃ¼r alles, was in deinem Projekt ansteht." active="tickets">
    {!isSupabaseConfigured && <SetupNotice />}
    <div className="portal-toolbar"><div><span className="portal-kicker">Support-Verlauf</span><p>Jede Anfrage bleibt nachvollziehbar an einem Ort.</p></div><span className="portal-live-state"><span /> Support erreichbar</span></div>
    <div className="ticket-layout"><section className="portal-panel"><div className="panel-heading"><div><span className="portal-kicker">AktivitÃ¤ten</span><h2>Deine Tickets</h2></div><span className="panel-count">{tickets.length}</span></div><div className="portal-list">{tickets.map((ticket) => <div className="ticket-row" key={ticket.id}><div className="ticket-row-main"><span className="portal-row-icon"><Ticket size={16} /></span><div><strong>{ticket.subject}</strong><small>{ticket.id} Â· aktualisiert {ticket.updatedAt}</small></div></div><div className="ticket-row-meta"><span className={`priority priority-${ticket.priority}`}>{ticket.priority === 'high' ? 'PrioritÃ¤t' : 'Standard'}</span><StatusPill status={ticket.status} /><MoreHorizontal size={16} /></div></div>)}</div></section><section className="portal-panel ticket-create"><div className="panel-heading"><div><span className="portal-kicker">Neue Anfrage</span><h2>Was mÃ¶chtest du klÃ¤ren?</h2></div><MessageSquareText size={19} /></div><form className="portal-form" onSubmit={createTicket}><label>Betreff<input value={subject} onChange={(event) => setSubject(event.target.value)} placeholder="Worum geht es?" required /></label><label>Beschreibung<textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Was sollen wir wissen?" rows={5} required /></label>{message && <p className="form-message form-info">{message}</p>}<button className="button-duo button-primary portal-submit" type="submit">Anfrage senden <ArrowRight size={15} /></button></form></section></div>
  </PortalShell>;
}

export function SystemsDashboard() {
  const supabase = getSupabaseBrowserClient();
  const [systems, setSystems] = useState<PortalSystem[]>([]);
  useEffect(() => { if (!supabase) return; void supabase.auth.getUser().then(async ({ data }) => { if (!data.user) return; const result = await supabase.from('user_systems').select('status, updated_at, systems(slug, name, category, description)').eq('user_id', data.user.id); if (!result.error && result.data) { const rows = result.data as unknown as Array<{ status: PortalSystem['status']; updated_at: string; systems: Omit<PortalSystem, 'status' | 'updatedAt'> | null }>; setSystems(rows.filter((row) => row.systems).map((row) => ({ ...row.systems!, status: row.status, updatedAt: new Date(row.updated_at).toLocaleDateString('de-DE') }))); } }); }, [supabase]);
  if (!supabase) return <PortalUnavailable area="Systeme & Freigaben" />;
  return <PortalShell eyebrow="Kundenbereich / Systeme" title="Freigaben mit Ãœbersicht." description="Du siehst jederzeit, welche Bausteine aktiv sind, geprÃ¼ft werden oder gerade bewusst pausieren." active="systems">
    {!isSupabaseConfigured && <SetupNotice />}
    <div className="system-intro"><span className="system-intro-icon"><BadgeCheck size={24} /></span><div><span className="portal-kicker">Transparente Berechtigungen</span><h2>Wir schalten nur frei, was zu deinem Projekt gehÃ¶rt.</h2><p>Neue Systeme beantragst du direkt Ã¼ber den Support. Wir prÃ¼fen Kontext, Version und ZustÃ¤ndigkeit, bevor etwas im Account sichtbar wird.</p></div></div>
    <div className="system-grid">{systems.map((system) => <article className="system-card" key={system.slug}><div className="system-card-top"><span className="portal-row-icon"><Boxes size={17} /></span><StatusPill status={system.status} /></div><span className="portal-kicker">{system.category}</span><h2>{system.name}</h2><p>{system.description}</p><div className="system-card-foot"><span>Zuletzt geprÃ¼ft: {system.updatedAt}</span><Link className="text-link" href="/dashboard/tickets">Frage stellen <ArrowRight size={14} /></Link></div></article>)}</div>
  </PortalShell>;
}

export function AdminDashboard() {
  const supabase = getSupabaseBrowserClient();
  const router = useRouter();
  const [members, setMembers] = useState<Array<{ name: string; email: string; role: string; status: string; initials: string }>>([]);
  const [requests, setRequests] = useState<Array<{ name: string; system: string; requestedAt: string; initials: string }>>([]);
  const [loading, setLoading] = useState(Boolean(supabase));
  const [message, setMessage] = useState('');

  useEffect(() => { if (!supabase) return; let mounted = true; void supabase.auth.getUser().then(async ({ data }) => { if (!data.user) { router.replace('/login'); return; } const profile = await supabase.from('profiles').select('role').eq('id', data.user.id).single(); if (profile.data?.role !== 'admin' && profile.data?.role !== 'support') { router.replace('/dashboard'); return; } const [membersResult, requestResult] = await Promise.all([supabase.from('profiles').select('id, display_name, role, created_at').order('created_at', { ascending: false }).limit(10), supabase.from('user_systems').select('status, updated_at, profiles(display_name), systems(name)').eq('status', 'pending').limit(10)]); if (!mounted) return; if (!membersResult.error && membersResult.data) setMembers(membersResult.data.map((member) => ({ name: member.display_name || 'Ohne Namen', email: member.id, role: member.role === 'admin' ? 'Admin' : member.role === 'support' ? 'Support' : 'Kunde', status: 'Aktiv', initials: (member.display_name || 'DN').slice(0, 2).toUpperCase() }))); if (!requestResult.error && requestResult.data) { const rows = requestResult.data as unknown as Array<{ updated_at: string; profiles: { display_name: string } | null; systems: { name: string } | null }>; setRequests(rows.filter((row) => row.profiles && row.systems).map((row) => ({ name: row.profiles!.display_name, system: row.systems!.name, requestedAt: new Date(row.updated_at).toLocaleDateString('de-DE'), initials: row.profiles!.display_name.slice(0, 2).toUpperCase() }))); } setLoading(false); }); return () => { mounted = false; }; }, [router, supabase]);

  async function signOut() { if (supabase) await supabase.auth.signOut(); router.push('/login'); }
  if (!supabase) return <PortalUnavailable area="Administration" />;
  if (loading) return <main className="portal-page container-wide"><div className="portal-loading">Berechtigungen werden geprÃ¼ft â€¦</div></main>;
  return <PortalShell eyebrow="DuoNerds / Admin" title="Ordnung fÃ¼r jedes Projekt." description="Freigaben, Nutzer und Support bleiben an einem Ort â€“ mit nachvollziehbaren Entscheidungen statt verstreuten Nachrichten." active="admin">
    {!isSupabaseConfigured && <SetupNotice />}
    <div className="admin-banner"><div><span className="portal-kicker">Admin-Arbeitsbereich</span><h2>Heute im Fokus: 2 Freigaben prÃ¼fen.</h2><p>Die OberflÃ¤che ist auf Rollen und Audit-Logs vorbereitet. Jede Freigabe kann spÃ¤ter mit einem Grund dokumentiert werden.</p></div><button className="button-duo button-primary" onClick={() => setMessage('Die Freigabe-Aktionen werden mit der Datenbankverbindung aktiviert.')}>Freigaben Ã¶ffnen <ArrowRight size={15} /></button></div>
    {message && <p className="form-message form-info">{message}</p>}
    <div className="portal-metrics"><Metric label="Kundenkonten" value={`${members.length}`} note="im Arbeitsbereich" icon={<Users size={17} />} /><Metric label="Offene Freigaben" value={`${requests.length}`} note="warten auf PrÃ¼fung" icon={<BadgeCheck size={17} />} /><Metric label="Support-Level" value="Aktiv" note="Team erreichbar" icon={<ShieldCheck size={17} />} /></div>
    <div className="portal-section-grid"><section className="portal-panel"><div className="panel-heading"><div><span className="portal-kicker">Zugriffsanfragen</span><h2>Freigaben prÃ¼fen</h2></div><Link className="text-link" href="/dashboard/systeme">Systeme <ArrowRight size={14} /></Link></div><div className="portal-list">{requests.map((request) => <div className="portal-list-row" key={`${request.name}-${request.system}`}><span className="avatar-small">{request.initials}</span><div><strong>{request.name}</strong><small>{request.system} Â· {request.requestedAt}</small></div><button className="mini-action" onClick={() => setMessage('Aktion bereit: nach Backend-Verbindung wird die Freigabe gespeichert.')}>PrÃ¼fen</button></div>)}</div></section><section className="portal-panel"><div className="panel-heading"><div><span className="portal-kicker">Konten</span><h2>Team & Kunden</h2></div><Users size={18} /></div><div className="portal-list">{members.map((member) => <div className="portal-list-row" key={member.email}><span className="avatar-small">{member.initials}</span><div><strong>{member.name}</strong><small>{member.email}</small></div><span className="member-role">{member.role}</span><span className="member-state">{member.status}</span></div>)}</div></section></div>
    <div className="portal-bottom-actions"><button className="quiet-action" onClick={signOut}><LogIn size={15} /> Abmelden</button><span className="quiet-action"><ShieldCheck size={15} /> Aktionen werden protokolliert</span></div>
  </PortalShell>;
}

