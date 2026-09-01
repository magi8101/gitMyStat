import { QLError } from "./Error";

export interface ContributionDay {
  date: string;
  contributionCount: number;
}

export interface RawStreakData {
  data: {
    user: {
      contributionsCollection: {
        contributionCalendar: {
          totalContributions: number;
          weeks: {
            contributionDays: ContributionDay[];
          }[];
        };
      };
    } | null;
  };
  errors?: QLError[];
}

export interface StreakStats {
  currentStreak: number;
  longestStreak: number;
  totalContributions: number;
}
