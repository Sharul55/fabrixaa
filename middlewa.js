import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Protected routes - যেসব API এ login প্রয়োজন
  const protectedPaths = [
    '/api/products/create',
    '/api/orders',
    '/api/admin'
  ];

  const isProtected = protectedPaths.some(path => pathname.startsWith(path));

  if (isProtected) {
    const token = request.headers.get('authorization');
    if (!token) {
      return NextResponse.json(
        { error: 'অননুমোদিত - Token প্রয়োজন' },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*']
};
