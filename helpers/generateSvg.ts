import { ReactNode } from "react";
import satori from "satori";
import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { getIconCode, loadEmoji } from "./emoji";

// Get absolute path to assets directory (works on both local and Vercel)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const assetDir = join(__dirname, "../assets");

// Load fonts with fallback - some environments may not have access to file paths
let urbanist: Buffer;
let urbanistBold: Buffer;

try {
  // Try to load from assets directory first
  if (existsSync(join(assetDir, "Urbanist-SemiBold.ttf"))) {
    urbanist = readFileSync(join(assetDir, "Urbanist-SemiBold.ttf"));
  } else {
    // Fallback: use empty buffer (will use system font)
    urbanist = Buffer.alloc(0);
  }
  
  if (existsSync(join(assetDir, "Urbanist-Bold.ttf"))) {
    urbanistBold = readFileSync(join(assetDir, "Urbanist-Bold.ttf"));
  } else {
    // Fallback: use empty buffer (will use system font)
    urbanistBold = Buffer.alloc(0);
  }
} catch (error) {
  console.warn("Failed to load Urbanist fonts from file system, using system fonts as fallback");
  urbanist = Buffer.alloc(0);
  urbanistBold = Buffer.alloc(0);
}

export default async function generateSvg(
  fn: ReactNode,
  options: { width: number; height: number }
) {
  // Only include fonts if they were successfully loaded
  const fonts: Array<{ weight: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900; style: "normal" | "italic"; data: Buffer; name: string }> = [];
  
  if (urbanist.length > 0) {
    fonts.push({
      weight: 500,
      style: "normal",
      data: urbanist,
      name: "Urbanist",
    });
  }
  
  if (urbanistBold.length > 0) {
    fonts.push({
      weight: 600,
      style: "normal",
      data: urbanistBold,
      name: "Urbanist",
    });
  }

  const data = await satori(fn, {
    width: options.width,
    height: options.height,
    fonts: fonts,
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
