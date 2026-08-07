import type { Metadata } from 'next';
import { AuthForm } from '@/components/portal';

export const metadata: Metadata = { title: 'Portal Registrierung' };

export default function RegisterPage() {
  return <AuthForm mode="register" />;
}

