'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Check, FileCheck2, Layers3, ShieldCheck } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { projectCases, type ProjectCase } from '@/lib/data/cases';

export function ProjectCard({ project }: { project: ProjectCase }) {
  const { locale, t } = useI18n();
  const copy = project[locale];
  return <Link className="project-card" href={`/projekte/${project.slug}`}><div className="project-card-media"><Image src={project.image} alt={copy.title} fill sizes="(max-width: 720px) 100vw, 33vw" /><span className="project-card-status">{project.status}</span></div><div className="project-card-copy"><span className="project-card-type">{project.type}</span><h3>{copy.title}</h3><p>{copy.summary}</p><span className="project-card-result"><Check size={13} /> {copy.result}</span><span className="project-card-link">{t('actions.details')} <ArrowRight size={14} /></span></div></Link>;
}

export function ProjectsSection() {
  const { locale } = useI18n();
  return <section className="section-block projects-section"><div className="container-wide"><div className="section-head"><div><span className="eyebrow-duo">{locale === 'de' ? 'Arbeitsproben / 04' : 'Work samples / 04'}</span><h2 className="section-title mt-4">{locale === 'de' ? 'Nicht nur erzÃ¤hlen. Zeigen, wie wir denken.' : 'Do not only tell. Show how we think.'}</h2></div><p className="muted-copy">{locale === 'de' ? 'Das sind keine erfundenen Kundenstimmen. Es sind interne Arbeitsproben und technische Richtungen, an denen du siehst, wie wir Probleme zerlegen und LÃ¶sungen Ã¼bergeben.' : 'These are not invented testimonials. They are internal work samples and technical directions that show how we break down problems and hand over solutions.'}</p></div><div className="project-grid">{projectCases.map((project) => <ProjectCard key={project.slug} project={project} />)}</div><div className="projects-footer"><span>{locale === 'de' ? 'Du hast ein eigenes Vorhaben?' : 'Have a project of your own?'}</span><Link className="text-link" href="/projekte">Alle Arbeitsproben ansehen <ArrowRight size={14} /></Link></div></div></section>;
}

export function ProjectsPage() {
  const { locale } = useI18n();
  return <main className="projects-page container-wide"><div className="projects-page-head"><span className="eyebrow-duo">{locale === 'de' ? 'DuoNerds / Arbeitsproben' : 'DuoNerds / Work samples'}</span><h1>{locale === 'de' ? 'So sieht technische Klarheit aus.' : 'This is what technical clarity looks like.'}</h1><p className="portal-lead">{locale === 'de' ? 'Wir verÃ¶ffentlichen hier bewusst Arbeitsproben und interne Richtungen statt erfundener Erfolgsgeschichten. So bekommst du ein GefÃ¼hl fÃ¼r unsere Tiefe, ohne dass wir dir etwas vormachen.' : 'We deliberately publish work samples and internal directions instead of invented success stories. You get a sense of our depth without us pretending.'}</p></div><div className="project-grid project-grid-page">{projectCases.map((project) => <ProjectCard key={project.slug} project={project} />)}</div></main>;
}

export function ProjectDetail({ project }: { project: ProjectCase }) {
  const { locale, t } = useI18n();
  const copy = project[locale];
  return <main className="project-detail-page container-wide"><Link className="back-link" href="/projekte">{t('actions.back')}</Link><section className="project-detail-hero"><div className="project-detail-copy"><span className="eyebrow-duo">{project.type}</span><h1>{copy.title}</h1><p className="portal-lead">{copy.summary}</p><div className="project-tags">{copy.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></div><div className="project-detail-art"><Image src={project.image} alt={copy.title} fill sizes="(max-width: 720px) 100vw, 55vw" /><span>{project.status}</span></div></section><section className="project-detail-body"><div><span className="eyebrow-duo">{locale === 'de' ? 'Ergebnis' : 'Result'}</span><h2>{copy.result}</h2></div><div className="project-detail-notes"><div><span className="project-note-icon"><Layers3 size={16} /></span><strong>{locale === 'de' ? 'Strukturiert statt Ã¼berladen' : 'Structured instead of overloaded'}</strong><p>{locale === 'de' ? 'Wir schneiden den Umfang so, dass ein echter Fortschritt sichtbar wird und du jederzeit nachjustieren kannst.' : 'We shape the scope so real progress becomes visible and you can adjust at any point.'}</p></div><div><span className="project-note-icon"><FileCheck2 size={16} /></span><strong>{locale === 'de' ? 'Ãœbergabe gehÃ¶rt dazu' : 'Handover is part of it'}</strong><p>{locale === 'de' ? 'Eine LÃ¶sung ist erst fertig, wenn die nÃ¤chste Person sie verstehen, testen und weiterfÃ¼hren kann.' : 'A solution is only finished when the next person can understand, test and continue it.'}</p></div><div><span className="project-note-icon"><ShieldCheck size={16} /></span><strong>{locale === 'de' ? 'Grenzen bleiben sichtbar' : 'Boundaries stay visible'}</strong><p>{locale === 'de' ? 'Wir markieren AbhÃ¤ngigkeiten und offene Punkte, statt sie hinter einer hÃ¼bschen OberflÃ¤che zu verstecken.' : 'We mark dependencies and open points instead of hiding them behind a polished surface.'}</p></div></div></section><section className="project-detail-cta"><div><span className="eyebrow-duo">{locale === 'de' ? 'Dein Projekt' : 'Your project'}</span><h2>{locale === 'de' ? 'Du musst nicht mit einer fertigen LÃ¶sung kommen.' : 'You do not need to arrive with a finished solution.'}</h2></div><Link className="button-duo button-primary" href="/#kontakt">Projekt besprechen <ArrowRight size={15} /></Link></section></main>;
}

