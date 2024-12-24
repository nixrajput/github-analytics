import {
  GitHubUser,
  ContributionStats,
  Repository,
  LanguageStats,
  GitHubEngagement,
} from "./types";

export function transformUserProfile(data: any): GitHubUser {
  if (!data) throw new Error("User data is required");

  return {
    login: data.login,
    name: data.name || data.login,
    avatarUrl: data.avatarUrl,
    bio: data.bio || "",
    location: data.location || "",
    company: data.company || "",
    createdAt: new Date(data.createdAt),
    followers: {
      totalCount: data.followers.totalCount,
    },
    following: {
      totalCount: data.following.totalCount,
    },
    repositories: {
      totalCount: data.repositories.totalCount,
    },
    starredRepositories: {
      totalCount: data.starredRepositories.totalCount,
    },
  };
}

export function transformContributionStats(data: any): ContributionStats {
  if (!data) throw new Error("Contribution data is required");

  return {
    totalCommitContributions: data.totalCommitContributions,
    totalPullRequestContributions: data.totalPullRequestContributions,
    totalIssueContributions: data.totalIssueContributions,
    totalRepositoryContributions: data.totalRepositoryContributions,
    restrictedContributionsCount: data.restrictedContributionsCount,
    totalRepositoriesWithContributedCommits:
      data.totalRepositoriesWithContributedCommits,
    contributionCalendar: {
      totalContributions: data.contributionCalendar.totalContributions,
      weeks: data.contributionCalendar.weeks.map((week: any) => ({
        contributionDays: week.contributionDays.map((day: any) => ({
          contributionCount: day.contributionCount,
          date: day.date,
        })),
      })),
    },
  };
}

export function transformRepositories(data: any[]): Repository[] {
  if (!Array.isArray(data))
    throw new Error("Repositories data must be an array");

  return data.map((repo) => ({
    name: repo.name,
    description: repo.description || "",
    url: repo.url,
    stargazerCount: repo.stargazerCount,
    forkCount: repo.forkCount,
    isPrivate: repo.isPrivate,
    primaryLanguage: repo.primaryLanguage
      ? {
          name: repo.primaryLanguage.name,
          color: repo.primaryLanguage.color,
        }
      : null,
  }));
}

export function transformLanguageStats(repos: any[]): LanguageStats[] {
  if (!Array.isArray(repos))
    throw new Error("Repository data must be an array");

  const languageMap = new Map<string, LanguageStats>();
  const now = new Date();
  const threeMonthsAgo = new Date(now.setMonth(now.getMonth() - 3));

  repos.forEach((repo) => {
    if (!repo.languages?.edges) return;

    const totalSize = repo.languages.edges.reduce(
      (sum: number, edge: any) => sum + edge.size,
      0
    );

    repo.languages.edges.forEach((edge: any) => {
      const { name, color } = edge.node;
      const size = edge.size;

      const existing = languageMap.get(name);
      const percentage = (size / totalSize) * 100;

      if (!existing) {
        languageMap.set(name, {
          name,
          color,
          percentage,
          repoCount: 1,
          linesOfCode: size,
          trend: determineTrend(
            repo.defaultBranchRef?.target?.history?.totalCount || 0,
            threeMonthsAgo
          ),
          privateRepoCount: repo.isPrivate ? 1 : 0,
        });
      } else {
        existing.repoCount += 1;
        existing.linesOfCode += size;
        existing.percentage = (existing.percentage + percentage) / 2;
        existing.trend = determineTrend(
          repo.defaultBranchRef?.target?.history?.totalCount || 0,
          threeMonthsAgo
        );
        if (repo.isPrivate) existing.privateRepoCount += 1;
      }
    });
  });

  return Array.from(languageMap.values()).sort(
    (a, b) => b.linesOfCode - a.linesOfCode
  );
}

