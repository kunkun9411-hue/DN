import type { Metadata } from 'next';
import { SupportPage } from '@/components/company-pages';

export const metadata: Metadata = { title: 'Support & Wartung' };

export default function SupportRoute() {
  return <SupportPage />;
}

