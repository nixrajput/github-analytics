import { afterEach, describe, expect, it, vi } from 'vitest';
import { POST } from '@/app/api/github/route';
import { request, sessionCookie } from './helpers';

const now = () => Math.floor(Date.now() / 1000);
const viewer = (login: string) =>
  sessionCookie({ access_token: 'ghu_visitor', login, github_id: 1, expires_at: now() + 3600 });

function stubGitHub(data: unknown) {
  const fetch = vi.fn().mockResolvedValue(Response.json({ data }));
  vi.stubGlobal('fetch', fetch);
  return () => {
    const [url, init] = fetch.mock.calls[0];
    return {
      url: String(url),
      authorization: new Headers(init.headers).get('authorization'),
      ...(JSON.parse(init.body) as { query: string; variables: Record<string, unknown> }),
    };
  };
}

async function call(body: Record<string, unknown>, cookie?: string) {
  return POST(
    request('/api/github', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: cookie ? { cookie } : {},
    })
  );
}

const repos = {
  user: {
    repositories: {
      nodes: [
        { name: 'public-repo', isPrivate: false },
        { name: 'private-repo', isPrivate: true },
      ],
    },
  },
};

afterEach(() => vi.unstubAllGlobals());

describe('POST /api/github', () => {
  it('returns 401 without a session', async () => {
    const fetch = vi.fn();
    vi.stubGlobal('fetch', fetch);
    const response = await call({ query: 'profile', username: 'octocat' });

    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({ error: 'Sign in required' });
    expect(fetch).not.toHaveBeenCalled();
  });

  it('returns 401 when the GitHub token has expired', async () => {
    const cookie = await sessionCookie({ access_token: 'ghu_old', expires_at: now() - 1 });
    const response = await call({ query: 'profile', username: 'octocat' }, cookie);
    expect(response.status).toBe(401);
  });

  it('still validates input for signed-in visitors', async () => {
    const response = await call(
      { query: 'profile', username: '../../repos/x' },
      await viewer('octocat')
    );
    expect(response.status).toBe(400);
  });

  it('sends no-store on every response', async () => {
    stubGitHub(repos);
    const responses = [
      await call({ query: 'profile', username: 'octocat' }),
      await call({ query: 'nope', username: 'octocat' }, await viewer('octocat')),
      await call({ query: 'repositories', username: 'octocat' }, await viewer('octocat')),
    ];
    expect(responses.map((r) => r.status)).toEqual([401, 400, 200]);
    for (const response of responses) {
      expect(response.headers.get('cache-control')).toBe('private, no-store');
    }
  });

  it('allows private data when the viewer asks for their own login', async () => {
    const sent = stubGitHub(repos);
    const response = await call(
      { query: 'repositories', username: 'OctoCat' },
      await viewer('octocat')
    );

    const { url, authorization, variables } = sent();
    expect(url).toBe('https://api.github.com/graphql');
    expect(authorization).toBe('Bearer ghu_visitor');
    expect(variables).toMatchObject({ own: true, privacy: null });
    const body = await response.json();
    expect(body.user.repositories.nodes.map((r: { name: string }) => r.name)).toEqual([
      'public-repo',
      'private-repo',
    ]);
  });

  it('forces public data for another login, even when the token sees private repos', async () => {
    const sent = stubGitHub(repos);
    const response = await call(
      { query: 'repositories', username: 'octocat' },
      await viewer('someone-else')
    );

    const { query, variables } = sent();
    expect(variables).toMatchObject({ own: false, privacy: 'PUBLIC' });
    expect(query).toContain('privacy: $privacy');
    expect(query).not.toContain('collaborators');
    const body = await response.json();
    expect(body.user.repositories.nodes.map((r: { name: string }) => r.name)).toEqual([
      'public-repo',
    ]);
  });

  it('ignores a viewer spoofed in the request body', async () => {
    const sent = stubGitHub(repos);
    await call(
      {
        query: 'repositories',
        username: 'octocat',
        own: true,
        privacy: null,
        login: 'octocat',
        viewer: 'octocat',
      },
      await viewer('someone-else')
    );
    expect(sent().variables).toMatchObject({ own: false, privacy: 'PUBLIC' });
  });

  it('counts only public contributions for another login', async () => {
    const byRepo = (pub: number, priv: number) => [
      { repository: { isPrivate: false }, contributions: { totalCount: pub } },
      { repository: { isPrivate: true }, contributions: { totalCount: priv } },
    ];
    stubGitHub({
      user: {
        contributionsCollection: {
          contributionYears: [2026],
          commitContributionsByRepository: byRepo(5, 50),
          issueContributionsByRepository: byRepo(2, 20),
          pullRequestContributionsByRepository: byRepo(3, 30),
          repositoryContributions: {
            nodes: [{ repository: { isPrivate: false } }, { repository: { isPrivate: true } }],
          },
          contributionCalendar: { totalContributions: 10, weeks: [] },
        },
      },
    });
    const response = await call(
      {
        query: 'contributions',
        username: 'octocat',
        from: '2026-01-01T00:00:00Z',
        to: '2026-02-01T00:00:00Z',
      },
      await viewer('someone-else')
    );

    const collection = (await response.json()).user.contributionsCollection;
    expect(collection).toMatchObject({
      totalCommitContributions: 5,
      totalIssueContributions: 2,
      totalPullRequestContributions: 3,
      totalRepositoriesWithContributedCommits: 1,
      totalRepositoryContributions: 1,
    });
    expect(collection).not.toHaveProperty('restrictedContributionsCount');
    expect(collection).not.toHaveProperty('commitContributionsByRepository');
  });

  // GitHub has no public-only filter for these fields, so the stub returns them
  // as it would for a token that sees the user's private activity.
  const withPrivateActivity = () => ({
    profile: { user: { starredRepositories: { totalCount: 9 } } },
    contributions: {
      user: {
        contributionsCollection: {
          commitContributionsByRepository: [],
          issueContributionsByRepository: [],
          pullRequestContributionsByRepository: [],
          repositoryContributions: { nodes: [] },
          contributionCalendar: { totalContributions: 7, weeks: [] },
        },
      },
    },
    engagement: {
      user: {
        contributionsCollection: {
          contributionCalendar: { totalContributions: 7, weeks: [] },
          pullRequestReviewContributions: { nodes: [] },
          issueContributions: { nodes: [] },
        },
      },
    },
  });

  async function fetchAll(viewerLogin: string) {
    const results: Record<string, ReturnType<ReturnType<typeof stubGitHub>> & { body: any }> = {};
    for (const [query, data] of Object.entries(withPrivateActivity())) {
      const sent = stubGitHub(data);
      const response = await call(
        { query, username: 'octocat', from: '2026-01-01T00:00:00Z', to: '2026-02-01T00:00:00Z' },
        await viewer(viewerLogin)
      );
      results[query] = { ...sent(), body: await response.json() };
    }
    return results;
  }

  it('returns the calendar and starred count for the own login', async () => {
    const { profile, contributions, engagement } = await fetchAll('octocat');

    expect(profile.body.user.starredRepositories).toEqual({ totalCount: 9 });
    expect(contributions.body.user.contributionsCollection.contributionCalendar).toBeDefined();
    expect(engagement.body.user.contributionsCollection.contributionCalendar).toBeDefined();
    expect(engagement.variables).toMatchObject({ own: true });
  });

  it('never returns the calendar or starred count for another login', async () => {
    const { profile, contributions, engagement } = await fetchAll('someone-else');

    expect(profile.body.user).not.toHaveProperty('starredRepositories');
    expect(contributions.body.user.contributionsCollection).not.toHaveProperty(
      'contributionCalendar'
    );
    expect(engagement.body.user.contributionsCollection).not.toHaveProperty(
      'contributionCalendar'
    );
    expect(profile.query).toContain('starredRepositories @include(if: $own)');
    expect(contributions.query).toContain('contributionCalendar @include(if: $own)');
    expect(engagement.query).toContain('contributionCalendar @include(if: $own)');
    expect(engagement.variables).toMatchObject({ own: false });
  });

  it('drops private and restricted engagement for another login', async () => {
    stubGitHub({
      user: {
        contributionsCollection: {
          contributionCalendar: { totalContributions: 0, weeks: [] },
          pullRequestReviewContributions: {
            nodes: [
              { isRestricted: false, repository: { isPrivate: false }, occurredAt: 'public' },
              { isRestricted: false, repository: { isPrivate: true }, occurredAt: 'private' },
              { isRestricted: true, repository: null, occurredAt: 'restricted' },
            ],
          },
          issueContributions: {
            nodes: [
              { isRestricted: false, issue: { repository: { isPrivate: false }, state: 'OPEN' } },
              { isRestricted: false, issue: { repository: { isPrivate: true }, state: 'CLOSED' } },
            ],
          },
        },
      },
    });
    const response = await call(
      {
        query: 'engagement',
        username: 'octocat',
        from: '2026-01-01T00:00:00Z',
        to: '2026-02-01T00:00:00Z',
      },
      await viewer('someone-else')
    );

    const collection = (await response.json()).user.contributionsCollection;
    expect(
      collection.pullRequestReviewContributions.nodes.map((n: { occurredAt: string }) => n.occurredAt)
    ).toEqual(['public']);
    expect(
      collection.issueContributions.nodes.map((n: { issue: { state: string } }) => n.issue.state)
    ).toEqual(['OPEN']);
  });
});
