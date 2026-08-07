'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Boxes, Check, Flame, Gauge, MessageCircle, Network, ShieldCheck, Sparkles, Swords, Wrench, type LucideIcon } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { serviceByKey, type ServiceKey } from '@/lib/data/services';
import { ScrollReveal } from '@/components/site-layout';
import { discordUrl } from '@/lib/contact';

const icons: Record<ServiceKey, LucideIcon> = { metin2: Swords, palworld: Flame, minecraft: Boxes, tools: Wrench, bots: MessageCircle };

const specificDetails: Record<ServiceKey, Array<{ icon: LucideIcon; label: string; title: string; text: string }>> = {
  metin2: [
    { icon: Swords, label: 'Client / UI', title: 'Fenster, ZustÃ¤nde und Datenwege', text: 'Wir ordnen gewachsene UI-Strukturen, prÃ¼fen Boundaries und bauen neue Teile so, dass sie in den bestehenden Client passen.' },
    { icon: Network, label: 'Server / VertrÃ¤ge', title: 'Client und Server mÃ¼ssen dasselbe meinen', text: 'Packets, Datenmodelle und ZustÃ¤nde werden gemeinsam betrachtet â€“ damit ein sichtbarer Button nicht an einem unsichtbaren Vertrag scheitert.' },
    { icon: Gauge, label: 'Migration / QA', title: 'Modernisieren, ohne blind abzuschneiden', text: 'Wir arbeiten in Stufen, halten alte VertrÃ¤ge zunÃ¤chst stabil und machen Risiken, Tests und nÃ¤chste Exporte sichtbar.' },
  ],
  palworld: [
    { icon: Flame, label: 'UE4SS / Mods', title: 'Hooks mit klarer Grenze', text: 'Wir strukturieren Mods so, dass Config, Runtime-Signal und eigentliche Ã„nderung nachvollziehbar getrennt bleiben.' },
    { icon: Gauge, label: 'Runtime / Status', title: 'Wenn etwas lÃ¤uft, soll man es sehen', text: 'Statusdateien, Logs und Deploy-Marker helfen dabei, zwischen Ã¼bertragenem Paket und wirklich aktivem Modul zu unterscheiden.' },
    { icon: Network, label: 'Version / Support', title: 'Versionen gehÃ¶ren zur LÃ¶sung', text: 'Wir prÃ¼fen AbhÃ¤ngigkeiten, halten Setup-Schritte fest und sagen offen, wenn ein Hook oder eine Version nicht sauber genug ist.' },
  ],
  minecraft: [
    { icon: Boxes, label: 'Paper / Spigot', title: 'Plugins, die im Netzwerk funktionieren', text: 'Von einem einzelnen Feature bis zu Rollen, Events und Admin-Tools: mit Konfiguration und klarer Server-KompatibilitÃ¤t.' },
    { icon: Network, label: 'Velocity / Daten', title: 'Der Ãœbergang zwischen Servern', text: 'Netzwerklogik, ZustÃ¤nde und Datenwege werden so geplant, dass dein Setup nicht an jeder Grenze anders reagiert.' },
    { icon: Gauge, label: 'Test / Betrieb', title: 'Nicht nur im lokalen Test', text: 'Wir denken Testserver, Logs, Fallbacks und Ãœbergabe mit â€“ damit das Plugin auch nach dem ersten Event noch tragbar bleibt.' },
  ],
  tools: [
    { icon: Network, label: 'Web / Portale', title: 'Informationen dorthin bringen, wo sie gebraucht werden', text: 'Landingpages, Kundenbereiche und interne OberflÃ¤chen mit klarer Navigation, Rollen und einem ruhigen visuellen System.' },
    { icon: Gauge, label: 'Tools / Automationen', title: 'Wiederholbares nicht jedes Mal neu machen', text: 'CLI-Helfer, kleine Automationen und StatusflÃ¤chen, die AblÃ¤ufe vereinfachen, ohne eine neue KomplexitÃ¤tsschicht zu erzeugen.' },
    { icon: Sparkles, label: 'Betrieb / Ãœbergabe', title: 'Ein Tool ist erst fertig, wenn es weiterlaufen kann', text: 'Dokumentation, Deployment-Hinweise, Zugangskonzept und ein sinnvoller nÃ¤chster Schritt gehÃ¶ren dazu.' },
  ],
  bots: [
    { icon: MessageCircle, label: 'Discord / Tickets', title: 'Anfragen bleiben sortiert', text: 'Wir bauen Ticket-Flows, Kategorien und Rollen so, dass Support nicht in einem langen Chatverlauf verschwindet.' },
    { icon: Network, label: 'Automationen / Status', title: 'Weniger manuell nachhalten', text: 'Statusmeldungen, Benachrichtigungen und kleine Integrationen Ã¼bernehmen wiederholbare Schritte.' },
    { icon: ShieldCheck, label: 'Rollen / Ãœbergabe', title: 'Wer darf was sehen?', text: 'Berechtigungen und Ãœbergabe werden mitgedacht, damit dein Ablauf nicht nur im Testkanal funktioniert.' },
  ],
};

