import { NextRequest } from 'next/server';
import { encode, type JWT } from 'next-auth/jwt';

export const COOKIE = 'authjs.session-token';

export async function sessionCookie(token: JWT) {
  const value = await encode({
    token,
    secret: process.env.AUTH_SECRET!,
    salt: COOKIE,
  });
  return `${COOKIE}=${value}`;
}

export function request(path: string, init: ConstructorParameters<typeof NextRequest>[1] = {}) {
  return new NextRequest(`http://localhost:3000${path}`, init);
}

export function sessionCookieCleared(response: Response) {
  return response.headers
    .getSetCookie()
    .some((c) => c.startsWith(`${COOKIE}=;`) && /Max-Age=0|Expires=Thu, 01 Jan 1970/i.test(c));
}
