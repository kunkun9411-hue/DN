'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Boxes, Braces, Check, CircleDot, Code2, Database, ExternalLink, Flame, MessageCircle, ShieldCheck, Sparkles, Swords, Terminal, Workflow, Wrench, type LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useI18n } from '@/lib/i18n';
import { serviceByKey, services } from '@/lib/data/services';
import { ScrollReveal } from '@/components/site-layout';

const iconMap = { swords: Swords, flame: Flame, blocks: Boxes, wrench: Wrench } as const;
const stackIcons: LucideIcon[] = [Code2, Terminal, Boxes, Braces, Database, MessageCircle];

export function Hero() {
  const { t } = useI18n();
  return <section className="hero-wrap"><div className="container-wide hero-grid">
    <motion.div className="hero-copy" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .65 }}>
      <div className="flex flex-wrap items-center gap-3"><span className="eyebrow-duo">{t('hero.eyebrow')}</span><span className="status-pill"><span className="status-dot" /> {t('status.available')}</span></div>
      <h1 className="display-title mt-5">{t('hero.title')}</h1>
      <p className="muted-copy">{t('hero.text')}</p>
      <div className="hero-actions"><Link className="button-duo button-primary" href="#leistungen">{t('actions.discover')} <ArrowRight size={16} /></Link><a className="button-duo button-ghost" href="https://discord.com/app" target="_blank" rel="noreferrer"><MessageCircle size={16} /> {t('actions.talk')}</a></div>
      <div className="hero-proofs"><span><Check size={13} /> {t('hero.proofOne')}</span><span><Check size={13} /> {t('hero.proofTwo')}</span><span><Check size={13} /> {t('hero.proofThree')}</span></div>
    </motion.div>
    <motion.div className="hero-art" initial={{ opacity: 0, scale: .98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .8, delay: .1 }}>
      <div className="hero-art-image"><Image src="/assets/duonerds-hero-pro.png" alt="DuoNerds Game-Tech Arbeitsbereich" fill sizes="(max-width: 720px) 100vw, 55vw" /></div>
      <div className="mockup-window mockup-window-top"><div className="mockup-topline"><span>{t('hero.visualLabel')}</span><CircleDot size={12} color="#10b981" /></div><strong className="mockup-title">{t('hero.visualTitle')}</strong><small className="mockup-subtitle">{t('hero.visualText')}</small><div className="mockup-bars"><span /><span /><span /></div></div>
      <div className="mockup-window mockup-window-bottom"><span className="mockup-icon"><Workflow size={20} /></span><span><strong>Project status / 03</strong><small>review checkpoint</small></span></div>
      <div className="hero-caption"><strong>DN / 01</strong><span>Planung, Umsetzung, Übergabe.</span></div>
    </motion.div>
  </div></section>;
}

export function SignalStrip() {
  return <div className="signal-strip"><div className="container-wide signal-inner"><span className="signal-label">Woran wir arbeiten</span><Link className="signal-item" href="/metin2"><Swords size={14} /> Metin2</Link><Link className="signal-item" href="/palworld"><Flame size={14} /> Palworld</Link><Link className="signal-item" href="/minecraft"><Boxes size={14} /> Minecraft</Link><Link className="signal-item" href="/tools"><Wrench size={14} /> Web &amp; Tools</Link><Link className="signal-item" href="/shop"><Sparkles size={14} /> Custom</Link></div></div>;
}

export function ServiceGrid() {
  const { t, locale } = useI18n();
  return <section className="section-block" id="leistungen"><div className="container-wide"><div className="section-head"><div><span className="eyebrow-duo">{t('home.servicesEyebrow')}</span><h2 className="section-title mt-4">{t('home.servicesTitle')}</h2></div><p className="muted-copy">{t('home.servicesText')}</p></div><div className="service-grid">{services.slice(0, 3).map((service, index) => { const Icon = iconMap[service.icon as keyof typeof iconMap]; const copy = service[locale]; return <ScrollReveal key={service.key} className={`service-card ${index === 1 ? 'accent-copper' : index === 2 ? 'accent-emerald' : 'accent-amber'}`}><div className="service-card-top"><span>0{index + 1} / {copy.tag}</span><Icon size={18} /></div><h3>{copy.title}</h3><p>{copy.text}</p><Link href={service.href} className="service-card-link">{t('actions.details')} <ArrowRight size={12} className="inline" /></Link></ScrollReveal>; })}<ScrollReveal className="service-card"><div className="service-card-top"><span>04 / Custom</span><Sparkles size={18} /></div><h3>{t('services.tools.title')}</h3><p>{t('services.tools.text')}</p><Link href="/tools" className="service-card-link">{t('actions.details')} <ArrowRight size={12} className="inline" /></Link></ScrollReveal></div></div></section>;
}

