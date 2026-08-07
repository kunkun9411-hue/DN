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
import { discordInviteUrl } from '@/lib/contact';
import { products } from '@/lib/data/products';

type PortalSystem = { slug: string; name: string; category: string; description: string; status: 'pending' | 'active' | 'paused' | 'revoked'; updatedAt: string };
type PortalTicket = { id: string; subject: string; status: 'open' | 'in_progress' | 'waiting' | 'closed'; priority: 'normal' | 'high'; updatedAt: string };
type AdminRequest = { userId: string; systemId: string; name: string; system: string; status: PortalSystem['status']; requestedAt: string; initials: string };
type PortalProductAccess = { productId: string; grantedAt: string };
type AdminRoleMapping = { productId: string; discordRoleName: string; label: string };

const discordRoleNames = ['Owner', 'Admin', 'Mod', 'Support', 'Product Author', 'Giveaways', 'Member', 'Events', 'Bot'];

type PortalShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  active?: 'overview' | 'tickets' | 'systems' | 'admin';
  children: React.ReactNode;
};

const statusLabels: Record<string, string> = {
  active: 'Aktiv',
  pending: 'Prüfung läuft',
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
      <div className="portal-trust"><ShieldCheck size={17} /><span>Geschützter Bereich<br /><strong>Nur für dein Projekt</strong></span></div>
    </div>
    <div className="portal-layout">
      <aside className="portal-sidebar">
        <div className="portal-sidebar-label">Arbeitsbereich</div>
        <nav className="portal-nav" aria-label="Portalnavigation">
          <Link className={active === 'overview' ? 'active' : ''} href="/dashboard"><FolderKanban size={16} /> Übersicht</Link>
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
    <div><strong>Portal-Backend wird eingerichtet</strong><p>Die Oberfläche und die Rechte-Struktur stehen. Für echte Konten wird noch das Supabase-Projekt verbunden – bis dahin bleibt diese Vorschau sicher ohne Demo-Zugangsdaten.</p></div>
    <Link className="text-link" href="/datenschutz">Datenschutz <ArrowRight size={14} /></Link>
  </div>;
}