export function ServicePage({ serviceKey }: { serviceKey: ServiceKey }) {
  const { locale, t } = useI18n();
  const service = serviceByKey[serviceKey];
  const copy = service[locale];
  const Icon = icons[serviceKey];
  return <main>
    <section className="page-hero surface container-wide">
      <div className="page-hero-copy">
        <span className="eyebrow-duo"><Icon size={14} /> {copy.tag}</span>
        <h1 className="section-title">{copy.title}</h1>
        <p className="muted-copy">{copy.text} Wir passen Umfang und Weg gemeinsam an, wenn dein Projekt anders aussieht.</p>
        <div className="hero-actions"><a className="button-duo button-primary" href={discordUrl} target="_blank" rel="noreferrer"><MessageCircle size={16} /> {t('actions.talk')}</a><Link className="button-duo button-ghost" href="/calculator">{t('actions.calculate')} <ArrowRight size={15} /></Link></div>
      </div>
      <div className="page-hero-art"><Image src={service.image} alt={copy.title} fill sizes="(max-width: 720px) 100vw, 55vw" /><div className="page-hero-overlay"><span>DN / {serviceKey.toUpperCase()}</span><strong>{t('status.available')}</strong></div></div>
    </section>
    <ScrollReveal><section className="section-block"><div className="container-wide detail-grid"><div><span className="eyebrow-duo">01 / {t('home.servicesEyebrow')}</span><h2 className="section-title">{t('home.servicesTitle')}</h2><p className="muted-copy">{t('home.servicesText')}</p></div><div className="detail-list">{copy.bullets.map((bullet) => <div className="detail-list-item" key={bullet}><Check size={16} /><span>{bullet}</span></div>)}<div className="detail-list-item"><Sparkles size={16} /><span>{t('home.whyText')}</span></div></div></div></section></ScrollReveal>
    <ScrollReveal><section className="section-block pt-0"><div className="container-wide"><div className="service-specific-grid">{specificDetails[serviceKey].map((item) => <article className="service-specific-card" key={item.title}><span className="service-specific-icon"><item.icon size={18} /></span><span className="eyebrow-duo">{item.label}</span><h2>{item.title}</h2><p>{item.text}</p></article>)}</div></div></section></ScrollReveal>
    <ScrollReveal><section className="section-block soft-block"><div className="container-wide showcase-row"><div className="showcase-art"><Image src={service.image} alt={copy.title} fill sizes="(max-width: 720px) 100vw, 50vw" /></div><div className="showcase-copy"><span className="eyebrow-duo">02 / {t('workflow.eyebrow')}</span><h2 className="section-title">{t('workflow.title')}</h2><p className="muted-copy">{t('workflow.text')}</p><Link className="button-duo button-primary" href="/shop">{t('actions.buy')} <ArrowRight size={15} /></Link></div></div></section></ScrollReveal>
    <section className="page-cta container-wide"><div><span className="eyebrow-duo">03 / {t('home.contactEyebrow')}</span><h2>{t('home.contactTitle')}</h2><p>{t('home.contactText')}</p></div><a className="button-duo button-primary" href={discordUrl} target="_blank" rel="noreferrer"><MessageCircle size={16} /> {t('actions.discord')}</a></section>
  </main>;
}

