import { RawRepoData } from "@/types/Repo";
import { getTokenPool } from "@/helpers/tokenPool";

export default async function RepoData(user: string, repo: string) {
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
      query GetRepository($owner: String!, $name: String!) {
  repositoryOwner(login: $owner) {
    repository(name: $name) {
      name
      description
      stargazerCount
      forkCount
      primaryLanguage {
        name
        color
      }
    } 
  }
}
            `,
      variables: { owner: user, name: repo },
    }),
  });

  // Track rate limit state from response headers
  tokenPool.updateTokenState(response.headers);

  const data: RawRepoData = await response.json();
  return data;
}
