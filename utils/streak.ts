import { getTokenPool } from "@/helpers/tokenPool";
import { RawStreakData } from "@/types/Streak";

export default async function StreakData(user: string) {
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
query GetStreak($login: String!) {
  user(login: $login) {
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            date
            contributionCount
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

  const data: RawStreakData = await response.json();
  return data;
}
