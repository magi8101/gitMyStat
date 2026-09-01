import { ThemeData } from "@/types/Theme";
import { StreakStats } from "@/types/Streak";
import Container from "../Container";
import { GoFlame } from "react-icons/go";
import { formatNumber } from "@/helpers/formatNum";

export default function StreakComp(data: StreakStats, theme: ThemeData) {
  return (
    <Container theme={theme}>
      <div tw="flex align-center flex-col justify-center w-full">
        <div tw="flex flex-col items-center w-full" style={{ gap: 4 }}>
          <div tw="flex items-center" style={{ gap: 8 }}>
            <GoFlame color={theme.tip} size={40} />
            <div tw={`flex text-[${theme.color}] font-bold text-[48px]`}>
              {data.currentStreak}
            </div>
          </div>
          <div tw={`flex text-[${theme.accent}] text-lg font-medium`}>
            @{theme.user}&apos;s current streak
          </div>
        </div>
        <div tw="flex flex-col mt-6 items-center w-full" style={{ gap: 10 }}>
          <div tw="flex justify-between w-full">
            <div tw={`flex text-[${theme.color}] text-xl font-bold`}>
              Longest streak
            </div>
            <div tw={`flex text-[${theme.accent}] text-lg font-medium`}>
              {formatNumber(data.longestStreak)}
            </div>
          </div>

          <div tw="flex justify-between w-full">
            <div tw={`flex text-[${theme.color}] text-xl font-bold`}>
              Total contributions
            </div>
            <div tw={`flex text-[${theme.accent}] text-lg font-medium`}>
              {formatNumber(data.totalContributions)}
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
