import type { GitHubQuery } from '@/lib/graphql/queries';

type Visibility = { isPrivate: boolean } | null | undefined;
type ByRepository = { repository: Visibility; contributions: { totalCount: number } }[];

const isPublic = (repository: Visibility) => repository?.isPrivate === false;

const publicTotal = (list: ByRepository) =>
  list.filter((r) => isPublic(r.repository)).reduce((n, r) => n + r.contributions.totalCount, 0);

// Removes what only the viewer's own access reveals about another user: private repositories,
// contributions to them and restricted contributions. The queries already ask for public repositories.
// ponytail: totals count at most 100 repositories per year range (GitHub's maxRepositories cap).
export function publicOnly(query: GitHubQuery, data: any) {
  const user = data?.user;
  if (!user) return data;

  if (query === 'repositories' || query === 'languages') {
    user.repositories.nodes = user.repositories.nodes.filter(
      (repo: { isPrivate: boolean }) => repo.isPrivate === false
    );
  }

  const collection = user.contributionsCollection;
  if (query === 'contributions' && collection) {
    const {
      commitContributionsByRepository: commits,
      issueContributionsByRepository: issues,
      pullRequestContributionsByRepository: pullRequests,
      repositoryContributions: created,
      ...rest
    } = collection;
    user.contributionsCollection = {
      ...rest,
      totalCommitContributions: publicTotal(commits),
      totalIssueContributions: publicTotal(issues),
      totalPullRequestContributions: publicTotal(pullRequests),
      totalRepositoriesWithContributedCommits: commits.filter((r: ByRepository[number]) =>
        isPublic(r.repository)
      ).length,
      totalRepositoryContributions: created.nodes.filter((n: { repository: Visibility }) =>
        isPublic(n.repository)
      ).length,
    };
  }

  if (query === 'engagement' && collection) {
    collection.pullRequestReviewContributions.nodes =
      collection.pullRequestReviewContributions.nodes.filter(
        (n: { isRestricted: boolean; repository: Visibility }) =>
          !n.isRestricted && isPublic(n.repository)
      );
    collection.issueContributions.nodes = collection.issueContributions.nodes.filter(
      (n: { isRestricted: boolean; issue: { repository: Visibility } | null }) =>
        !n.isRestricted && isPublic(n.issue?.repository)
    );
  }

  return data;
}
