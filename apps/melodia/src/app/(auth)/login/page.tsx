import { AuthForm } from '@/features/auth/components/auth-form';
import { getSafeRedirect } from '@/features/auth/utils';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Entrar | Melodia',
  description: 'Entre na sua conta para continuar ouvindo sua música.'
};

type LoginPageProps = {
  searchParams: Promise<{ next?: string | string[] }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { next } = await searchParams;

  return <AuthForm mode="signin" redirectTo={getSafeRedirect(next)} />;
}
