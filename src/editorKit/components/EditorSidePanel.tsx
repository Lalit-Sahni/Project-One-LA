import { useMemo } from "react";
import type { DetailPageContent } from "../types/competitionDetail";

type Props = {
  content: DetailPageContent;
  onChange: (next: DetailPageContent) => void;
};

export function EditorSidePanel({ content, onChange }: Props) {
  const tabs = useMemo(() => (["Layout", "Design", "Sections"] as const), []);

  return (
    <div style={{ position: "fixed", right: 16, top: 16, width: 320, padding: 16, background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, boxShadow: "0 12px 30px rgba(0,0,0,0.08)", zIndex: 1000 }}>
      <strong>Editor</strong>
      <div style={{ display: "flex", gap: 8, margin: "12px 0" }}>
        {tabs.map(t => (
          <span key={t} style={{ fontSize: 12, color: "#64748b" }}>{t}</span>
        ))}
      </div>

      <div style={{ display: "grid", gap: 12 }}>
        <label style={{ display: "grid", gap: 6 }}>
          <span style={{ fontSize: 12, color: "#64748b" }}>Primary Color</span>
          <input type="color" value={content.theme.colors.primary} onChange={e => onChange({ ...content, theme: { ...content.theme, colors: { ...content.theme.colors, primary: e.target.value } } })} />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <span style={{ fontSize: 12, color: "#64748b" }}>Hero Template</span>
          <select value={content.layouts.hero} onChange={e => onChange({ ...content, layouts: { ...content.layouts, hero: e.target.value } })}>
            <option value="hero-simple">Simple</option>
            <option value="hero-centered">Centered</option>
          </select>
        </label>
      </div>
    </div>
  );
}


