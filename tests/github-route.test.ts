import { afterEach, describe, expect, it, vi } from 'vitest';
import { POST } from '@/app/api/github/route';
import { request, sessionCookie } from './helpers';

const body = JSON.stringify({ query: 'profile', username: 'octocat' });
const now = () => Math.floor(Date.now() / 1000);

afterEach(() => vi.unstubAllGlobals());

describe('POST /api/github', () => {
  it('returns 401 without a session', async () => {
    const fetch = vi.fn();
    vi.stubGlobal('fetch', fetch);
    const response = await POST(request('/api/github', { method: 'POST', body }));

    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({ error: 'Sign in required' });
    expect(fetch).not.toHaveBeenCalled();
  });

  it('returns 401 when the GitHub token has expired', async () => {
    const cookie = await sessionCookie({ access_token: 'ghu_old', expires_at: now() - 1 });
    const response = await POST(
      request('/api/github', { method: 'POST', body, headers: { cookie } })
    );
    expect(response.status).toBe(401);
  });

  it('calls GitHub with the visitor token', async () => {
    const fetch = vi
      .fn()
      .mockResolvedValue(Response.json({ data: { user: { login: 'octocat' } } }));
    vi.stubGlobal('fetch', fetch);
    const cookie = await sessionCookie({ access_token: 'ghu_visitor', expires_at: now() + 3600 });

    const response = await POST(
      request('/api/github', { method: 'POST', body, headers: { cookie } })
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ user: { login: 'octocat' } });
    const [url, init] = fetch.mock.calls[0];
    expect(String(url)).toBe('https://api.github.com/graphql');
    expect(new Headers(init.headers).get('authorization')).toBe('Bearer ghu_visitor');
  });

  it('still validates input for signed-in visitors', async () => {
    const cookie = await sessionCookie({ access_token: 'ghu_visitor', expires_at: now() + 3600 });
    const response = await POST(
      request('/api/github', {
        method: 'POST',
        body: JSON.stringify({ query: 'profile', username: '../../repos/x' }),
        headers: { cookie },
      })
    );
    expect(response.status).toBe(400);
  });
});
