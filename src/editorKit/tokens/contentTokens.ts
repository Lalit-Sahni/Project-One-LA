import type { DetailPageContent } from "../types/competitionDetail";
import { defaultTheme } from "./themeTokens";

export const defaultContent: DetailPageContent = {
  theme: defaultTheme,
  layouts: {
    hero: "hero-simple",
  },
  sections: {
    overview: { visible: true, layout: "copy-media", title: "Challenge Overview" },
    timeline: { visible: true, layout: "timeline", title: "Competition Timeline" },
    prizes: { visible: true, layout: "copy-list", title: "Prizes" },
    faq: { visible: true, layout: "accordion", title: "FAQ" },
  },
  sectionOrder: ["overview", "timeline", "prizes", "faq"],
};


