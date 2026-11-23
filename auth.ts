import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';
import { refreshGitHubToken, revokeGitHubToken } from '@/lib/github-token';

declare module 'next-auth/jwt' {
  interface JWT {
    access_token?: string;
    refresh_token?: string;
    expires_at?: number;
  }
}

// The GitHub tokens live only in the encrypted JWT cookie. The default session callback
// exposes name, email and image, so /api/auth/session never returns them.
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [GitHub({ checks: ['pkce', 'state'] })],
  session: { strategy: 'jwt' },
  pages: { signIn: '/sign-in' },
  callbacks: {
    authorized: ({ auth }) => !!auth,
    jwt: ({ token, account }) => {
      if (account) {
        return {
          ...token,
          access_token: account.access_token,
          refresh_token: account.refresh_token,
          expires_at: account.expires_at,
        };
      }
      return refreshGitHubToken(token);
    },
  },
  events: {
    // Auth.js catches errors thrown here and clears the cookie anyway.
    signOut: async (message) => {
      if ('token' in message && message.token?.access_token) {
        await revokeGitHubToken(message.token.access_token);
      }
    },
  },
});
