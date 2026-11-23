import 'server-only';
import type { JWT } from 'next-auth/jwt';

// GitHub App user tokens expire after 8 hours. Refresh a little early so a search never starts on a dying token.
const REFRESH_MARGIN_SECONDS = 5 * 60;

function clientCredentials() {
  return {
    id: process.env.AUTH_GITHUB_ID ?? '',
    secret: process.env.AUTH_GITHUB_SECRET ?? '',
  };
}

// Returns null when the token cannot be refreshed. Auth.js then clears the session cookie.
export async function refreshGitHubToken(token: JWT): Promise<JWT | null> {
  if (!token.expires_at || Date.now() / 1000 < token.expires_at - REFRESH_MARGIN_SECONDS) {
    return token;
  }
  if (!token.refresh_token) {
    return null;
  }

  const { id, secret } = clientCredentials();
  try {
    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: new URLSearchParams({
        client_id: id,
        client_secret: secret,
        grant_type: 'refresh_token',
        refresh_token: token.refresh_token,
      }),
    });
    // GitHub answers a bad refresh token with HTTP 200 and an `error` field.
    const body = await response.json();
    if (!response.ok || typeof body.access_token !== 'string') {
      return null;
    }
    return {
      ...token,
      access_token: body.access_token,
      refresh_token: body.refresh_token ?? token.refresh_token,
      expires_at: body.expires_in
        ? Math.floor(Date.now() / 1000) + Number(body.expires_in)
        : undefined,
    };
  } catch {
    return null;
  }
}

export async function revokeGitHubToken(accessToken: string): Promise<void> {
  const { id, secret } = clientCredentials();
  await fetch(`https://api.github.com/applications/${id}/token`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString('base64')}`,
      'X-GitHub-Api-Version': '2022-11-28',
    },
    body: JSON.stringify({ access_token: accessToken }),
    signal: AbortSignal.timeout(5000),
  });
}
