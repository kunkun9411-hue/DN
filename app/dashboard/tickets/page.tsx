import type { Metadata } from 'next';
import { TicketsDashboard } from '@/components/portal';

export const metadata: Metadata = { title: 'Support Tickets' };

export default function DashboardTicketsPage() {
  return <TicketsDashboard />;
}

