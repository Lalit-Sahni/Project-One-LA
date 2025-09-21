export type ThemeTokens = {
  colors: {
    primary: string;
    background: string;
    surface: string;
    text: string;
    mutedText: string;
  };
  typography: {
    fontFamily: string;
    baseSize: number;
    lineHeight: number;
  };
  spacing: {
    unit: number;
    radius: number;
    shadow: string;
  };
};

export type SectionTokens = {
  visible?: boolean;
  layout?: string;
  title?: string;
  subtitle?: string;
  body?: string;
  media?: { src?: string; alt?: string; };
};

export type DetailPageContent = {
  theme: ThemeTokens;
  sections: Record<string, SectionTokens>;
  layouts: Record<string, string>;
  sectionOrder: string[];
  startDate?: string;
};

export type StorageAdapter = {
  load: (competitionId: string) => Promise<DetailPageContent | undefined>;
  save: (competitionId: string, content: DetailPageContent) => Promise<void>;
};