export function GamesSection() {
  const { t, locale } = useI18n();
  const pal = serviceByKey.palworld;
  const minecraft = serviceByKey.minecraft;
  return <section className="section-block pt-0" id="spiele"><div className="container-wide"><div className="section-head"><div><span className="eyebrow-duo">{t('home.gamesEyebrow')}</span><h2 className="section-title mt-4">{t('home.gamesTitle')}</h2></div><p className="muted-copy">{t('home.gamesText')}</p></div><div className="game-grid"><Link href="/metin2" className="game-feature"><Image src="/assets/duonerds-hero-pro.png" alt="Metin2 Systeme Visual" fill sizes="(max-width: 980px) 100vw, 58vw" /><div className="game-feature-content"><span className="eyebrow-duo">{t('services.metin2.tag')}</span><h3>{t('services.metin2.title')}</h3><span className="inline-flex items-center gap-2 text-amber text-sm">{t('actions.details')} <ArrowRight size={14} /></span></div></Link><div className="game-stack"><Link href="/palworld" className="game-small"><span className="game-icon"><Flame size={22} /></span><span><h3>{pal[locale].title}</h3><p>{pal[locale].text}</p></span></Link><Link href="/minecraft" className="game-small"><span className="game-icon"><Boxes size={22} /></span><span><h3>{minecraft[locale].title}</h3><p>{minecraft[locale].text}</p></span></Link></div></div></div></section>;
}

export function WorkflowSection() {
  const { t, messages } = useI18n();
  const ref = useRef<HTMLElement | null>(null);
  const [step, setStep] = useState(0);
  useEffect(() => {
    const update = () => { if (!ref.current) return; const rect = ref.current.getBoundingClientRect(); const range = Math.max(1, rect.height - window.innerHeight); const progress = Math.min(1, Math.max(0, -rect.top / range)); setStep(Math.min(3, Math.floor(progress * 4))); };
    update(); window.addEventListener('scroll', update, { passive: true }); return () => window.removeEventListener('scroll', update);
  }, []);
  return <section ref={ref} className="section-block" id="ablauf"><div className="container-wide"><div className="section-head"><div><span className="eyebrow-duo">{t('workflow.eyebrow')}</span><h2 className="section-title mt-4">{t('workflow.title')}</h2></div><p className="muted-copy">{t('workflow.text')}</p></div><div className="surface workflow-board"><div className="workflow-line"><span style={{ width: `${(step / 3) * 100}%` }} /></div><div className="workflow-steps">{messages.workflow.steps.map((item, index) => <motion.div key={item.label} className={`workflow-step ${step >= index ? 'active' : ''}`} animate={{ opacity: step >= index ? 1 : .62 }}><span className="workflow-node">{item.label.split(' ')[0]}</span><span className="workflow-label">{item.label}</span><h3>{item.title}</h3><p>{item.text}</p></motion.div>)}</div><div className="workflow-log"><ShieldCheck size={14} /> READY / {step + 1} von 4 Schritten sichtbar</div></div></div></section>;
}

export function StackSection() {
  const { t, messages } = useI18n();
  return <section className="section-block pt-0"><div className="container-wide"><div className="section-head"><div><span className="eyebrow-duo">{t('stack.eyebrow')}</span><h2 className="section-title mt-4">{t('stack.title')}</h2></div><p className="muted-copy">{t('stack.text')}</p></div><div className="stack-grid">{messages.stack.items.map((item, i) => <StackItem key={item} label={item} Icon={stackIcons[i % stackIcons.length]} />)}</div></div></section>;
}

