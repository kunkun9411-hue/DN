import type { Metadata } from 'next';
import { AdminDashboard } from '@/components/portal';

export const metadata: Metadata = { title: 'Administration' };

export default function AdminPage() {
  return <AdminDashboard />;
}

