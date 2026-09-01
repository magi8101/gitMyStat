import { ThemeData } from "@/types/Theme";
import { PinnedRepo } from "@/types/Pinned";
import { GoRepo, GoRepoForked, GoStar } from "react-icons/go";
import Container from "../Container";

export const TILE_HEIGHT = 96;
export const ROW_GAP = 12;

function Tile({ repo, theme }: { repo: PinnedRepo; theme: ThemeData }) {
  const description = repo.description ?? "";
  const sliced = description.slice(0, 60);

  return (
    <div
      tw={`flex flex-col border-2 border-solid border-[${theme.border}] rounded-[${theme.radius}px] p-3`}
      style={{
        gap: 4,
        width: "48%",
        height: TILE_HEIGHT,
        overflow: "hidden",
      }}
    >
      <div
        style={{ gap: 6, flexShrink: 0 }}
        tw="flex flex-row items-center"
      >
        <GoRepo color={theme.color} size={16} />
        <div tw={`flex text-[${theme.color}] text-base font-bold`}>
          {repo.name}
        </div>
      </div>
      <div
        tw={`flex text-[${theme.accent}] text-xs`}
        style={{ flexGrow: 1, overflow: "hidden" }}
      >
        {sliced.length === description.length ? description : sliced + "..."}
      </div>
      <div
        tw="flex flex-row mt-1"
        style={{ gap: 16, flexShrink: 0 }}
      >
        {repo.primaryLanguage ? (
          <div tw="flex items-center" style={{ gap: 6 }}>
            <div
              tw={`h-2 w-2 rounded-full bg-[${repo.primaryLanguage.color ?? theme.accent}]`}
            />
            <span tw={`text-xs font-medium text-[${theme.color}]`}>
              {repo.primaryLanguage.name}
            </span>
          </div>
        ) : null}
        <div tw="flex items-center" style={{ gap: 4 }}>
          <GoStar color={theme.tip} size={12} />
          <div tw={`flex text-xs text-[${theme.accent}]`}>
            {repo.stargazerCount}
          </div>
        </div>
        <div tw="flex items-center" style={{ gap: 4 }}>
          <GoRepoForked color={theme.tip} size={12} />
          <div tw={`flex text-xs text-[${theme.accent}]`}>
            {repo.forkCount}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PinnedComp(data: PinnedRepo[], theme: ThemeData) {
  return (
    <Container theme={theme}>
      <div
        tw="flex flex-row flex-wrap w-full justify-between"
        style={{ rowGap: ROW_GAP }}
      >
        {data.map((repo) => (
          <Tile key={repo.url} repo={repo} theme={theme} />
        ))}
      </div>
    </Container>
  );
}
