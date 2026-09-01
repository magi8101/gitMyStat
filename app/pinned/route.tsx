import generateSvg from "@/helpers/generateSvg";
import Send from "@/helpers/send";
import { getData } from "@/helpers/getData";
import { ThemeData } from "@/types/Theme";
import Error from "../Error";
import PinnedData from "@/utils/pinned";
import PinnedComp, { ROW_GAP, TILE_HEIGHT } from "./Pinned";

// /pinned?username=rahuletto
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
    const rawdata = await PinnedData(user || "rahuletto");

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

    const pinned = rawdata.data.user.pinnedItems.nodes;

    if (pinned.length === 0) {
      const image = await generateSvg(
        Error(theme, {
          message: `"${user}" has no pinned repositories`,
          code: "NO_PINNED",
        }),
        {
          width: 500,
          height: 170,
        }
      );

      return Send(image, {error: true});
    }

    const rows = Math.ceil(pinned.length / 2);
    const gridHeight = rows * TILE_HEIGHT + (rows - 1) * ROW_GAP;

    const image = await generateSvg(PinnedComp(pinned, theme), {
      width: 500,
      height: gridHeight + theme.padding * 2,
    });

    return Send(image);
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
