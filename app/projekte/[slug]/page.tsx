import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProjectDetail } from '@/components/project-sections';
import { projectCaseBySlug, projectCases } from '@/lib/data/cases';

export function generateStaticParams() {
  return projectCases.map((project) => ({ slug: project.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const project = projectCaseBySlug[params.slug];
  return { title: project?.de.title ?? 'Arbeitsprobe' };
}

export default async function ProjectDetailRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projectCaseBySlug[slug];
  if (!project) notFound();
  return <ProjectDetail project={project} />;
}

