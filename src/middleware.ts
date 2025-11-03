import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Admin routes are protected client-side with JWT authentication
  // No server-side middleware protection needed since auth is handled in components
  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};
