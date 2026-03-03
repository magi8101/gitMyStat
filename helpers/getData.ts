import { Themes } from "@/themes";
import { ThemeData } from "@/types/Theme";

// Validate hex color format
function validateHexColor(hex: string): string {
  try {
    const decoded = decodeURIComponent(hex).replace(/^0x/, "#");
    // Match #RGB or #RRGGBB format
    if (!/^#([a-fA-F0-9]{3}|[a-fA-F0-9]{6})$/.test(decoded)) {
      throw new Error("Invalid hex color");
    }
    return decoded;
  } catch {
    throw new Error("Invalid hex color");
  }
}

// Validate numeric range
function validateNumber(value: string | null, min: number, max: number, defaultVal: number): number {
  if (!value) return defaultVal;
  const num = Number(value);
  if (isNaN(num)) return defaultVal;
  return Math.min(Math.max(num, min), max);
}

export function getData(searchParams: URLSearchParams): ThemeData {
  const username = searchParams.has("username");
  const user = (username ? searchParams.get("username") : "rahuletto") as string;

  const hasTheme = searchParams.has("theme");
  let theme = hasTheme ? searchParams.get("theme") : "dark";
  if (!theme || !Themes[theme as string]?.accent) theme = "dark";

  const hasColor = searchParams.has("color");
  let color = "#E6EDF3";
  if (hasColor) {
    try {
      color = validateHexColor(searchParams.get("color") as string);
    } catch {
      color = hasTheme ? Themes[theme as string].color : "#E6EDF3";
    }
  } else {
    color = hasTheme ? Themes[theme as string].color : "#E6EDF3";
  }

  const hasAccent = searchParams.has("accent");
  let accent = "#8D96A0";
  if (hasAccent) {
    try {
      accent = validateHexColor(searchParams.get("accent") as string);
    } catch {
      accent = hasTheme ? Themes[theme as string].accent : "#8D96A0";
    }
  } else {
    accent = hasTheme ? Themes[theme as string].accent : "#8D96A0";
  }

  const hasBg = searchParams.has("background");
  let background = "#0D1116";
  if (hasBg) {
    try {
      background = validateHexColor(searchParams.get("background") as string);
    } catch {
      background = hasTheme ? Themes[theme as string].background : "#0D1116";
    }
  } else {
    background = hasTheme ? Themes[theme as string].background : "#0D1116";
  }

  const hasBorder = searchParams.has("border");
  let border = "#30363D";
  if (hasBorder) {
    try {
      border = validateHexColor(searchParams.get("border") as string);
    } catch {
      border = hasTheme ? Themes[theme as string].border : "#30363D";
    }
  } else {
    border = hasTheme ? Themes[theme as string].border : "#30363D";
  }

  const hasTip = searchParams.has("tip");
  let tip = "#30363D";
  if (hasTip) {
    try {
      tip = validateHexColor(searchParams.get("tip") as string);
    } catch {
      tip = hasTheme ? Themes[theme as string].tip : "#30363D";
    }
  } else {
    tip = hasTheme ? Themes[theme as string].tip : "#30363D";
  }

  const hasRad = searchParams.has("radius");
  const radius = validateNumber(searchParams.get("radius"), 0, 100, hasTheme ? Themes[theme as string].radius : 24);

  const hasPad = searchParams.has("padding");
  const padding = validateNumber(searchParams.get("padding"), 0, 500, hasTheme ? Themes[theme as string].padding : 24);

  return {
    theme,
    user,
    color,
    accent,
    background,
    border,
    tip,
    radius,
    padding,
  };
}
