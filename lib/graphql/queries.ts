export const GET_USER_PROFILE = `
  query GetUserProfile($username: String!) {
    user(login: $username) {
      name
      login
      avatarUrl
      bio
      company
      location
      createdAt
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
    }
  }
`;

export const GET_USER_CONTRIBUTIONS = `
  query GetUserContributions($username: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $username) {
      # Include private contributions
      contributionsCollection(from: $from, to: $to) {
        totalCommitContributions
        totalPullRequestContributions
        totalIssueContributions
        totalRepositoryContributions
        # Added private contributions
        restrictedContributionsCount
        # Added commit count details
        totalCommitContributions
        totalRepositoriesWithContributedCommits
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              contributionCount
              date
            }
          }
        }
      }
    }
  }
`;

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
          isPrivate
          primaryLanguage {
            name
            color
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
