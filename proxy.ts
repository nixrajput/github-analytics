export { auth as proxy } from '@/auth';

// /api routes answer 401 themselves instead of redirecting to the sign-in page.
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|icon.png|sign-in).*)'],
};