export function transformEngagement(data: any): GitHubEngagement {
  if (!data) throw new Error("Engagement data is required");

  const reviews = data.pullRequestReviewContributions.nodes;
  const totalReviews = reviews.length;

  // Calculate average review time
  const reviewTimes = reviews
    .filter((review: any) => review.pullRequest.mergedAt)
    .map((review: any) => {
      const created = new Date(review.pullRequest.createdAt);
      const reviewed = new Date(review.occurredAt);
      return reviewed.getTime() - created.getTime();
    });

  const avgReviewTime =
    reviewTimes.length > 0
      ? formatReviewTime(
          reviewTimes.reduce((a: number, b: number) => a + b, 0) /
            reviewTimes.length
        )
      : "N/A";

  // Calculate success rate
  const successfulReviews = reviews.filter(
    (review: any) => review.pullRequest.state === "MERGED"
  ).length;
  const reviewSuccessRate =
    totalReviews > 0 ? (successfulReviews / totalReviews) * 100 : 0;

  // Calculate streaks
  const { currentStreak, longestStreak, totalStreaks } = calculateStreaks(
    data.contributionCalendar.weeks
  );

  // Calculate review comments
  const totalReviewsComments = reviews.reduce(
    (sum: number, review: any) => sum + review.pullRequest.comments.totalCount,
    0
  );

  // Calculate issue resolution rate
  const issues = data.issueContributions.nodes;
  const totalIssues = issues.length;
  const resolutionTimes = issues
    .filter((issue: any) => issue.issue.closedAt)
    .map((issue: any) => {
      const created = new Date(issue.issue.createdAt);
      const closed = new Date(issue.issue.closedAt);
      return closed.getTime() - created.getTime();
    });

  const avgResolutionTime =
    resolutionTimes.length > 0
      ? formatReviewTime(
          resolutionTimes.reduce((a: number, b: number) => a + b, 0) /
            resolutionTimes.length
        )
      : "N/A";

  // Calculate issue resolution rate
  const closedIssues = issues.filter(
    (issue: any) => issue.issue.state === "CLOSED"
  ).length;
  const issueResolutionRate =
    totalIssues > 0 ? (closedIssues / totalIssues) * 100 : 0;

  return {
    currentStreak,
    longestStreak,
    totalStreaks,
    totalReviews,
    averageReviewTime: avgReviewTime,
    reviewSuccessRate: Math.round(reviewSuccessRate * 100) / 100,
    totalReviewComments: totalReviewsComments,
    averageIssueResolutionTime: avgResolutionTime,
    issueResolutionRate: Math.round(issueResolutionRate * 100) / 100,
  };
}

function calculateStreaks(weeks: any[]): {
  currentStreak: number;
  longestStreak: number;
  totalStreaks: number;
} {
  let currentStreak = 0;
  let longestStreak = 0;
  let totalStreaks = 0;
  let tempStreak = 0;

  // Flatten all contribution days
  const days = weeks
    .flatMap((week: any) => week.contributionDays)
    .sort(
      (a: any, b: any) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    );

  // Calculate current streak
  for (const day of days) {
    if (day.contributionCount > 0) {
      currentStreak++;
    } else {
      break;
    }
  }

  // Calculate longest streak and total streaks
  days.forEach((day: any) => {
    if (day.contributionCount > 0) {
      tempStreak++;
      if (tempStreak > longestStreak) {
        longestStreak = tempStreak;
      }
    } else {
      if (tempStreak > 0) {
        totalStreaks++;
        tempStreak = 0;
      }
    }
  });

  // Count the last streak if it exists
  if (tempStreak > 0) {
    totalStreaks++;
  }

  return { currentStreak, longestStreak, totalStreaks };
}

function formatReviewTime(ms: number): string {
  const hours = Math.floor(ms / (1000 * 60 * 60));
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}

function determineTrend(
  commitCount: number,
  threeMonthsAgo: Date
): "increasing" | "decreasing" | "stable" {
  // Simple trend determination based on commit frequency
  // This could be made more sophisticated based on requirements
  if (commitCount > 10) return "increasing";
  if (commitCount < 3) return "decreasing";
  return "stable";
}
