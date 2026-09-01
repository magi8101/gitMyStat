import { ContributionDay, RawStreakData, StreakStats } from "@/types/Streak";

export function calculateStreak(data: RawStreakData): StreakStats {
  const calendar = data.data.user!.contributionsCollection.contributionCalendar;

  const todayStr = new Date().toISOString().slice(0, 10);

  // GitHub pads the last week to a full Sun-Sat range, which can include
  // dates after today (with 0 contributions) - drop those before scanning.
  const days: ContributionDay[] = calendar.weeks
    .flatMap((week) => week.contributionDays)
    .filter((day) => day.date <= todayStr);

  let longestStreak = 0;
  let runningStreak = 0;

  for (const day of days) {
    if (day.contributionCount > 0) {
      runningStreak++;
      longestStreak = Math.max(longestStreak, runningStreak);
    } else {
      runningStreak = 0;
    }
  }

  // Current streak counts back from the most recent day, ignoring today
  // if it has no contributions yet (the day isn't over).
  let currentStreak = 0;
  for (let i = days.length - 1; i >= 0; i--) {
    const isToday = i === days.length - 1;
    if (days[i].contributionCount > 0) {
      currentStreak++;
    } else if (isToday) {
      continue;
    } else {
      break;
    }
  }

  return {
    currentStreak,
    longestStreak,
    totalContributions: calendar.totalContributions,
  };
}
