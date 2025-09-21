import React from "react";
import { createRoot } from "react-dom/client";
import { useCompetitionDetail } from "../editorKit/hooks/useCompetitionDetail";
import { EditorSidePanel } from "../editorKit/components/EditorSidePanel";
import { HeroTemplates } from "../editorKit/components/HeroTemplates";
import { Overview } from "../editorKit/components/CompetitionSections/Overview";

function App() {
  const { content, updateContent, isEditing, loaded } = useCompetitionDetail({ competitionId: "demo-competition" });
  if (!loaded) return null;

  return (
    <div>
      <HeroTemplates content={content} />
      <Overview content={content} onChange={(next) => updateContent(() => next)} isEditing={isEditing} />
      {isEditing && (
        <EditorSidePanel content={content} onChange={(next) => updateContent(() => next)} />
      )}
    </div>
  );
}

const container = document.getElementById("root")!;
createRoot(container).render(<App />);


