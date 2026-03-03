
import { RawLanguageData } from "@/types/Languages";
import { getTokenPool } from "@/helpers/tokenPool";

export default async function LangData(user: string) {
  const tokenPool = getTokenPool();
  const token = tokenPool.getNextToken();

  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      "Cache-Control": "private; stale-while-revalidate=3600",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      query: `
                  query GetUserLanguages($login: String!) {
  user(login: $login) {
    repositories(
      first: 100
    ) {
      edges {
        node {
          languages(first: 10) {
            totalSize
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
}
              `,
      variables: { login: user },
    }),
  });

  // Track rate limit state from response headers
  tokenPool.updateTokenState(response.headers);

  const data: RawLanguageData = await response.json();

  return data
}