import type { Metadata } from 'next';
import { AdminDashboardLive } from '@/components/portal';

export const metadata: Metadata = { title: 'Administration' };

export default function AdminPage() {
  return <AdminDashboardLive />;
}
