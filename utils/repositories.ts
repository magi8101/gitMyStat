import { getTokenPool } from "@/helpers/tokenPool";

export default async function RepoList(user: string) {
  const tokenPool = getTokenPool();
  const token = tokenPool.getNextToken();

  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "private; stale-while-revalidate=3600",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      query: `
                query GetUserRepos($login: String!) {
      user(login: $login) {
        repositories(first: 1, orderBy: {direction: DESC, field: PUSHED_AT}) {
          edges {
            node {
              id
              url
              name
              description
              primaryLanguage {
                name
              }
            }
          }
        }
      }
    }
            `,
      variables: { login: user },
    }),
  });

  // Track rate limit state from response headers
  tokenPool.updateTokenState(response.headers);

  const data = await response.json();
  return data;
}
