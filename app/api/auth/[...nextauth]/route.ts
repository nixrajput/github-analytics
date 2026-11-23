import type { NextRequest } from 'next/server';
import { handlers } from '@/auth';

export const { POST } = handlers;

// With "Request user authorization during installation" on, GitHub sends visitors here after they
// install the App. That request carries no Auth.js state or PKCE verifier, so it cannot finish a
// sign-in. Send the visitor to the dashboard: a signed-in visitor stays signed in, others sign in.
export function GET(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  if (pathname.endsWith('/callback/github') && searchParams.has('setup_action')) {
    return Response.redirect(new URL('/', request.url));
  }
  return handlers.GET(request);
}
