export interface GitHubUser {
  login: string;
  name: string;
  avatarUrl: string;
  bio: string;
  location: string;
  company: string;
  createdAt: Date;
  followers: {
    totalCount: number;
  };
  following: {
    totalCount: number;
  };
  repositories: {
    totalCount: number;
  };
  starredRepositories: {
    totalCount: number;
  };
}

export interface ContributionStats {
  totalCommitContributions: number;
  totalPullRequestContributions: number;
  totalIssueContributions: number;
  totalRepositoryContributions: number;
  restrictedContributionsCount: number;
  totalRepositoriesWithContributedCommits: number;
  contributionCalendar: {
    totalContributions: number;
    weeks: {
      contributionDays: {
        contributionCount: number;
        date: string;
      }[];
    }[];
  };
}

export interface Repository {
  name: string;
  description: string;
  url: string;
  stargazerCount: number;
  forkCount: number;
  isPrivate: boolean;
  primaryLanguage: {
    name: string;
    color: string;
  } | null;
}

export interface LanguageStats {
  name: string;
  percentage: number;
  color: string;
  repoCount: number;
  linesOfCode: number;
  trend: "increasing" | "decreasing" | "stable";
  privateRepoCount: number;
}

export interface GitHubEngagement {
  currentStreak: number;
  longestStreak: number;
  totalStreaks: number;
  totalReviews: number;
  averageReviewTime: string;
  reviewSuccessRate: number;
  totalReviewComments: number;
  averageIssueResolutionTime: string;
  issueResolutionRate: number;
}

export interface GitHubStats {
  user: GitHubUser;
  contributions: ContributionStats;
  repositories: Repository[];
  languages: LanguageStats[];
  engagement: GitHubEngagement;
}
