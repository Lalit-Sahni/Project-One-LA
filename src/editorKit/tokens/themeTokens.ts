import type { ThemeTokens } from "../types/competitionDetail";

export const landingPageThemes: Record<string, ThemeTokens> = {
  warm_brown: {
    colors: {
      primary: "#B45309",
      background: "#FFFFFF",
      surface: "#F8FAFC",
      text: "#0F172A",
      mutedText: "#475569",
    },
    typography: { fontFamily: "Inter, system-ui, sans-serif", baseSize: 16, lineHeight: 1.6 },
    spacing: { unit: 8, radius: 12, shadow: "0 10px 30px rgba(0,0,0,0.08)" },
  },
};

export const defaultTheme: ThemeTokens = landingPageThemes.warm_brown;


