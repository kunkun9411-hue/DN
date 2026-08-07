import type { Metadata } from 'next';
import { SystemsDashboard } from '@/components/portal';

export const metadata: Metadata = { title: 'Systeme & Freigaben' };

export default function DashboardSystemsPage() {
  return <SystemsDashboard />;
}

