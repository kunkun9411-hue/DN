import type { Metadata } from 'next';
import { CustomerDashboard } from '@/components/portal';

export const metadata: Metadata = { title: 'Kundenportal' };

export default function DashboardPage() {
  return <CustomerDashboard />;
}

