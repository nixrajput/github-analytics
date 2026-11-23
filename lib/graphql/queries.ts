export const GET_USER_PROFILE = `
  query GetUserProfile($username: String!, $own: Boolean!, $privacy: RepositoryPrivacy) {
    user(login: $username) {
      name
      login
      email
      avatarUrl
      bio
      company
      location
      createdAt
      hasSponsorsListing
      isBountyHunter
      isCampusExpert
      isDeveloperProgramMember
      isEmployee
      isGitHubStar
      status @include(if: $own) {
        emoji
        emojiHTML
        message
      }
      organizations(first: 100) @include(if: $own) {
        nodes {
          avatarUrl
          name
          url
        }
      }
      followers {
        totalCount
      }
      following {
        totalCount
      }
      repositories(privacy: $privacy) {
        totalCount
      }
      starredRepositories {
        totalCount
      }
      sponsors @include(if: $own) {
        totalCount
      }
    }
  }
`;

export const GET_USER_CONTRIBUTIONS = `
  query GetUserContributions($username: String!, $from: DateTime!, $to: DateTime!, $own: Boolean!) {
    user(login: $username) {
      contributionsCollection(from: $from, to: $to) {
        contributionYears
        restrictedContributionsCount @include(if: $own)
        totalCommitContributions @include(if: $own)
        totalIssueContributions @include(if: $own)
        totalPullRequestContributions @include(if: $own)
        totalPullRequestReviewContributions @include(if: $own)
        totalRepositoriesWithContributedCommits @include(if: $own)
        totalRepositoriesWithContributedIssues @include(if: $own)
        totalRepositoriesWithContributedPullRequestReviews @include(if: $own)
        totalRepositoriesWithContributedPullRequests @include(if: $own)
        totalRepositoryContributions @include(if: $own)
        commitContributionsByRepository(maxRepositories: 100) @skip(if: $own) {
          repository { isPrivate }
          contributions { totalCount }
        }
        issueContributionsByRepository(maxRepositories: 100) @skip(if: $own) {
          repository { isPrivate }
          contributions { totalCount }
        }
        pullRequestContributionsByRepository(maxRepositories: 100) @skip(if: $own) {
          repository { isPrivate }
          contributions { totalCount }
        }
        repositoryContributions(first: 100) @skip(if: $own) {
          nodes {
            repository { isPrivate }
          }
        }
        contributionCalendar {
          totalContributions
          colors
          isHalloween
          months {
            firstDay
            name
            totalWeeks
            year
          }
          weeks {
            contributionDays {
              color
              contributionCount
              date
            }
          }
        }
      }
    }
  }
`;

// firstIssueContribution(first: 1) {
//   nodes {
//     occurredAt
//     isRestricted
//     url
//   }
// }
// firstPullRequestContribution(first: 1) {
//   nodes {
//     occurredAt
//     isRestricted
//     url
//   }
// }
// firstRepositoryContribution(first: 1) {
//   nodes {
//     occurredAt
//     isRestricted
//     url
//   }
// }

export const GET_USER_REPOSITORIES = `
  query GetUserRepositories($username: String!, $first: Int!, $privacy: RepositoryPrivacy) {
    user(login: $username) {
      repositories(first: $first, privacy: $privacy, orderBy: {field: STARGAZERS, direction: DESC}) {
        nodes {
          name
          description
          url
          stargazerCount
          forkCount
          diskUsage
          homepageUrl
          visibility
          createdAt
          pushedAt
          isPrivate
          isArchived
          isFork
          isEmpty
          isInOrganization
          primaryLanguage {
            name
            color
          }
          watchers {
            totalCount
          }
          languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
            edges {
              size
              node {
                name
                color
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_USER_ENGAGEMENT = `
  query GetUserEngagement($username: String!, $from: DateTime!) {
    user(login: $username) {
      contributionsCollection(from: $from) {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              contributionCount
              date
            }
          }
        }
        pullRequestReviewContributions(first: 100) {
          nodes {
            isRestricted
            repository { isPrivate }
            pullRequest {
              createdAt
              mergedAt
              state
              comments {
                totalCount
              }
              reviewDecision
            }
            occurredAt
          }
        }
        issueContributions(first: 100) {
          nodes {
            isRestricted
            issue {
              repository { isPrivate }
              createdAt
              closedAt
              state
              comments {
                totalCount
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_USER_LANGUAGES = `
  query GetUserLanguages($username: String!, $first: Int!, $privacy: RepositoryPrivacy) {
    user(login: $username) {
      repositories(first: $first, privacy: $privacy, orderBy: {field: UPDATED_AT, direction: DESC}) {
        nodes {
          isPrivate
          languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
            edges {
              size
              node {
                name
                color
              }
            }
          }
          defaultBranchRef {
            target {
              ... on Commit {
                history {
                  totalCount
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const QUERIES = {
  profile: GET_USER_PROFILE,
  contributions: GET_USER_CONTRIBUTIONS,
  repositories: GET_USER_REPOSITORIES,
  engagement: GET_USER_ENGAGEMENT,
  languages: GET_USER_LANGUAGES,
};

export type GitHubQuery = keyof typeof QUERIES;
