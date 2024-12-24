import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { graphqlClient } from "../lib/graphql/client";
import {
  GET_USER_PROFILE,
  GET_USER_CONTRIBUTIONS,
  GET_USER_REPOSITORIES,
  GET_USER_LANGUAGES,
  GET_USER_ENGAGEMENT,
} from "../lib/graphql/queries";
import {
  transformUserProfile,
  transformContributionStats,
  transformRepositories,
  transformLanguageStats,
  transformEngagement,
} from "../lib/transform";
import type { GitHubStats } from "../lib/types";

function getYearRanges(startDate: Date, endDate: Date): Array<[Date, Date]> {
  const ranges: Array<[Date, Date]> = [];
  let currentStart = new Date(startDate);

  while (currentStart < endDate) {
    const rangeEnd = new Date(
      Math.min(
        new Date(currentStart).setFullYear(currentStart.getFullYear() + 1),
        endDate.getTime()
      )
    );
    ranges.push([currentStart, rangeEnd]);
    currentStart = new Date(rangeEnd);
  }

  return ranges;
}

function mergeContributionData(contributions: any[]): any {
  return contributions.reduce(
    (merged, current) => ({
      totalCommitContributions:
        (merged.totalCommitContributions || 0) +
        current.totalCommitContributions,
      totalPullRequestContributions:
        (merged.totalPullRequestContributions || 0) +
        current.totalPullRequestContributions,
      totalIssueContributions:
        (merged.totalIssueContributions || 0) + current.totalIssueContributions,
      totalRepositoryContributions:
        (merged.totalRepositoryContributions || 0) +
        current.totalRepositoryContributions,
      restrictedContributionsCount:
        (merged.restrictedContributionsCount || 0) +
        current.restrictedContributionsCount,
      totalRepositoriesWithContributedCommits:
        (merged.totalRepositoriesWithContributedCommits || 0) +
        current.totalRepositoriesWithContributedCommits,
      contributionCalendar: {
        totalContributions:
          (merged.contributionCalendar?.totalContributions || 0) +
          current.contributionCalendar.totalContributions,
        weeks: [
          ...(merged.contributionCalendar?.weeks || []),
          ...current.contributionCalendar.weeks,
        ],
      },
    }),
    {}
  );
}

function mergeEngagementData(engagements: any[]): any {
  // Sort all contribution days for accurate streak calculation
  const allDays = engagements
    .flatMap((e) =>
      e.contributionCalendar.weeks.flatMap((w: any) => w.contributionDays)
    )
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Merge review contributions
  const allReviews = engagements.flatMap(
    (e) => e.pullRequestReviewContributions.nodes
  );

  // Merge issue contributions
  const allIssues = engagements.flatMap((e) => e.issueContributions.nodes);

  return {
    contributionCalendar: {
      weeks: [{ contributionDays: allDays }],
    },
    pullRequestReviewContributions: {
      nodes: allReviews,
    },
    issueContributions: {
      nodes: allIssues,
    },
  };
}

export function useGitHubData(
  username: string,
  timeRange: "current-year" | "all-time"
) {
  const [data, setData] = useState<GitHubStats | undefined>();

  const { isLoading, isFetching, isError, error, refetch } = useQuery({
    queryKey: ["githubData", username, timeRange],
    queryFn: async () => {
      if (!username) throw new Error("Username is required");

      try {
        // First fetch user profile to get account creation date
        const profileResponse: any = await graphqlClient.request(
          GET_USER_PROFILE,
          { username }
        );

        const today = new Date();
        const startDate =
          timeRange === "current-year"
            ? new Date(today.getFullYear(), 0, 1)
            : new Date(profileResponse.user.createdAt);

        // Get year ranges for fetching data
        const dateRanges = getYearRanges(startDate, today);

        // Fetch profile and repositories (not time-dependent)
        const [profile, repositories, languages] = await Promise.all([
          Promise.resolve(transformUserProfile(profileResponse.user)),
          graphqlClient
            .request(GET_USER_REPOSITORIES, {
              username,
              first: 100,
            })
            .then(({ user }: any) =>
              transformRepositories(user.repositories.nodes)
            ),
          graphqlClient
            .request(GET_USER_LANGUAGES, {
              username,
              first: 100,
            })
            .then(({ user }: any) =>
              transformLanguageStats(user.repositories.nodes)
            ),
        ]);

        // Fetch contributions and engagement data for each year range
        const contributionsPromises = dateRanges.map(([from, to]) =>
          graphqlClient
            .request(GET_USER_CONTRIBUTIONS, {
              username,
              from: from.toISOString(),
              to: to.toISOString(),
            })
            .then(({ user }: any) => user.contributionsCollection)
        );

        const engagementPromises = dateRanges.map(([from, to]) =>
          graphqlClient
            .request(GET_USER_ENGAGEMENT, {
              username,
              from: from.toISOString(),
              to: to.toISOString(),
            })
            .then(({ user }: any) => user.contributionsCollection)
        );

        // Wait for all data to be fetched
        const [contributionsData, engagementData] = await Promise.all([
          Promise.all(contributionsPromises),
          Promise.all(engagementPromises),
        ]);

        // Merge the data
        const mergedContributions = mergeContributionData(contributionsData);
        const mergedEngagement = mergeEngagementData(engagementData);

        const githubStats: GitHubStats = {
          user: profile,
          contributions: transformContributionStats(mergedContributions),
          repositories,
          languages,
          engagement: transformEngagement(mergedEngagement),
        };

        setData(githubStats);
        return githubStats;
      } catch (error) {
        console.error("Error fetching GitHub data:", error);
        throw error;
      }
    },
    enabled: false,
  });

  return { data, isLoading, isFetching, isError, error, refetch };
}
