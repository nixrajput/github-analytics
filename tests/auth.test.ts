import { afterEach, describe, expect, it, vi } from 'vitest';
import { decode } from 'next-auth/jwt';
import { handlers } from '@/auth';
import { refreshGitHubToken } from '@/lib/github-token';
import { COOKIE, request, sessionCookie, sessionCookieCleared } from './helpers';

const now = () => Math.floor(Date.now() / 1000);
const visitor = {
  name: 'Octo Cat',
  picture: 'https://avatars.githubusercontent.com/u/1',
  access_token: 'ghu_visitor_access_token',
  refresh_token: 'ghr_visitor_refresh_token',
};

afterEach(() => vi.unstubAllGlobals());

describe('refreshGitHubToken', () => {
  it('keeps a token that is not close to expiry and does not call GitHub', async () => {
    const fetch = vi.fn();
    vi.stubGlobal('fetch', fetch);
    const token = { ...visitor, expires_at: now() + 3600 };
    expect(await refreshGitHubToken(token)).toBe(token);
    expect(fetch).not.toHaveBeenCalled();
  });

  it('swaps the refresh token for new tokens', async () => {
    const fetch = vi.fn().mockResolvedValue(
      Response.json({ access_token: 'ghu_new', refresh_token: 'ghr_new', expires_in: 28800 })
    );
    vi.stubGlobal('fetch', fetch);

    const token = await refreshGitHubToken({ ...visitor, expires_at: now() - 1 });

    expect(token).toMatchObject({ access_token: 'ghu_new', refresh_token: 'ghr_new' });
    expect(token!.expires_at).toBeGreaterThan(now() + 28000);
    const [url, init] = fetch.mock.calls[0];
    expect(url).toBe('https://github.com/login/oauth/access_token');
    const body = new URLSearchParams(init.body);
    expect(body.get('grant_type')).toBe('refresh_token');
    expect(body.get('refresh_token')).toBe(visitor.refresh_token);
    expect(body.get('client_id')).toBe('Iv1.testclientid');
  });

  it('returns null when GitHub rejects the refresh token', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(Response.json({ error: 'bad_refresh_token' }))
    );
    expect(await refreshGitHubToken({ ...visitor, expires_at: now() - 1 })).toBeNull();
  });

  it('returns null when the refresh request fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('fetch failed')));
    expect(await refreshGitHubToken({ ...visitor, expires_at: now() - 1 })).toBeNull();
  });
});

describe('/api/auth/session', () => {
  it('never returns the GitHub tokens', async () => {
    const cookie = await sessionCookie({ ...visitor, expires_at: now() + 3600 });
    const response = await handlers.GET(request('/api/auth/session', { headers: { cookie } }));
    const text = await response.text();

    expect(JSON.parse(text).user.name).toBe('Octo Cat');
    expect(text).not.toContain(visitor.access_token);
    expect(text).not.toContain(visitor.refresh_token);
    expect(text).not.toMatch(/access_token|refresh_token|expires_at/);
  });

  it('stores a refreshed token in the cookie', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        Response.json({ access_token: 'ghu_new', refresh_token: 'ghr_new', expires_in: 28800 })
      )
    );
    const cookie = await sessionCookie({ ...visitor, expires_at: now() - 1 });
    const response = await handlers.GET(request('/api/auth/session', { headers: { cookie } }));

    const setCookie = response.headers.getSetCookie().find((c) => c.startsWith(`${COOKIE}=`))!;
    const token = await decode({
      token: setCookie.slice(COOKIE.length + 1).split(';')[0],
      secret: process.env.AUTH_SECRET!,
      salt: COOKIE,
    });
    expect(token).toMatchObject({ access_token: 'ghu_new', refresh_token: 'ghr_new' });
    expect(setCookie).toMatch(/HttpOnly/i);
    expect(setCookie).toMatch(/SameSite=Lax/i);
  });

  it('ends the session when the refresh fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(Response.json({ error: 'bad_refresh_token' }))
    );
    const cookie = await sessionCookie({ ...visitor, expires_at: now() - 1 });
    const response = await handlers.GET(request('/api/auth/session', { headers: { cookie } }));

    expect(await response.json()).toBeNull();
    expect(sessionCookieCleared(response)).toBe(true);
  });
});

describe('sign-out', () => {
  async function signOutWith(fetchImpl: ReturnType<typeof vi.fn>) {
    const csrf = await handlers.GET(request('/api/auth/csrf'));
    const { csrfToken } = await csrf.json();
    const csrfCookie = csrf.headers.getSetCookie()[0].split(';')[0];
    const session = await sessionCookie({ ...visitor, expires_at: now() + 3600 });

    vi.stubGlobal('fetch', fetchImpl);
    return handlers.POST(
      request('/api/auth/signout', {
        method: 'POST',
        headers: {
          cookie: `${csrfCookie}; ${session}`,
          'content-type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ csrfToken }).toString(),
      })
    );
  }

  it('revokes the token at GitHub and clears the cookie', async () => {
    const fetch = vi.fn().mockResolvedValue(new Response(null, { status: 204 }));
    const response = await signOutWith(fetch);

    const [url, init] = fetch.mock.calls[0];
    expect(url).toBe('https://api.github.com/applications/Iv1.testclientid/token');
    expect(init.method).toBe('DELETE');
    expect(init.headers.Authorization).toBe(
      `Basic ${Buffer.from('Iv1.testclientid:test-client-secret').toString('base64')}`
    );
    expect(JSON.parse(init.body)).toEqual({ access_token: visitor.access_token });
    expect(sessionCookieCleared(response)).toBe(true);
  });

  it('still clears the cookie when the revoke fails', async () => {
    const response = await signOutWith(vi.fn().mockRejectedValue(new TypeError('fetch failed')));
    expect(sessionCookieCleared(response)).toBe(true);
  });
});
