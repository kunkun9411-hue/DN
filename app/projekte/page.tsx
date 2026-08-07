import type { Metadata } from 'next';
import { ProjectsPage } from '@/components/project-sections';

export const metadata: Metadata = { title: 'Arbeitsproben' };

export default function ProjectsRoute() {
  return <ProjectsPage />;
}

