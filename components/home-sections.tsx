'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Boxes, Braces, Check, ChevronDown, CircleDot, Code2, Database, ExternalLink, FileCheck2, Flame, Gauge, Layers3, LifeBuoy, MessageCircle, ShieldCheck, Sparkles, Swords, Terminal, Users, Workflow, Wrench, type LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useI18n } from '@/lib/i18n';
import { services } from '@/lib/data/services';
import { ScrollReveal } from '@/components/site-layout';
import { ProjectsSection } from '@/components/project-sections';
import { contactEmail, discordUrl } from '@/lib/contact';

const iconMap = { swords: Swords, flame: Flame, blocks: Boxes, wrench: Wrench, bots: MessageCircle } as const;
const stackIcons: LucideIcon[] = [Code2, Terminal, Boxes, Braces, Database, MessageCircle];

export function Hero() {
  const { t } = useI18n();
  return <section className="hero-wrap"><div className="container-wide hero-grid">
    <motion.div className="hero-copy" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .65 }}>
      <div className="flex flex-wrap items-center gap-3"><span className="eyebrow-duo">{t('hero.eyebrow')}</span><span className="status-pill"><span className="status-dot" /> {t('status.available')}</span></div>
      <h1 className="display-title mt-5">{t('hero.title')}</h1>
      <p className="muted-copy">{t('hero.text')}</p>
      <div className="hero-actions"><Link className="button-duo button-primary" href="#leistungen">{t('actions.discover')} <ArrowRight size={16} /></Link><a className="button-duo button-ghost" href={discordUrl} target="_blank" rel="noreferrer"><MessageCircle size={16} /> {t('actions.talk')}</a></div>
      <div className="hero-proofs"><span><Check size={13} /> {t('hero.proofOne')}</span><span><Check size={13} /> {t('hero.proofTwo')}</span><span><Check size={13} /> {t('hero.proofThree')}</span></div>
    </motion.div>
    <motion.div className="hero-art" initial={{ opacity: 0, scale: .98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .8, delay: .1 }}>
      <div className="hero-art-image"><Image src="/assets/duonerds-hero-pro.png" alt="DuoNerds Game-Tech Arbeitsbereich" fill sizes="(max-width: 720px) 100vw, 55vw" /></div>
      <div className="mockup-window mockup-window-top"><div className="mockup-topline"><span>{t('hero.visualLabel')}</span><CircleDot size={12} color="#10b981" /></div><strong className="mockup-title">{t('hero.visualTitle')}</strong><small className="mockup-subtitle">{t('hero.visualText')}</small><div className="mockup-bars"><span /><span /><span /></div></div>
      <div className="mockup-window mockup-window-bottom"><span className="mockup-icon"><Workflow size={20} /></span><span><strong>Project status / 03</strong><small>review checkpoint</small></span></div>
      <div className="hero-caption"><strong>DN / 01</strong><span>Planung, Umsetzung, Ãœbergabe.</span></div>
    </motion.div>
  </div></section>;
}

export function SignalStrip() {
  return <div className="signal-strip"><div className="container-wide signal-inner"><span className="signal-label">Woran wir arbeiten</span><Link className="signal-item" href="/metin2"><Swords size={14} /> Metin2</Link><Link className="signal-item" href="/palworld"><Flame size={14} /> Palworld</Link><Link className="signal-item" href="/minecraft"><Boxes size={14} /> Minecraft</Link><Link className="signal-item" href="/tools"><Wrench size={14} /> Web &amp; Tools</Link><Link className="signal-item" href="/shop"><Sparkles size={14} /> Custom</Link></div></div>;
}