function StackItem({ label, Icon }: { label: string; Icon: LucideIcon }) { return <div className="stack-item"><Icon size={17} /> {label}</div>; }

export function QuoteSection() {
  const { t, messages } = useI18n();
  return <section className="section-block pt-0"><div className="container-wide"><div className="section-head"><div><span className="eyebrow-duo">{t('home.principlesEyebrow')}</span><h2 className="section-title mt-4">{t('home.principlesTitle')}</h2></div><p className="muted-copy">{t('home.principlesText')}</p></div><div className="quote-grid">{messages.home.principles.map((item, index) => <article className="quote-card principle-card" key={item.title}><span className="principle-number">0{index + 1}</span><h3>{item.title}</h3><p>{item.text}</p><span className="principle-rule" /></article>)}</div></div></section>;
}

export function ShopCallout() {
  const { t } = useI18n();
  return <section className="section-block pt-0"><div className="container-wide"><div className="shop-callout"><div><span className="eyebrow-duo">{t('home.shopEyebrow')}</span><h2>{t('home.shopTitle')}</h2><p>{t('home.shopText')}</p></div><Link className="button-duo button-ghost" href="/shop">{t('actions.details')} <ArrowRight size={15} /></Link></div></div></section>;
}

export function ContactSection() {
  const { t } = useI18n();
  const submit = (event: React.FormEvent<HTMLFormElement>) => { event.preventDefault(); const form = new FormData(event.currentTarget); const subject = encodeURIComponent(`DuoNerds Anfrage: ${form.get('topic') || 'Projekt'}`); const body = encodeURIComponent(`Name: ${form.get('name')}\nE-Mail: ${form.get('email')}\n\n${form.get('message')}`); window.location.href = `mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'contact@duonerds.online'}?subject=${subject}&body=${body}`; };
  return <section className="section-block pt-0" id="kontakt"><div className="container-wide"><div className="section-head"><div><span className="eyebrow-duo">{t('home.contactEyebrow')}</span><h2 className="section-title mt-4">{t('home.contactTitle')}</h2></div><p className="muted-copy">{t('home.contactText')}</p></div><div className="contact-grid"><div><div className="status-pill"><span className="status-dot" /> {t('status.available')}</div><div className="contact-links"><a className="contact-link" href="https://discord.com/app" target="_blank" rel="noreferrer"><span className="contact-link-icon"><MessageCircle size={15} /></span><span><strong>Discord</strong><small>Direkter Austausch, ohne Umweg.</small></span><ExternalLink size={14} /></a><a className="contact-link" href="mailto:contact@duonerds.online"><span className="contact-link-icon"><ArrowRight size={15} /></span><span><strong>E-Mail</strong><small>Für eine kurze Projektbeschreibung.</small></span><ExternalLink size={14} /></a></div></div><form className="surface contact-form" onSubmit={submit}><div className="form-row"><label className="form-label">{t('contact.name')}<input className="form-control" name="name" required placeholder={t('contact.placeholderName')} /></label><label className="form-label">{t('contact.email')}<input className="form-control" type="email" name="email" required placeholder={t('contact.placeholderEmail')} /></label></div><label className="form-label">{t('contact.topic')}<input className="form-control" name="topic" placeholder="Metin2, Palworld, Minecraft, Web …" /></label><label className="form-label">{t('contact.message')}<textarea className="form-control textarea" name="message" required placeholder={t('contact.placeholderMessage')} /></label><div className="flex flex-wrap items-center justify-between gap-3"><button className="button-duo button-primary" type="submit">{t('contact.submit')} <ArrowRight size={15} /></button><p className="form-note"><ShieldCheck size={13} /> {t('contact.note')}</p></div></form></div></div></section>;
}

export function HomePage() {
  return <main><Hero /><SignalStrip /><ScrollReveal><ServiceGrid /></ScrollReveal><ScrollReveal><GamesSection /></ScrollReveal><ScrollReveal><WorkflowSection /></ScrollReveal><ScrollReveal><StackSection /></ScrollReveal><ScrollReveal><QuoteSection /></ScrollReveal><ScrollReveal><ShopCallout /></ScrollReveal><ScrollReveal><ContactSection /></ScrollReveal></main>;
}
