import { AuthForm } from '@/features/auth/components/auth-form';
import { getSafeRedirect } from '@/features/auth/utils';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Criar conta | Melodia',
  description: 'Crie sua conta na Melodia e leve sua música com você.'
};

type RegisterPageProps = {
  searchParams: Promise<{ next?: string | string[] }>;
};

export default async function RegisterPage({
  searchParams
}: RegisterPageProps) {
  const { next } = await searchParams;

  return <AuthForm mode="signup" redirectTo={getSafeRedirect(next)} />;
}