export function StudioIntro() {
  const { locale } = useI18n();
  const copy = locale === 'de' ? {
    eyebrow: 'DuoNerds / persÃ¶nlich',
    title: 'Nicht die grÃ¶ÃŸte Agentur. Aber die, die mitdenkt.',
    text: 'Wir sind ein kleines, direktes Team fÃ¼r Leute, die ein echtes technisches Vorhaben haben â€“ auch wenn es am Anfang noch unsortiert ist. Du bekommst keine Schablone, sondern eine ehrliche EinschÃ¤tzung und einen Weg, der zu deinem Projekt passt.',
    note: 'Direkter Kontakt statt Ãœbergabe-Karussell.',
    items: [['01', 'Ein Ansprechpartner', 'Du sprichst mit den Menschen, die dein Projekt wirklich kennen.'], ['02', 'Technik mit Kontext', 'Wir denken nicht nur in Features, sondern in Betrieb, Ãœbergabe und dem nÃ¤chsten Update.'], ['03', 'Flexibel im Umfang', 'Klein starten, sauber prÃ¼fen und erst erweitern, wenn es sinnvoll ist.']],
  } : {
    eyebrow: 'DuoNerds / personal',
    title: 'Not the biggest agency. The one that thinks with you.',
    text: 'We are a small, direct team for people with a real technical project â€“ even when it starts out unstructured. You get an honest assessment and a route that fits your project, not a template.',
    note: 'Direct contact instead of a handover carousel.',
    items: [['01', 'One point of contact', 'You talk to the people who actually know your project.'], ['02', 'Technology with context', 'We think about operations, handover and the next update, not just features.'], ['03', 'Flexible scope', 'Start small, verify properly and expand when it makes sense.']],
  };
  return <section className="section-block studio-intro"><div className="container-wide"><div className="studio-intro-grid"><div><span className="eyebrow-duo"><Users size={14} /> {copy.eyebrow}</span><h2 className="section-title mt-4">{copy.title}</h2><p className="muted-copy studio-intro-copy">{copy.text}</p><div className="studio-direct"><span className="status-dot" /> {copy.note}</div></div><div className="studio-points">{copy.items.map(([number, title, text]) => <article className="studio-point" key={number}><span className="studio-point-number">{number}</span><div><h3>{title}</h3><p>{text}</p></div></article>)}</div></div></div></section>;
}

export function ServiceGrid() {
  const { t, locale } = useI18n();
  return <section className="section-block" id="leistungen"><div className="container-wide"><div className="section-head"><div><span className="eyebrow-duo">{t('home.servicesEyebrow')}</span><h2 className="section-title mt-4">{t('home.servicesTitle')}</h2></div><p className="muted-copy">{t('home.servicesText')}</p></div><div className="service-grid">{services.slice(0, 3).map((service, index) => { const Icon = iconMap[service.icon as keyof typeof iconMap]; const copy = service[locale]; return <ScrollReveal key={service.key} className={`service-card ${index === 1 ? 'accent-copper' : index === 2 ? 'accent-emerald' : 'accent-amber'}`}><div className="service-card-top"><span>0{index + 1} / {copy.tag}</span><Icon size={18} /></div><h3>{copy.title}</h3><p>{copy.text}</p><Link href={service.href} className="service-card-link">{t('actions.details')} <ArrowRight size={12} className="inline" /></Link></ScrollReveal>; })}<ScrollReveal className="service-card"><div className="service-card-top"><span>04 / Custom</span><Sparkles size={18} /></div><h3>{t('services.tools.title')}</h3><p>{t('services.tools.text')}</p><Link href="/tools" className="service-card-link">{t('actions.details')} <ArrowRight size={12} className="inline" /></Link></ScrollReveal></div></div></section>;
}

export function GamesSection() {
  const { t, locale } = useI18n();
  return <section className="section-block pt-0" id="spiele"><div className="container-wide"><div className="section-head"><div><span className="eyebrow-duo">{t('home.gamesEyebrow')}</span><h2 className="section-title mt-4">{t('home.gamesTitle')}</h2></div><p className="muted-copy">{t('home.gamesText')}</p></div><div className="capability-grid">{services.map((service, index) => { const copy = service[locale]; const Icon = iconMap[service.icon as keyof typeof iconMap]; return <Link href={service.href} className={`capability-card capability-${index + 1}`} key={service.key}><Image src={service.image} alt={copy.title} fill sizes="(max-width: 720px) 100vw, 25vw" /><div className="capability-shade" /><div className="capability-content"><span className="capability-index">0{index + 1} / {copy.tag}</span><span className="capability-icon"><Icon size={18} /></span><h3>{copy.title}</h3><p>{copy.text}</p><span className="capability-link">{t('actions.details')} <ArrowRight size={14} /></span></div></Link>; })}</div></div></section>;
}

