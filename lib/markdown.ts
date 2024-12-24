import { GitHubStats } from "./types";

export function generateMarkdown(stats: GitHubStats): string {
  return `
# ${stats.user.name}'s GitHub Statistics

## 📊 Profile Overview
- **Username:** [@${stats.user.login}](https://github.com/${stats.user.login})
- **Followers:** ${stats.user.followers.totalCount}
- **Following:** ${stats.user.following.totalCount}
- **Total Repositories:** ${stats.user.repositories.totalCount}

## 🏆 Contribution Statistics
- **Total Contributions:** ${
    stats.contributions.contributionCalendar.totalContributions
  }
- **Pull Requests:** ${stats.contributions.totalPullRequestContributions}
- **Issues:** ${stats.contributions.totalIssueContributions}
- **Code Reviews:** ${stats.contributions.totalCommitContributions}

## 🔥 Streak Statistics
- **Current Streak:** ${stats.engagement.currentStreak} days
- **Longest Streak:** ${stats.engagement.longestStreak} days
- **Total Streak:** ${stats.engagement.totalStreaks} days

## 📈 Language Distribution
${stats.languages
  .map((lang) => `- ${lang.name}: ${lang.percentage.toFixed(1)}%`)
  .join("\n")}

*Generated with [GitHub Analytics Dashboard](https://github.com/nixrajput/github-analytics)*
`.trim();
}
