/**
 * Pre-defined brand palettes for auto-generated ventures.
 * The build orchestrator picks one based on the product vertical
 * or generates a custom one via the design agent.
 */

export const PALETTES = {
  ocean: {
    primary: "#0ea5e9",
    primaryDark: "#0284c7",
    accent: "#6366f1",
    gradient: "from-sky-500 to-indigo-500",
    gradientHover: "from-sky-400 to-indigo-400",
  },
  emerald: {
    primary: "#10b981",
    primaryDark: "#059669",
    accent: "#06b6d4",
    gradient: "from-emerald-500 to-cyan-500",
    gradientHover: "from-emerald-400 to-cyan-400",
  },
  sunset: {
    primary: "#f97316",
    primaryDark: "#ea580c",
    accent: "#ef4444",
    gradient: "from-orange-500 to-red-500",
    gradientHover: "from-orange-400 to-red-400",
  },
  violet: {
    primary: "#8b5cf6",
    primaryDark: "#7c3aed",
    accent: "#ec4899",
    gradient: "from-violet-500 to-pink-500",
    gradientHover: "from-violet-400 to-pink-400",
  },
  midnight: {
    primary: "#3b82f6",
    primaryDark: "#2563eb",
    accent: "#8b5cf6",
    gradient: "from-blue-600 to-violet-600",
    gradientHover: "from-blue-500 to-violet-500",
  },
  coral: {
    primary: "#f43f5e",
    primaryDark: "#e11d48",
    accent: "#fb923c",
    gradient: "from-rose-500 to-orange-400",
    gradientHover: "from-rose-400 to-orange-300",
  },
  forest: {
    primary: "#22c55e",
    primaryDark: "#16a34a",
    accent: "#84cc16",
    gradient: "from-green-500 to-lime-500",
    gradientHover: "from-green-400 to-lime-400",
  },
  arctic: {
    primary: "#06b6d4",
    primaryDark: "#0891b2",
    accent: "#3b82f6",
    gradient: "from-cyan-500 to-blue-500",
    gradientHover: "from-cyan-400 to-blue-400",
  },
} as const;

export type PaletteName = keyof typeof PALETTES;

/**
 * Pick a palette based on product name hash for consistent but varied branding.
 */
export function pickPalette(productName: string): PaletteName {
  const names = Object.keys(PALETTES) as PaletteName[];
  let hash = 0;
  for (let i = 0; i < productName.length; i++) {
    hash = ((hash << 5) - hash + productName.charCodeAt(i)) | 0;
  }
  return names[Math.abs(hash) % names.length];
}
