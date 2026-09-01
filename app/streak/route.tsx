import generateSvg from "@/helpers/generateSvg";
import Send from "@/helpers/send";
import { getData } from "@/helpers/getData";
import { ThemeData } from "@/types/Theme";
import Error from "../Error";
import StreakData from "@/utils/streak";
import { calculateStreak } from "@/helpers/calculateStreak";
import StreakComp from "./Streak";
import { RawStreakData } from "@/types/Streak";

// /streak?user=rahuletto
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const { user, color, accent, background, border, radius, padding, tip } =
    getData(searchParams);

  const theme: ThemeData = {
    user: user ?? "rahuletto",
    color: color ?? "#E6EDF3",
    accent: accent ?? "#8D96A0",
    background: background ?? "#0D1116",
    border: border ?? "#30363D",
    radius: radius ?? 24,
    padding: padding ?? 24,
    tip: tip ?? "#F6C655",
  };

  try {
    const rawdata: RawStreakData = await StreakData(user || "rahuletto");

    if (!rawdata.data?.user || (rawdata.errors && rawdata.errors[0])) {
      const image = await generateSvg(
        Error(theme, {
          message: rawdata.errors
            ? rawdata.errors[0]?.message
            : `There is no user with username "${user}"`,
          code: rawdata.errors ? rawdata.errors[0]?.type : "NOT_FOUND",
        }),
        {
          width: 500,
          height: 170,
        }
      );

      return Send(image, {error: true});
    }

    const data = calculateStreak(rawdata);

    const image = await generateSvg(StreakComp(data, theme), {
      width: 285,
      height: 220,
    });

    return Send(image, {delay: 0.2});
  } catch (err: any) {
    console.warn(err);

    const image = await generateSvg(
      Error(theme, {
        message: (err as Error).message,
        code: (err as Error).name,
      }),
      {
        width: 500,
        height: 170,
      }
    );

    return Send(image, {error: true});
  }
}
