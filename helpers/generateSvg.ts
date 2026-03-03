import { ReactNode } from "react";
import satori from "satori";
import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { getIconCode, loadEmoji } from "./emoji";

// Use process.cwd() which is reliable in Next.js production (Vercel)
const assetDir = join(process.cwd(), "assets");

// Load fonts with error logging
let urbanist: Buffer;
let urbanistBold: Buffer;

try {
  const semiBoldPath = join(assetDir, "Urbanist-SemiBold.ttf");
  const boldPath = join(assetDir, "Urbanist-Bold.ttf");
  
  console.log("Attempting to load fonts from:", assetDir);
  console.log("SemiBold exists:", existsSync(semiBoldPath));
  console.log("Bold exists:", existsSync(boldPath));
  
  if (existsSync(semiBoldPath)) {
    urbanist = readFileSync(semiBoldPath);
    console.log("✓ Loaded Urbanist-SemiBold:", urbanist.length, "bytes");
  } else {
    throw new Error(`Font not found: ${semiBoldPath}`);
  }
  
  if (existsSync(boldPath)) {
    urbanistBold = readFileSync(boldPath);
    console.log("✓ Loaded Urbanist-Bold:", urbanistBold.length, "bytes");
  } else {
    throw new Error(`Font not found: ${boldPath}`);
  }
} catch (error) {
  console.error("FATAL: Failed to load fonts:", error);
  throw new Error(`Font loading failed: ${(error as Error).message}`);
}

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
