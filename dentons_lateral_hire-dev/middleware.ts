import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Middleware disabled - using client-side authentication only
// All auth checks handled by useRequireAuth hook in dashboard layout
export function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)',
  ],
};
