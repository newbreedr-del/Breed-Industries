import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Allow access to login page and API routes
    if (request.nextUrl.pathname === '/admin/login' || request.nextUrl.pathname.startsWith('/api/admin')) {
      return NextResponse.next();
    }

    // Check if user is authenticated
    const token = request.cookies.get('admin_session')?.value;
    
    if (!token || token.length < 10) {
      // Redirect to login page with return URL
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*'
};