export function PortalUnavailable({ area = 'Portal' }: { area?: string }) {
  return <main className="portal-page container-wide"><div className="portal-locked"><span className="portal-locked-icon"><LockKeyhole size={22} /></span><span className="eyebrow">DuoNerds / {area}</span><h1>Dieser Bereich ist noch nicht öffentlich freigeschaltet.</h1><p>Die Portal-Oberfläche ist vorbereitet, aber noch nicht mit einem echten Backend verbunden. Deshalb zeigen wir hier bewusst keine Beispielkonten, Tickets oder internen Daten.</p><div className="hero-actions"><Link className="button-duo button-primary" href="/login">Zum Login <ArrowRight size={15} /></Link><Link className="button-duo button-ghost" href="/#kontakt">Frage stellen <MessageSquareText size={15} /></Link></div></div></main>;
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

  useEffect(() => {
    if (!supabase) return;
    let mounted = true;
    let handled = false;
    const handleSession = (session: { user: unknown } | null) => {
      if (!mounted || !session || handled) return;
      handled = true;
      if (mode === 'register' && window.sessionStorage.getItem('duonerds_discord_registration') === '1') {
        window.sessionStorage.removeItem('duonerds_discord_registration');
        window.location.assign(discordInviteUrl);
        return;
      }
      router.replace('/dashboard');
    };
    void supabase.auth.getSession().then(({ data }) => handleSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      handleSession(session);
    });
    return () => { mounted = false; listener.subscription.unsubscribe(); };
  }, [mode, router, supabase]);

  async function continueWithDiscord() {
    setBusy(true);
    setError('');
    setMessage('');
    if (!supabase) {
      setMessage('Die Verbindung zum Portal-Backend fehlt noch. Sobald Supabase hinterlegt ist, funktioniert Discord-Login live.');
      setBusy(false);
      return;
    }
    if (mode === 'register') window.sessionStorage.setItem('duonerds_discord_registration', '1');
    const result = await supabase.auth.signInWithOAuth({
      provider: 'discord',
      options: { redirectTo: `${window.location.origin}/${mode === 'register' ? 'registrieren' : 'login'}` },
    });
    if (result.error) {
      setError(result.error.message);
      setBusy(false);
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError('');
    setMessage('');
    if (!supabase) {
      setMessage('Die Verbindung zum Portal-Backend fehlt noch. Sobald der Supabase-Schlüssel hinterlegt ist, funktioniert dieser Zugang live.');
      setBusy(false);
      return;
    }
    const result = mode === 'login'
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password, options: { data: { display_name: name } } });
    if (result.error) setError(result.error.message);
    else if (mode === 'register' && !result.data.session) setMessage('Fast geschafft. Bitte bestätige zuerst deine E-Mail-Adresse.');
    else router.push('/dashboard');
    setBusy(false);
  }

  return <div className="auth-layout container-wide">
    <div className="auth-pitch">
      <p className="eyebrow"><KeyRound size={14} /> DuoNerds Portal</p>
      <h1>{mode === 'login' ? 'Alles zu deinem Projekt. An einem Ort.' : 'Dein Projektbereich startet hier.'}</h1>
      <p className="portal-lead">Tickets, Freigaben, Dateien und nächste Schritte – sauber sortiert und nur für dich und dein Projektteam sichtbar.</p>
      <div className="auth-proof-list"><span><CheckCircle2 size={16} /> Klare Projektübersicht</span><span><CheckCircle2 size={16} /> Direkter Support-Kanal</span><span><CheckCircle2 size={16} /> Freigaben nachvollziehbar verwaltet</span></div>
    </div>
    <div className="auth-card">
      <div className="auth-card-head"><span className="auth-card-icon"><LogIn size={18} /></span><div><p className="eyebrow">{mode === 'login' ? 'Willkommen zurück' : 'Neues Konto'}</p><h2>{mode === 'login' ? 'Einloggen' : 'Registrieren'}</h2></div></div>
      <button className="button-duo button-discord portal-submit" type="button" onClick={() => void continueWithDiscord()} disabled={busy}><MessageSquareText size={16} /> {mode === 'login' ? 'Mit Discord einloggen' : 'Mit Discord registrieren'} <ArrowRight size={15} /></button>
      <div className="auth-divider"><span>oder per E-Mail</span></div>
      <form onSubmit={submit} className="portal-form">
        {mode === 'register' && <label>Dein Name<input value={name} onChange={(event) => setName(event.target.value)} placeholder="z. B. Alex / Projektname" required /></label>}
        <label>E-Mail-Adresse<div className="input-with-icon"><Mail size={15} /><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="du@beispiel.de" required /></div></label>
        <label>Passwort<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Mindestens 8 Zeichen" minLength={8} required /></label>
        {error && <p className="form-message form-error">{error}</p>}
        {message && <p className="form-message form-info">{message}</p>}
        <button className="button-duo button-primary portal-submit" type="submit" disabled={busy}>{busy ? 'Einen Moment …' : mode === 'login' ? 'Zum Portal' : 'Konto anlegen'} <ArrowRight size={15} /></button>
      </form>
      <p className="auth-switch">{mode === 'login' ? 'Noch kein Konto?' : 'Schon registriert?'} <Link href={mode === 'login' ? '/registrieren' : '/login'}>{mode === 'login' ? 'Jetzt anfragen' : 'Einloggen'}</Link></p>
      <p className="auth-note"><LockKeyhole size={13} /> Discord liefert uns nur dein Basisprofil. Rollen und Produktzugriffe prüfen wir serverseitig.</p>
      {mode === 'register' && <p className="auth-note"><MessageSquareText size={13} /> Nach der Registrierung geht es direkt zu unserem Discord-Server.</p>}
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
  const [discordName, setDiscordName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [productAccess, setProductAccess] = useState<PortalProductAccess[]>([]);
  const [loading, setLoading] = useState(Boolean(supabase));
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    if (!supabase) return;
    const client = supabase;
    let mounted = true;
    async function load() {
      const { data: userData } = await client.auth.getUser();
      if (!userData.user) { router.replace('/login'); return; }
      await client.functions.invoke('sync-discord-access');
      const [profileResult, systemsResult, ticketsResult, productResult] = await Promise.all([
        client.from('profiles').select('display_name, discord_username, discord_global_name, discord_avatar_url').eq('id', userData.user.id).single(),
        client.from('user_systems').select('status, updated_at, systems(slug, name, category, description)').eq('user_id', userData.user.id),
        client.from('tickets').select('id, subject, status, priority, updated_at').eq('user_id', userData.user.id).order('updated_at', { ascending: false }).limit(5),
        client.from('user_product_access').select('product_id, granted_at').eq('user_id', userData.user.id).order('granted_at', { ascending: false }),
      ]);
      if (!mounted) return;
      if (profileResult.error && profileResult.error.code !== 'PGRST116') setAuthError(profileResult.error.message);
      if (profileResult.data?.display_name) setDisplayName(profileResult.data.discord_global_name || profileResult.data.discord_username || profileResult.data.display_name);
      if (profileResult.data?.discord_global_name || profileResult.data?.discord_username) setDiscordName(profileResult.data.discord_global_name || profileResult.data.discord_username || '');
      if (profileResult.data?.discord_avatar_url) setAvatarUrl(profileResult.data.discord_avatar_url);
      if (!systemsResult.error && systemsResult.data) {
        const rows = systemsResult.data as unknown as Array<{ status: PortalSystem['status']; updated_at: string; systems: Omit<PortalSystem, 'status' | 'updatedAt'> | null }>;
        setSystems(rows.filter((row) => row.systems).map((row) => ({ ...row.systems!, status: row.status, updatedAt: new Date(row.updated_at).toLocaleDateString('de-DE') })));
      }
      if (!ticketsResult.error && ticketsResult.data) {
        setTickets((ticketsResult.data as unknown as Array<{ id: string; subject: string; status: PortalTicket['status']; priority: PortalTicket['priority']; updated_at: string }>).map((ticket) => ({ ...ticket, updatedAt: new Date(ticket.updated_at).toLocaleDateString('de-DE') })));
      }
      if (!productResult.error && productResult.data) {
        setProductAccess((productResult.data as unknown as Array<{ product_id: string; granted_at: string }>).map((item) => ({ productId: item.product_id, grantedAt: new Date(item.granted_at).toLocaleDateString('de-DE') })));
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
  if (loading) return <main className="portal-page container-wide"><div className="portal-loading">Portal wird geladen …</div></main>;

  return <PortalShell eyebrow="Kundenbereich" title={`Moin, ${displayName}.`} description="Hier siehst du, was gerade läuft, welche Systeme freigegeben sind und wo wir als Nächstes ansetzen." active="overview">
    {!isSupabaseConfigured && <SetupNotice />}
    {authError && <p className="form-message form-error">Backend-Antwort: {authError}</p>}
    <div className="portal-toolbar"><div className="portal-user-chip">{avatarUrl ? <span className="portal-user-avatar" role="img" aria-label="Discord Avatar" style={{ backgroundImage: `url(${avatarUrl})` }} /> : <CircleUserRound size={17} />}<span><strong>{discordName || displayName}</strong><small>{discordName ? 'Discord verbunden' : 'Portal-Konto'}</small></span></div><div className="portal-toolbar-actions"><a className="button-duo button-ghost" href={discordInviteUrl} target="_blank" rel="noreferrer">Discord-Server <ExternalLink size={14} /></a><button className="button-duo button-ghost" onClick={logout}>Abmelden</button><Link className="button-duo button-primary" href="/dashboard/tickets">Ticket erstellen <Plus size={15} /></Link></div></div>
    <div className="portal-metrics"><Metric label="Aktive Systeme" value={`${activeSystems}`} note="für dein Team verfügbar" icon={<Boxes size={17} />} /><Metric label="Offene Tickets" value={`${tickets.filter((ticket) => ticket.status !== 'closed').length}`} note="mit aktuellem Verlauf" icon={<Ticket size={17} />} /><Metric label="Support-Status" value="Bereit" note="direkter Ansprechpartner" icon={<MessageSquareText size={17} />} /></div>
    <div className="portal-section-grid">
      <section className="portal-panel"><div className="panel-heading"><div><span className="portal-kicker">Systeme</span><h2>Deine Freigaben</h2></div><Link className="text-link" href="/dashboard/systeme">Alle ansehen <ArrowRight size={14} /></Link></div><div className="portal-list">{systems.map((system) => <div className="portal-list-row" key={system.slug}><span className="portal-row-icon"><Boxes size={16} /></span><div><strong>{system.name}</strong><small>{system.category} · {system.updatedAt}</small></div><StatusPill status={system.status} /><ChevronRight size={15} className="row-chevron" /></div>)}</div></section>
      <section className="portal-panel"><div className="panel-heading"><div><span className="portal-kicker">Kommunikation</span><h2>Letzte Tickets</h2></div><Link className="text-link" href="/dashboard/tickets">Verlauf <ArrowRight size={14} /></Link></div><div className="portal-list">{tickets.map((ticket) => <div className="portal-list-row" key={ticket.id}><span className="portal-row-icon"><Ticket size={16} /></span><div><strong>{ticket.subject}</strong><small>{ticket.id} · {ticket.updatedAt}</small></div><StatusPill status={ticket.status} /></div>)}</div></section>
    </div>
    <section className="portal-panel portal-products-panel"><div className="panel-heading"><div><span className="portal-kicker">Discord-Zugriffe</span><h2>Deine freigeschalteten Produkte</h2></div><BadgeCheck size={19} /></div>{productAccess.length > 0 ? <div className="portal-product-list">{productAccess.map((access) => { const product = products.find((item) => item.id === access.productId); return <div className="portal-product-row" key={access.productId}><span className="portal-row-icon"><KeyRound size={16} /></span><div><strong>{product?.title || access.productId}</strong><small>Freigeschaltet am {access.grantedAt} · Discord-Rolle</small></div><Link className="text-link" href={`/shop/${access.productId}`}>Ansehen <ArrowRight size={14} /></Link></div>; })}</div> : <div className="portal-empty-row"><KeyRound size={18} /><span>Noch keine Produkte freigeschaltet. Wir ordnen deine Discord-Rolle nach der Synchronisierung automatisch zu.</span><a className="text-link" href={discordInviteUrl} target="_blank" rel="noreferrer">Server öffnen <ExternalLink size={14} /></a></div>}</section>
    <section className="portal-next-step"><div className="portal-next-icon"><Clock3 size={19} /></div><div><span className="portal-kicker">Nächster sinnvoller Schritt</span><h2>Wir halten dein Projekt in Bewegung.</h2><p>Wenn sich Anforderungen ändern oder du eine neue Idee hast, leg einfach ein Ticket an. Wir ordnen es ein, geben dir eine klare Einschätzung und melden uns mit dem nächsten konkreten Schritt.</p></div><Link className="button-duo button-ghost" href="/dashboard/tickets">Zum Support <ArrowRight size={15} /></Link></section>
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
  const [loading, setLoading] = useState(Boolean(supabase));

  useEffect(() => {
    if (!supabase) return;
    const client = supabase;
    let mounted = true;
    async function loadTickets() {
      const { data: userData } = await client.auth.getUser();
      if (!userData.user) { router.replace('/login'); return; }
      const …934 tokens truncated…sage form-info">{message}</p>}<button className="button-duo button-primary portal-submit" type="submit">Anfrage senden <ArrowRight size={15} /></button></form></section></div>
  </PortalShell>;
}

export function SystemsDashboard() {
  const supabase = getSupabaseBrowserClient();
  const router = useRouter();
  const [systems, setSystems] = useState<PortalSystem[]>([]);
  const [loading, setLoading] = useState(Boolean(supabase));
  const [error, setError] = useState('');

  useEffect(() => {
    if (!supabase) return;
    const client = supabase;
    let mounted = true;
    async function loadSystems() {
      const { data: userData } = await client.auth.getUser();
      if (!userData.user) { router.replace('/login'); return; }
      const result = await client.from('user_systems').select('status, updated_at, systems(slug, name, category, description)').eq('user_id', userData.user.id).order('updated_at', { ascending: false });
      if (!mounted) return;
      if (result.error) setError(result.error.message);
      else if (result.data) {
        const rows = result.data as unknown as Array<{ status: PortalSystem['status']; updated_at: string; systems: Omit<PortalSystem, 'status' | 'updatedAt'> | null }>;
        setSystems(rows.filter((row) => row.systems).map((row) => ({ ...row.systems!, status: row.status, updatedAt: new Date(row.updated_at).toLocaleDateString('de-DE') })));
      }
      setLoading(false);
    }
    void loadSystems();
    return () => { mounted = false; };
  }, [router, supabase]);

  if (!supabase) return <PortalUnavailable area="Systeme & Freigaben" />;
  if (loading) return <main className="portal-page container-wide"><div className="portal-loading">Freigaben werden geladen …</div></main>;
  return <PortalShell eyebrow="Kundenbereich / Systeme" title="Freigaben mit Übersicht." description="Du siehst jederzeit, welche Bausteine aktiv sind, geprüft werden oder gerade bewusst pausieren." active="systems">
    {!isSupabaseConfigured && <SetupNotice />}
    {error && <p className="form-message form-error">Backend-Antwort: {error}</p>}
    <div className="system-intro"><span className="system-intro-icon"><BadgeCheck size={24} /></span><div><span className="portal-kicker">Transparente Berechtigungen</span><h2>Wir schalten nur frei, was zu deinem Projekt gehört.</h2><p>Neue Systeme beantragst du direkt über den Support. Wir prüfen Kontext, Version und Zuständigkeit, bevor etwas im Account sichtbar wird.</p></div></div>
    <div className="system-grid">{systems.length > 0 ? systems.map((system) => <article className="system-card" key={system.slug}><div className="system-card-top"><span className="portal-row-icon"><Boxes size={17} /></span><StatusPill status={system.status} /></div><span className="portal-kicker">{system.category}</span><h2>{system.name}</h2><p>{system.description}</p><div className="system-card-foot"><span>Zuletzt geprüft: {system.updatedAt}</span><Link className="text-link" href="/dashboard/tickets">Frage stellen <ArrowRight size={14} /></Link></div></article>) : <div className="portal-empty-row"><BadgeCheck size={18} /><span>Noch keine Systeme für dein Konto freigegeben.</span><Link className="text-link" href="/dashboard/tickets">Freigabe anfragen <ArrowRight size={14} /></Link></div>}</div>
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
  if (loading) return <main className="portal-page container-wide"><div className="portal-loading">Berechtigungen werden geprüft …</div></main>;
  return <PortalShell eyebrow="DuoNerds / Admin" title="Ordnung für jedes Projekt." description="Freigaben, Nutzer und Support bleiben an einem Ort – mit nachvollziehbaren Entscheidungen statt verstreuten Nachrichten." active="admin">
    {!isSupabaseConfigured && <SetupNotice />}
    <div className="admin-banner"><div><span className="portal-kicker">Admin-Arbeitsbereich</span><h2>Heute im Fokus: 2 Freigaben prüfen.</h2><p>Die Oberfläche ist auf Rollen und Audit-Logs vorbereitet. Jede Freigabe kann später mit einem Grund dokumentiert werden.</p></div><button className="button-duo button-primary" onClick={() => setMessage('Die Freigabe-Aktionen werden mit der Datenbankverbindung aktiviert.')}>Freigaben öffnen <ArrowRight size={15} /></button></div>
    {message && <p className="form-message form-info">{message}</p>}
    <div className="portal-metrics"><Metric label="Kundenkonten" value={`${members.length}`} note="im Arbeitsbereich" icon={<Users size={17} />} /><Metric label="Offene Freigaben" value={`${requests.length}`} note="warten auf Prüfung" icon={<BadgeCheck size={17} />} /><Metric label="Support-Level" value="Aktiv" note="Team erreichbar" icon={<ShieldCheck size={17} />} /></div>
    <div className="portal-section-grid"><section className="portal-panel"><div className="panel-heading"><div><span className="portal-kicker">Zugriffsanfragen</span><h2>Freigaben prüfen</h2></div><Link className="text-link" href="/dashboard/systeme">Systeme <ArrowRight size={14} /></Link></div><div className="portal-list">{requests.map((request) => <div className="portal-list-row" key={`${request.name}-${request.system}`}><span className="avatar-small">{request.initials}</span><div><strong>{request.name}</strong><small>{request.system} · {request.requestedAt}</small></div><button className="mini-action" onClick={() => setMessage('Aktion bereit: nach Backend-Verbindung wird die Freigabe gespeichert.')}>Prüfen</button></div>)}</div></section><section className="portal-panel"><div className="panel-heading"><div><span className="portal-kicker">Konten</span><h2>Team & Kunden</h2></div><Users size={18} /></div><div className="portal-list">{members.map((member) => <div className="portal-list-row" key={member.email}><span className="avatar-small">{member.initials}</span><div><strong>{member.name}</strong><small>{member.email}</small></div><span className="member-role">{member.role}</span><span className="member-state">{member.status}</span></div>)}</div></section></div>
    <div className="portal-bottom-actions"><button className="quiet-action" onClick={signOut}><LogIn size={15} /> Abmelden</button><span className="quiet-action"><ShieldCheck size={15} /> Aktionen werden protokolliert</span></div>
  </PortalShell>;
}

export function AdminDashboardLive() {
  const supabase = getSupabaseBrowserClient();
  const router = useRouter();
  const [members, setMembers] = useState<Array<{ name: string; email: string; role: string; status: string; initials: string }>>([]);
  const [requests, setRequests] = useState<AdminRequest[]>([]);
  const [roleMappings, setRoleMappings] = useState<AdminRoleMapping[]>([]);
  const [role, setRole] = useState<'admin' | 'support' | null>(null);
  const [loading, setLoading] = useState(Boolean(supabase));
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busyKey, setBusyKey] = useState('');
  const [mappingBusy, setMappingBusy] = useState(false);
  const [mappingProductId, setMappingProductId] = useState(products[0]?.id ?? '');
  const [mappingRoleName, setMappingRoleName] = useState('');
  const [mappingLabel, setMappingLabel] = useState('');

  useEffect(() => {
    if (!supabase) return;
    const client = supabase;
    let mounted = true;
    async function loadAdmin() {
      const { data: userData } = await client.auth.getUser();
      if (!userData.user) { router.replace('/login'); return; }
      const profile = await client.from('profiles').select('role').eq('id', userData.user.id).single();
      if (profile.error || (profile.data?.role !== 'admin' && profile.data?.role !== 'support')) { router.replace('/dashboard'); return; }
      setRole(profile.data.role);
      const [membersResult, requestResult, mappingResult] = await Promise.all([
        client.from('profiles').select('id, display_name, role, created_at').order('created_at', { ascending: false }).limit(25),
        client.from('user_systems').select('user_id, system_id, status, updated_at, profiles(display_name), systems(name)').in('status', ['pending', 'active']).order('updated_at', { ascending: false }).limit(25),
        client.from('product_role_name_access').select('product_id, discord_role_name, label').order('created_at', { ascending: false }),
      ]);
      if (!mounted) return;
      if (membersResult.error) setError(membersResult.error.message);
      else if (membersResult.data) setMembers(membersResult.data.map((member) => ({ name: member.display_name || 'Ohne Namen', email: member.id, role: member.role === 'admin' ? 'Admin' : member.role === 'support' ? 'Support' : 'Kunde', status: 'Aktiv', initials: (member.display_name || 'DN').slice(0, 2).toUpperCase() })));
      if (requestResult.error) setError(requestResult.error.message);
      else if (requestResult.data) {
        const rows = requestResult.data as unknown as Array<{ user_id: string; system_id: string; status: AdminRequest['status']; updated_at: string; profiles: { display_name: string } | null; systems: { name: string } | null }>;
        setRequests(rows.filter((row) => row.profiles && row.systems).map((row) => ({ userId: row.user_id, systemId: row.system_id, status: row.status, name: row.profiles!.display_name || 'Ohne Namen', system: row.systems!.name, requestedAt: new Date(row.updated_at).toLocaleDateString('de-DE'), initials: (row.profiles!.display_name || 'DN').slice(0, 2).toUpperCase() })));
      }
      if (mappingResult.error) setError(mappingResult.error.message);
      else if (mappingResult.data) setRoleMappings((mappingResult.data as unknown as Array<{ product_id: string; discord_role_name: string; label: string }>).map((mapping) => ({ productId: mapping.product_id, discordRoleName: mapping.discord_role_name, label: mapping.label })));
      setLoading(false);
    }
    void loadAdmin();
    return () => { mounted = false; };
  }, [router, supabase]);

  async function updateRequest(request: AdminRequest) {
    if (!supabase || role !== 'admin') return;
    const key = `${request.userId}-${request.systemId}`;
    const nextStatus = request.status === 'active' ? 'revoked' : 'active';
    setBusyKey(key);
    setError('');
    setMessage('');
    const result = await supabase.rpc('set_system_access', { p_user_id: request.userId, p_system_id: request.systemId, p_status: nextStatus });
    if (result.error) setError(result.error.message);
    else {
      setRequests((current) => current.filter((item) => item.userId !== request.userId || item.systemId !== request.systemId));
      setMessage(nextStatus === 'active' ? `${request.system} für ${request.name} freigegeben.` : `${request.system} für ${request.name} entzogen.`);
    }
    setBusyKey('');
  }

  async function addRoleMapping(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase || role !== 'admin' || !mappingRoleName.trim()) return;
    setMappingBusy(true);
    setError('');
    const label = mappingLabel.trim() || products.find((product) => product.id === mappingProductId)?.title || mappingProductId;
    const result = await supabase.from('product_role_name_access').insert({ product_id: mappingProductId, discord_role_name: mappingRoleName.trim(), label }).select('product_id, discord_role_name, label').single();
    if (result.error) setError(result.error.message);
    else if (result.data) {
      setRoleMappings((current) => [{ productId: result.data.product_id, discordRoleName: result.data.discord_role_name, label: result.data.label }, ...current]);
      setMappingRoleName('');
      setMappingLabel('');
      setMessage('Discord-Rolle mit Produkt verknüpft. Beim nächsten Login wird der Zugriff synchronisiert.');
    }
    setMappingBusy(false);
  }

  async function removeRoleMapping(mapping: AdminRoleMapping) {
    if (!supabase || role !== 'admin') return;
    setMappingBusy(true);
    const result = await supabase.from('product_role_name_access').delete().eq('product_id', mapping.productId).eq('discord_role_name', mapping.discordRoleName);
    if (result.error) setError(result.error.message);
    else setRoleMappings((current) => current.filter((item) => item.productId !== mapping.productId || item.discordRoleName !== mapping.discordRoleName));
    setMappingBusy(false);
  }

  async function signOut() { if (supabase) await supabase.auth.signOut(); router.push('/login'); }
  if (!supabase) return <PortalUnavailable area="Administration" />;
  if (loading) return <main className="portal-page container-wide"><div className="portal-loading">Berechtigungen werden geprüft …</div></main>;
  const pendingCount = requests.filter((request) => request.status === 'pending').length;
  return <PortalShell eyebrow="DuoNerds / Admin" title="Ordnung für jedes Projekt." description="Freigaben, Nutzer und Support bleiben an einem Ort – mit nachvollziehbaren Entscheidungen statt verstreuten Nachrichten." active="admin">
    <div className="admin-banner"><div><span className="portal-kicker">Admin-Arbeitsbereich</span><h2>{pendingCount} Freigaben warten auf dich.</h2><p>Admins können Zugriffe direkt freigeben oder entziehen. Jede Entscheidung wird zusammen mit Zeit, Nutzer und System im Audit-Log gespeichert.</p></div><Link className="button-duo button-primary" href="/dashboard/systeme">Systemübersicht <ArrowRight size={15} /></Link></div>
    {error && <p className="form-message form-error">Backend-Antwort: {error}</p>}
    {message && <p className="form-message form-info">{message}</p>}
    <div className="portal-metrics"><Metric label="Kundenkonten" value={`${members.length}`} note="im Arbeitsbereich" icon={<Users size={17} />} /><Metric label="Offene Freigaben" value={`${pendingCount}`} note="warten auf Prüfung" icon={<BadgeCheck size={17} />} /><Metric label="Deine Rolle" value={role === 'admin' ? 'Admin' : 'Support'} note={role === 'admin' ? 'Freigaben möglich' : 'Lesender Zugriff'} icon={<ShieldCheck size={17} />} /></div>
    <div className="portal-section-grid"><section className="portal-panel"><div className="panel-heading"><div><span className="portal-kicker">Zugriffsanfragen</span><h2>Freigaben prüfen</h2></div><Link className="text-link" href="/dashboard/systeme">Systeme <ArrowRight size={14} /></Link></div><div className="portal-list">{requests.length > 0 ? requests.map((request) => { const busy = busyKey === `${request.userId}-${request.systemId}`; const active = request.status === 'active'; return <div className="portal-list-row" key={`${request.userId}-${request.systemId}`}><span className="avatar-small">{request.initials}</span><div><strong>{request.name}</strong><small>{request.system} · {request.requestedAt}</small></div><StatusPill status={request.status} /><button className="mini-action" disabled={role !== 'admin' || busy} onClick={() => void updateRequest(request)}>{busy ? 'Speichern …' : role !== 'admin' ? 'Nur Admin' : active ? 'Entziehen' : 'Freigeben'}</button></div>; }) : <div className="portal-empty-row"><BadgeCheck size={18} /><span>Keine offenen oder aktiven Freigaben.</span></div>}</div></section><section className="portal-panel"><div className="panel-heading"><div><span className="portal-kicker">Konten</span><h2>Team & Kunden</h2></div><Users size={18} /></div><div className="portal-list">{members.map((member) => <div className="portal-list-row" key={member.email}><span className="avatar-small">{member.initials}</span><div><strong>{member.name}</strong><small>Account-ID: {member.email}</small></div><span className="member-role">{member.role}</span><span className="member-state">{member.status}</span></div>)}</div></section></div>
    <section className="portal-panel portal-role-mappings"><div className="panel-heading"><div><span className="portal-kicker">Discord-Rollen</span><h2>Produkte nach Rolle vergeben</h2></div><KeyRound size={19} /></div><p className="mapping-help">Verknüpfe den exakten Discord-Rollennamen mit einem Shop-Produkt. Beim nächsten Login liest der Server die Rollen und synchronisiert den Zugriff automatisch.</p><div className="portal-role-list">{roleMappings.length > 0 ? roleMappings.map((mapping) => <div className="portal-role-row" key={`${mapping.productId}-${mapping.discordRoleName}`}><div><strong>{mapping.label}</strong><small>{mapping.productId} · Rolle {mapping.discordRoleName}</small></div><button className="mini-action" disabled={role !== 'admin' || mappingBusy} onClick={() => void removeRoleMapping(mapping)}>Entfernen</button></div>) : <div className="portal-empty-row"><KeyRound size={18} /><span>Noch keine Produktrollen hinterlegt.</span></div>}</div>{role === 'admin' && <form className="portal-role-form" onSubmit={(event) => void addRoleMapping(event)}><select value={mappingProductId} onChange={(event) => setMappingProductId(event.target.value)} aria-label="Produkt auswählen">{products.map((product) => <option value={product.id} key={product.id}>{product.title}</option>)}</select><input list="duonerds-discord-roles" value={mappingRoleName} onChange={(event) => setMappingRoleName(event.target.value)} placeholder="Discord Rollenname" required /><datalist id="duonerds-discord-roles">{discordRoleNames.map((roleName) => <option value={roleName} key={roleName} />)}</datalist><input value={mappingLabel} onChange={(event) => setMappingLabel(event.target.value)} placeholder="Label (optional)" /><button className="button-duo button-primary" type="submit" disabled={mappingBusy}>{mappingBusy ? 'Speichern …' : 'Rolle verknüpfen'} <ArrowRight size={14} /></button></form>}</section>
    <div className="portal-bottom-actions"><button className="quiet-action" onClick={signOut}><LogIn size={15} /> Abmelden</button><span className="quiet-action"><ShieldCheck size={15} /> Aktionen werden protokolliert</span></div>
  </PortalShell>;
}
