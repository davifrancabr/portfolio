import { getSessionCookie } from 'better-auth/cookies';
import { NextRequest, NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
  const cookie = getSessionCookie(request);
  if (cookie) return NextResponse.next();

  const loginUrl = new URL('/login', request.url);
  const next = `${request.nextUrl.pathname}${request.nextUrl.search}`;
  loginUrl.searchParams.set('next', next);

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/library/:path*', '/playlist/:path*', '/settings/:path*']
};
