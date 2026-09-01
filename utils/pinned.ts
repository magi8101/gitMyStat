import { RawPinnedData } from "@/types/Pinned";
import { getTokenPool } from "@/helpers/tokenPool";

export default async function PinnedData(user: string) {
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
query GetPinned($login: String!) {
  user(login: $login) {
    pinnedItems(first: 6, types: [REPOSITORY]) {
      nodes {
        ... on Repository {
          name
          description
          url
          stargazerCount
          forkCount
          primaryLanguage {
            name
            color
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

  tokenPool.updateTokenState(response.headers);

  const data: RawPinnedData = await response.json();
  return data;
}
