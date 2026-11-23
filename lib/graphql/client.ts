import 'server-only';
import { GraphQLClient } from 'graphql-request';

export function executeGraphQLQuery<T>(
  query: string,
  variables: Record<string, unknown>,
  token: string
): Promise<T> {
  return new GraphQLClient('https://api.github.com/graphql', {
    headers: { authorization: `Bearer ${token}` },
  }).request<T>(query, variables);
}
