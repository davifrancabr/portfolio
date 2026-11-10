import { headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import 'server-only';
import { auth } from './auth';

export async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

export async function requireSession() {
  const session = await getSession();
  if (!session) redirect('/login');
  return session;
}

/**
 * Recurso administrativo: exige sessão válida e papel `admin`.
 *
 * Retorna 404 (em vez de redirecionar) para não revelar a existência da área
 * administrativa a usuários comuns. A verificação acontece no servidor e deve
 * ser repetida em toda página, Server Action ou route handler administrativo.
 */
export async function requireAdmin() {
  const session = await requireSession();

  if (session.user.role !== 'admin') notFound();

  return session;
}

export async function redirectIfAuthenticated() {
  const session = await getSession();
  if (session) redirect('/');
  return session;
}
