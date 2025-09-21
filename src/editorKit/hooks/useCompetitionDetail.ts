import { useCallback, useEffect, useMemo, useState } from "react";
import type { DetailPageContent, StorageAdapter } from "../types/competitionDetail";
import { getDefaultContent, localStorageAdapter, applyThemeToDocument, debounce } from "../utils/competitionDetail";

type Params = {
  competitionId: string;
  storage?: StorageAdapter;
};

export function useCompetitionDetail({ competitionId, storage }: Params) {
  const adapter = useMemo(() => storage ?? localStorageAdapter(), [storage]);
  const [content, setContent] = useState<DetailPageContent>(() => getDefaultContent());
  const [loaded, setLoaded] = useState(false);

  const isEditing = useMemo(() => new URLSearchParams(window.location.search).get("edit") === "true", []);

  useEffect(() => {
    (async () => {
      const saved = await adapter.load(competitionId);
      setContent(saved ?? getDefaultContent());
      setLoaded(true);
    })();
  }, [adapter, competitionId]);

  // persist with debounce
  const persist = useMemo(
    () => debounce((next: DetailPageContent) => void adapter.save(competitionId, next), 600),
    [adapter, competitionId]
  );

  const updateContent = useCallback((updater: (prev: DetailPageContent) => DetailPageContent) => {
    setContent(prev => {
      const next = updater(prev);
      persist(next);
      return next;
    });
  }, [persist]);

  // apply theme to CSS vars when content changes
  useEffect(() => { applyThemeToDocument(content.theme); }, [content.theme]);

  return { content, updateContent, isEditing, loaded } as const;
}