export function OutcomesSection() {
  const { locale } = useI18n();
  const copy = locale === 'de' ? {
    eyebrow: 'Was am Ende besser ist / 03', title: 'Du kaufst keine Stunden. Du bekommst mehr Ãœbersicht.', text: 'Die gute LÃ¶sung ist nicht die mit den meisten Funktionen. Sie ist die, bei der dein Team weiÃŸ, was passiert, warum es passiert und wie es weitergeht.', items: [{ title: 'Ordnen', text: 'Aus einer Idee wird ein umsetzbarer Plan mit Grenzen, Risiken und einem sinnvollen ersten Schnitt.', Icon: Gauge }, { title: 'Bauen', text: 'Wir entwickeln in Ã¼berprÃ¼fbaren Etappen und zeigen dir frÃ¼h, ob die Richtung trÃ¤gt.', Icon: Layers3 }, { title: 'Weitergeben', text: 'Dokumentation, Zugang und nÃ¤chste Schritte gehÃ¶ren zur LÃ¶sung â€“ nicht als Nachtrag, sondern von Anfang an.', Icon: FileCheck2 }],
  } : {
    eyebrow: 'What improves at the end / 03', title: 'You are not buying hours. You are buying clarity.', text: 'The good solution is not the one with the most features. It is the one where your team understands what happens, why it happens and what comes next.', items: [{ title: 'Shape', text: 'An idea becomes an executable plan with boundaries, risks and a useful first slice.', Icon: Gauge }, { title: 'Build', text: 'We deliver in verifiable stages and show early whether the direction holds.', Icon: Layers3 }, { title: 'Hand over', text: 'Documentation, access and next steps are part of the solution from day one.', Icon: FileCheck2 }],
  };
  return <section className="section-block outcomes-section"><div className="container-wide"><div className="section-head"><div><span className="eyebrow-duo">{copy.eyebrow}</span><h2 className="section-title mt-4">{copy.title}</h2></div><p className="muted-copy">{copy.text}</p></div><div className="outcome-grid">{copy.items.map((item) => <article className="outcome-card" key={item.title}><span className="outcome-icon"><item.Icon size={19} /></span><h3>{item.title}</h3><p>{item.text}</p><span className="outcome-rule" /></article>)}</div></div></section>;
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

export function FaqSection() {
  const { locale } = useI18n();
  const items = locale === 'de' ? [
    ['Muss ich schon genau wissen, was gebaut werden soll?', 'Nein. Eine grobe Idee, ein Problem oder ein bestehender Stand reicht fÃ¼r den ersten Austausch. Wir helfen dir, daraus einen sinnvollen Umfang zu machen.'],
    ['Arbeitet ihr nur an fertigen Produkten?', 'Nein. Wir unterstÃ¼tzen bei Reviews, Erweiterungen, Migrationen, kleinen Tools und vollstÃ¤ndigen Projekten â€“ je nachdem, wo du gerade stehst.'],
    ['Wie lÃ¤uft die Zusammenarbeit ab?', 'Du beschreibst dein Ziel, wir ordnen die technischen Fragen und schlagen einen ersten Schritt vor. Danach entscheidest du, wie weit wir gemeinsam gehen.'],
    ['Kann ich nach der Ãœbergabe selbst weiterarbeiten?', 'Ja. VerstÃ¤ndliche Ãœbergaben, klare ZustÃ¤ndigkeiten und nachvollziehbare Dokumentation gehÃ¶ren fÃ¼r uns zu einer guten LÃ¶sung.'],
  ] : [
    ['Do I need to know exactly what should be built?', 'No. A rough idea, a problem or an existing state is enough for the first conversation. We help shape a useful scope from there.'],
    ['Do you only work on finished products?', 'No. We support reviews, extensions, migrations, small tools and complete projects depending on where you are starting.'],
    ['How does collaboration work?', 'You describe the goal, we structure the technical questions and suggest a first step. You decide how far we go together.'],
    ['Can I continue working after handover?', 'Yes. Clear ownership, understandable handover and useful documentation are part of a good solution for us.'],
  ];
  return <section className="section-block faq-section"><div className="container-wide"><div className="section-head"><div><span className="eyebrow-duo"><LifeBuoy size={14} /> {locale === 'de' ? 'Kurz beantwortet / 08' : 'Answered briefly / 08'}</span><h2 className="section-title mt-4">{locale === 'de' ? 'Noch unsicher? Vollkommen normal.' : 'Still unsure? That is completely normal.'}</h2></div><p className="muted-copy">{locale === 'de' ? 'Du musst nicht alle technischen Begriffe kennen. Wir sprechen verstÃ¤ndlich und sagen dir auch, wenn ein anderer Weg sinnvoller ist.' : 'You do not need to know every technical term. We speak plainly and will tell you when another route makes more sense.'}</p></div><div className="faq-list">{items.map(([question, answer]) => <details className="faq-item" key={question}><summary>{question}<ChevronDown size={17} /></summary><p>{answer}</p></details>)}</div></div></section>;
}

export function ShopCallout() {
  const { t } = useI18n();
  return <section className="section-block pt-0"><div className="container-wide"><div className="shop-callout"><div><span className="eyebrow-duo">{t('home.shopEyebrow')}</span><h2>{t('home.shopTitle')}</h2><p>{t('home.shopText')}</p></div><Link className="button-duo button-ghost" href="/shop">{t('actions.details')} <ArrowRight size={15} /></Link></div></div></section>;
}

export function ContactSection() {
  const { t } = useI18n();
  const submit = (event: React.FormEvent<HTMLFormElement>) => { event.preventDefault(); const form = new FormData(event.currentTarget); const subject = encodeURIComponent(`DuoNerds Anfrage: ${form.get('topic') || 'Projekt'}`); const body = encodeURIComponent(`Name: ${form.get('name')}\nE-Mail: ${form.get('email')}\n\n${form.get('message')}`); window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`; };
  return <section className="section-block pt-0" id="kontakt"><div className="container-wide"><div className="section-head"><div><span className="eyebrow-duo">{t('home.contactEyebrow')}</span><h2 className="section-title mt-4">{t('home.contactTitle')}</h2></div><p className="muted-copy">{t('home.contactText')}</p></div><div className="contact-grid"><div><div className="status-pill"><span className="status-dot" /> {t('status.available')}</div><div className="contact-links"><a className="contact-link" href={discordUrl} target="_blank" rel="noreferrer"><span className="contact-link-icon"><MessageCircle size={15} /></span><span><strong>Discord</strong><small>Direkter Austausch, ohne Umweg.</small></span><ExternalLink size={14} /></a><a className="contact-link" href={`mailto:${contactEmail}`}><span className="contact-link-icon"><ArrowRight size={15} /></span><span><strong>E-Mail</strong><small>FÃ¼r eine kurze Projektbeschreibung.</small></span><ExternalLink size={14} /></a></div></div><form className="surface contact-form" onSubmit={submit}><div className="form-row"><label className="form-label">{t('contact.name')}<input className="form-control" name="name" required placeholder={t('contact.placeholderName')} /></label><label className="form-label">{t('contact.email')}<input className="form-control" type="email" name="email" required placeholder={t('contact.placeholderEmail')} /></label></div><label className="form-label">{t('contact.topic')}<input className="form-control" name="topic" placeholder="Metin2, Palworld, Minecraft, Web â€¦" /></label><label className="form-label">{t('contact.message')}<textarea className="form-control textarea" name="message" required placeholder={t('contact.placeholderMessage')} /></label><div className="flex flex-wrap items-center justify-between gap-3"><button className="button-duo button-primary" type="submit">{t('contact.submit')} <ArrowRight size={15} /></button><p className="form-note"><ShieldCheck size={13} /> {t('contact.note')}</p></div></form></div></div></section>;
}

export function HomePage() {
  return <main><Hero /><SignalStrip /><ScrollReveal><StudioIntro /></ScrollReveal><ScrollReveal><ServiceGrid /></ScrollReveal><ScrollReveal><GamesSection /></ScrollReveal><ScrollReveal><OutcomesSection /></ScrollReveal><ProjectsSection /><ScrollReveal><WorkflowSection /></ScrollReveal><ScrollReveal><StackSection /></ScrollReveal><ScrollReveal><QuoteSection /></ScrollReveal><ScrollReveal><FaqSection /></ScrollReveal><ScrollReveal><ShopCallout /></ScrollReveal><ScrollReveal><ContactSection /></ScrollReveal></main>;
}

