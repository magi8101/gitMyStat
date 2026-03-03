import { ReactNode } from "react";
import satori from "satori";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { getIconCode, loadEmoji } from "./emoji";

// Get absolute path to assets directory (works on both local and Vercel)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const assetDir = join(__dirname, "../assets");
const urbanist = readFileSync(join(assetDir, "Urbanist-SemiBold.ttf"));
const urbanistBold = readFileSync(join(assetDir, "Urbanist-Bold.ttf"));

export default async function generateSvg(
  fn: ReactNode,
  options: { width: number; height: number }
) {
  const data = await satori(fn, {
    width: options.width,
    height: options.height,
    fonts: [
      {
        weight: 500,
        style: "normal",
        data: urbanist,
        name: "Urbanist",
      },
      {
        weight: 600,
        style: "normal",
        data: urbanistBold,
        name: "Urbanist",
      },
    ],
    loadAdditionalAsset: async (code: string, segment: string) => {
      if (code === "emoji") {

        return `data:image/svg+xml;base64,${btoa(await loadEmoji(getIconCode(segment)))}`;
      }


      // if segment is normal text
      return code;
    }
  
  });

  return data;
}
