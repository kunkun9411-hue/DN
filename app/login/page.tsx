import type { Metadata } from 'next';
import { AuthForm } from '@/components/portal';

export const metadata: Metadata = { title: 'Portal Login' };

export default function LoginPage() {
  return <AuthForm mode="login" />;
}

