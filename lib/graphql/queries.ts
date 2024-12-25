export const GET_USER_PROFILE = `
  query GetUserProfile($username: String!) {
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
      status {
        emoji
        emojiHTML
        message
      }
      organizations(first: 100) {
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
      repositories {
        totalCount
      }
      starredRepositories {
        totalCount
      }
      sponsors {
        totalCount
      }
    }
  }
`;

export const GET_USER_CONTRIBUTIONS = `
  query GetUserContributions($username: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $username) {
      contributionsCollection(from: $from, to: $to) {
        contributionYears
        restrictedContributionsCount
        totalCommitContributions
        totalIssueContributions
        totalPullRequestContributions
        totalPullRequestReviewContributions
        totalRepositoriesWithContributedCommits
        totalRepositoriesWithContributedIssues
        totalRepositoriesWithContributedPullRequestReviews
        totalRepositoriesWithContributedPullRequests
        totalRepositoryContributions
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
  query GetUserRepositories($username: String!, $first: Int!) {
    user(login: $username) {
      repositories(first: $first, orderBy: {field: STARGAZERS, direction: DESC}) {
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
          licenseInfo {
            name
            nickname
          }
          watchers {
            totalCount
          }
          issues(first: 10, orderBy: {field: CREATED_AT, direction: DESC}) {
            totalCount
          }
          pullRequests(first: 10, orderBy: {field: CREATED_AT, direction: DESC}) {
            totalCount
          }
          releases(first: 10, orderBy: {field: CREATED_AT, direction: DESC}) {
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
          collaborators(first: 10, affiliation: ALL) {
            totalCount
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
            issue {
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
  query GetUserLanguages($username: String!, $first: Int!) {
    user(login: $username) {
      repositories(first: $first, orderBy: {field: UPDATED_AT, direction: DESC}) {
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
