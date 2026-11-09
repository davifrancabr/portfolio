const AUTH_ROUTES = ['/login', '/register'];

/**
 * Only allow redirects to internal paths so the `next` query param cannot be
 * used to send the user to another origin after signing in.
 */
export function getSafeRedirect(
  value: string | string[] | undefined,
  fallback = '/'
): string {
  const candidate = Array.isArray(value) ? value[0] : value;

  if (!candidate) return fallback;
  if (!candidate.startsWith('/') || candidate.startsWith('//')) return fallback;
  if (AUTH_ROUTES.some(route => candidate.startsWith(route))) return fallback;

  return candidate;
}

export function withRedirect(path: string, redirectTo: string): string {
  if (redirectTo === '/') return path;

  return `${path}?next=${encodeURIComponent(redirectTo)}`;
}
