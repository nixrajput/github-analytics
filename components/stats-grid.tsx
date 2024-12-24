"use client";

import { Card } from "@/components/ui/card";
import {
  ContributionStats,
  GitHubEngagement,
  GitHubUser,
  Repository,
} from "@/lib/types";
import {
  GitCommit,
  GitPullRequest,
  CircleDot,
  Eye,
  Trophy,
  Clock,
  ThumbsUp,
  GitPullRequestDraft,
  Users,
  Code,
  Stars,
} from "lucide-react";

interface StatsGridProps {
  user: GitHubUser;
  stats: ContributionStats;
  engagement: GitHubEngagement;
  repositories: Repository[];
}

export function StatsGrid({
  user,
  stats,
  engagement,
  repositories,
}: StatsGridProps) {
  const totalStarsGained = repositories.reduce(
    (sum: number, repo: any) => sum + repo.stargazerCount,
    0
  );

  const items = [
    // User metrics
    {
      label: "Followers",
      value: user.followers.totalCount,
      icon: Users,
    },
    {
      label: "Following",
      value: user.following.totalCount,
      icon: Users,
    },
    {
      label: "Stars Gained",
      value: totalStarsGained,
      icon: Stars,
    },
    {
      label: "Total Repositories",
      value: user.repositories.totalCount,
      icon: Code,
    },
    {
      label: "Starred Repositories",
      value: user.starredRepositories.totalCount,
      icon: Stars,
    },

    // Contribution metrics
    {
      label: "Public Repositories",
      value: stats.totalRepositoryContributions,
      icon: Eye,
    },
    {
      label: "Total Commits",
      value: stats.contributionCalendar.totalContributions,
      icon: GitCommit,
    },
    {
      label: "Pull Requests",
      value: stats.totalPullRequestContributions,
      icon: GitPullRequest,
    },
    {
      label: "Issues",
      value: stats.totalIssueContributions,
      icon: CircleDot,
    },
    {
      label: "Private Contributions",
      value: stats.restrictedContributionsCount,
      icon: Eye,
    },
    {
      label: "Repositories Contributed",
      value: stats.totalRepositoriesWithContributedCommits,
      icon: Code,
    },

    // Engagement metrics
    {
      label: "Current Streak",
      value: `${engagement.currentStreak} days`,
      icon: Trophy,
    },
    {
      label: "Longest Streak",
      value: `${engagement.longestStreak} days`,
      icon: Trophy,
    },
    {
      label: "Total Streaks",
      value: engagement.totalStreaks,
      icon: Trophy,
    },
    {
      label: "Avg Review Time",
      value: engagement.averageReviewTime,
      icon: Clock,
    },
    {
      label: "Review Success",
      value: `${engagement.reviewSuccessRate}%`,
      icon: ThumbsUp,
    },
    {
      label: "Code Reviews",
      value: engagement.totalReviews,
      icon: GitPullRequestDraft,
    },
    {
      label: "Total Review Comments",
      value: engagement.totalReviewComments,
      icon: GitPullRequestDraft,
    },
    {
      label: "Avg Issue Resolution",
      value: engagement.averageIssueResolutionTime,
      icon: Clock,
    },
    {
      label: "Issue Resolution Rate",
      value: `${engagement.issueResolutionRate}%`,
      icon: ThumbsUp,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((item) => (
        <Card key={item.label} className="p-4">
          <div className="flex items-center space-x-2">
            <item.icon className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-medium">{item.label}</h3>
          </div>
          <p className="mt-2 text-2xl font-bold">{item.value}</p>
        </Card>
      ))}
    </div>
  );
}
