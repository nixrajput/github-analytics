import { ClientError } from 'graphql-request';
import { executeGraphQLQuery } from '@/lib/graphql/client';
import { QUERIES, type GitHubQuery } from '@/lib/graphql/queries';

// GitHub logins: letters, digits, hyphens (underscores for managed users), 39 chars max.
const USERNAME = /^[A-Za-z0-9_-]{1,39}$/;

function isDate(value: unknown): value is string {
  return typeof value === 'string' && !Number.isNaN(Date.parse(value));
}

function badRequest(error: string) {
  return Response.json({ error }, { status: 400 });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const { query, username, from, to } = body ?? {};

  if (typeof query !== 'string' || !Object.hasOwn(QUERIES, query)) {
    return badRequest('Unknown query');
  }
  if (typeof username !== 'string' || !USERNAME.test(username)) {
    return badRequest('Invalid GitHub username');
  }

  const name = query as GitHubQuery;
  let variables: Record<string, unknown> = { username };
  if (name === 'repositories' || name === 'languages') {
    variables = { username, first: 100 };
  } else if (name === 'contributions' || name === 'engagement') {
    if (!isDate(from) || !isDate(to)) {
      return badRequest('Invalid date range');
    }
    variables = {
      username,
      from: new Date(from).toISOString(),
      to: new Date(to).toISOString(),
    };
  }

  try {
    return Response.json(await executeGraphQLQuery(QUERIES[name], variables));
  } catch (error) {
    // Return only GitHub's GraphQL error message: ClientError.message also embeds
    // the upstream response headers and body.
    const message =
      error instanceof ClientError
        ? error.response.errors?.[0]?.message
        : undefined;
    console.error('GitHub query failed:', name, message ?? error);
    return Response.json(
      { error: message ?? 'GitHub request failed' },
      { status: 502 }
    );
  }
}
