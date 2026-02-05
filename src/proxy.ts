import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export default async function proxy(request: NextRequest) {
  // Only run on /admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    
    // Allow access to login page
    if (request.nextUrl.pathname === '/admin/login') {
      return NextResponse.next();
    }

    const token = request.cookies.get('adminToken')?.value;

    if (!token) {
      // Redirect to login if no token
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    try {
      const secret = new TextEncoder().encode(
        process.env.JWT_SECRET || 'your-secret-key'
      );
      
      // Verify token
      await jwtVerify(token, secret);
      
      return NextResponse.next();
    } catch (_error) { // eslint-disable-line @typescript-eslint/no-unused-vars
      // Redirect to login if token is invalid
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};
