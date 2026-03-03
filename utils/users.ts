import { RawUserData } from "@/types/UserStats";
import { getTokenPool } from "@/helpers/tokenPool";

export default async function UserData(user: string) {
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
query GetUser($login: String!) {
  user(login: $login) {
      contributionsCollection {
      totalCommitContributions
      totalPullRequestContributions
      totalIssueContributions
      contributionCalendar {
        totalContributions
      }
      totalRepositoriesWithContributedCommits
    }
    repositories(first: 100) {
      nodes {
        stargazers {
          totalCount
        }
      }
    }
    issues {
      totalCount
    }
    pullRequests {
      totalCount
    }
    followers {
      totalCount
    }
  }
}
            `,
      variables: { login: user },
    }),
  });

  // Track rate limit state from response headers
  tokenPool.updateTokenState(response.headers);

  const data: RawUserData = await response.json();
  return data;
}
