import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';

const handleI18nRouting = createMiddleware(routing);

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/admin') || pathname.startsWith('/staff')) {
    const role = request.cookies.get('user_role')?.value;

    if (pathname.startsWith('/admin') && role !== 'admin') {
      return NextResponse.rewrite(new URL('/not-found', request.url));
    }

    if (
      pathname.startsWith('/staff') &&
      (!role || !['admin', 'staff'].includes(role))
    ) {
      return NextResponse.rewrite(new URL('/not-found', request.url));
    }

    return NextResponse.next();
  }

  return handleI18nRouting(request);
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
