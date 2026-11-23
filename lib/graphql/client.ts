import 'server-only';
import { GraphQLClient } from 'graphql-request';

// The token stays on the server: the browser calls app/api/github/route.ts, never GitHub.
export function executeGraphQLQuery<T>(
  query: string,
  variables: Record<string, unknown>
): Promise<T> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error('GITHUB_TOKEN is not defined');
  }

  return new GraphQLClient('https://api.github.com/graphql', {
    headers: { authorization: `Bearer ${token}` },
  }).request<T>(query, variables);
}
