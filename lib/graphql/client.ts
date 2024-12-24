import { GraphQLClient } from 'graphql-request';

if (!process.env.NEXT_PUBLIC_GITHUB_TOKEN) {
  throw new Error('NEXT_PUBLIC_GITHUB_TOKEN is not defined');
}

export const graphqlClient = new GraphQLClient('https://api.github.com/graphql', {
  headers: {
    authorization: `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
  },
});

export async function executeGraphQLQuery<T>(query: string, variables: any): Promise<T> {
  try {
    return await graphqlClient.request<T>(query, variables);
  } catch (error: any) {
    if (error.response?.errors) {
      throw new Error(error.response.errors[0].message);
    }
    throw error;
  }
}