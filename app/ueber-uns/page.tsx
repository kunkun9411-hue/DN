import type { Metadata } from 'next';
import { AboutPage } from '@/components/company-pages';

export const metadata: Metadata = { title: 'Ãœber DuoNerds' };

export default function AboutRoute() {
  return <AboutPage />;
}

