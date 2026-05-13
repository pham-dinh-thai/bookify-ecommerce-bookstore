import { NextRequest, NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const role = request.cookies.get('user_role')?.value;

  if (pathname.startsWith('/admin')) {
    if (!role || role !== 'admin') {
      return NextResponse.rewrite(new URL('/not-found', request.url));
    }
  }

  if (pathname.startsWith('/staff')) {
    if (!role || !['admin', 'staff'].includes(role)) {
      return NextResponse.rewrite(new URL('/not-found', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/staff/:path*'],
};
