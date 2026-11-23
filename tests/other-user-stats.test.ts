import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { StatsGrid } from '@/components/stats-grid';
import { mergeContributionData, mergeEngagementData } from '@/hooks/use-github-data';
import { generateMarkdown } from '@/lib/markdown';
import {
  transformContributionStats,
  transformEngagement,
  transformUserProfile,
} from '@/lib/transform';

const NOTE = 'hidden for other users';
const calendar = {
  totalContributions: 3,
  weeks: [
    {
      contributionDays: [
        { contributionCount: 1, date: '2026-01-01' },
        { contributionCount: 2, date: '2026-01-02' },
      ],
    },
  ],
};

// Builds stats from /api/github shapes. For another login the route leaves out the calendar and starred count.
function stats(own: boolean) {
  const profile = {
    login: 'octocat',
    avatarUrl: 'https://avatars.githubusercontent.com/u/1',
    createdAt: '2020-01-01T00:00:00Z',
    followers: { totalCount: 1 },
    following: { totalCount: 1 },
    repositories: { totalCount: 1 },
    ...(own && { starredRepositories: { totalCount: 9 } }),
  };
  const contributions = {
    totalCommitContributions: 3,
    totalPullRequestContributions: 0,
    totalIssueContributions: 0,
    totalRepositoryContributions: 0,
    totalRepositoriesWithContributedCommits: 1,
    ...(own && { contributionCalendar: calendar }),
  };
  const engagement = {
    pullRequestReviewContributions: { nodes: [] },
    issueContributions: { nodes: [] },
    ...(own && { contributionCalendar: calendar }),
  };
  return {
    user: transformUserProfile(profile),
    contributions: transformContributionStats(mergeContributionData([contributions])),
    engagement: transformEngagement(mergeEngagementData([engagement])),
    repositories: [],
    languages: [],
  };
}

function grid(data: ReturnType<typeof stats>) {
  return renderToStaticMarkup(
    createElement(StatsGrid, {
      user: data.user,
      stats: data.contributions,
      engagement: data.engagement,
      repositories: data.repositories,
    })
  );
}

describe('calendar, streaks and starred count in the UI', () => {
  it('shows them for the own login', () => {
    const data = stats(true);
    const html = grid(data);
    const markdown = generateMarkdown(data);

    expect(html).toContain('>9<');
    expect(html).toContain('>2 days<');
    expect(html).not.toContain(NOTE);
    expect(markdown).toContain('**Total Contributions:** 3');
    expect(markdown).toContain('**Current Streak:** 2 days');
  });

  it('shows them as hidden, with a note, for another login', () => {
    const data = stats(false);
    const html = grid(data);
    const markdown = generateMarkdown(data);

    expect(html).toContain(NOTE);
    expect(html).toContain('>Hidden<');
    expect(markdown).toContain('**Total Contributions:** Hidden');
    expect(markdown).toContain('**Current Streak:** Hidden');
    for (const text of [html, markdown]) {
      expect(text).not.toMatch(/undefined|NaN/);
    }
  });
});
