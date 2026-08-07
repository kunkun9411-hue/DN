'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Boxes, Check, Flame, MessageCircle, Sparkles, Swords, Wrench, type LucideIcon } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { serviceByKey, type ServiceKey } from '@/lib/data/services';
import { ScrollReveal } from '@/components/site-layout';

const icons: Record<ServiceKey, LucideIcon> = { metin2: Swords, palworld: Flame, minecraft: Boxes, tools: Wrench };

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
        <div className="hero-actions"><a className="button-duo button-primary" href="https://discord.com/app" target="_blank" rel="noreferrer"><MessageCircle size={16} /> {t('actions.talk')}</a><Link className="button-duo button-ghost" href="/calculator">{t('actions.calculate')} <ArrowRight size={15} /></Link></div>
      </div>
      <div className="page-hero-art"><Image src={service.image} alt={copy.title} fill sizes="(max-width: 720px) 100vw, 55vw" /><div className="page-hero-overlay"><span>DN / {serviceKey.toUpperCase()}</span><strong>{t('status.available')}</strong></div></div>
    </section>
    <ScrollReveal><section className="section-block"><div className="container-wide detail-grid"><div><span className="eyebrow-duo">01 / {t('home.servicesEyebrow')}</span><h2 className="section-title">{t('home.servicesTitle')}</h2><p className="muted-copy">{t('home.servicesText')}</p></div><div className="detail-list">{copy.bullets.map((bullet) => <div className="detail-list-item" key={bullet}><Check size={16} /><span>{bullet}</span></div>)}<div className="detail-list-item"><Sparkles size={16} /><span>{t('home.whyText')}</span></div></div></div></section></ScrollReveal>
    <ScrollReveal><section className="section-block soft-block"><div className="container-wide showcase-row"><div className="showcase-art"><Image src="/assets/duonerds-service-map.png" alt="DuoNerds Prozess und Projektstruktur" fill sizes="(max-width: 720px) 100vw, 50vw" /></div><div className="showcase-copy"><span className="eyebrow-duo">02 / {t('workflow.eyebrow')}</span><h2 className="section-title">{t('workflow.title')}</h2><p className="muted-copy">{t('workflow.text')}</p><Link className="button-duo button-primary" href="/shop">{t('actions.buy')} <ArrowRight size={15} /></Link></div></div></section></ScrollReveal>
    <section className="page-cta container-wide"><div><span className="eyebrow-duo">03 / {t('home.contactEyebrow')}</span><h2>{t('home.contactTitle')}</h2><p>{t('home.contactText')}</p></div><a className="button-duo button-primary" href="https://discord.com/app" target="_blank" rel="noreferrer"><MessageCircle size={16} /> {t('actions.discord')}</a></section>
  </main>;
}
