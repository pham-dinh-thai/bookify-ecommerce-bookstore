import { NextRequest, NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  const role = request.cookies.get('user_role')?.value;

  if (!role || role !== 'admin') {
    return NextResponse.rewrite(new URL('/not-found', request.url));
  }
}

export const config = {
  matcher: ['/admin/:path*'],
};
