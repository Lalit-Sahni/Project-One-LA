import type { DetailPageContent, StorageAdapter } from "../types/competitionDetail";
import { defaultContent } from "../tokens/contentTokens";

export const localStorageAdapter = (keyPrefix = "editor:comp:"): StorageAdapter => ({
  async load(competitionId) {
    const raw = localStorage.getItem(keyPrefix + competitionId);
    return raw ? (JSON.parse(raw) as DetailPageContent) : undefined;
  },
  async save(competitionId, content) {
    localStorage.setItem(keyPrefix + competitionId, JSON.stringify(content));
  },
});

export function getDefaultContent(): DetailPageContent {
  return JSON.parse(JSON.stringify(defaultContent));
}

export function applyThemeToDocument(theme: DetailPageContent["theme"], root: HTMLElement = document.documentElement) {
  root.style.setProperty("--color-primary", theme.colors.primary);
  root.style.setProperty("--surface", theme.colors.background);
  root.style.setProperty("--surface-muted", theme.colors.surface);
  root.style.setProperty("--text-color", theme.colors.text);
  root.style.setProperty("--muted-text", theme.colors.mutedText);
}

export const debounce = (fn: (...args: any[]) => void, ms = 500) => {
  let t: number | undefined;
  return (...args: any[]) => {
    if (t) window.clearTimeout(t);
    t = window.setTimeout(() => fn(...args), ms);
  };
};


