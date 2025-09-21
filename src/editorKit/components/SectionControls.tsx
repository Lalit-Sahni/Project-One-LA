import type { DetailPageContent } from "../types/competitionDetail";

type Props = {
  sectionKey: string;
  content: DetailPageContent;
  onChange: (next: DetailPageContent) => void;
};

export function SectionControls({ sectionKey, content, onChange }: Props) {
  const section = content.sections[sectionKey];
  if (!section) return null;
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
      <select value={section.layout ?? "copy-media"} onChange={e => onChange({ ...content, sections: { ...content.sections, [sectionKey]: { ...section, layout: e.target.value } } })}>
        <option value="copy-media">Copy + Media</option>
        <option value="timeline">Timeline</option>
        <option value="copy-list">Copy + List</option>
        <option value="accordion">FAQ</option>
      </select>
      <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
        <input type="checkbox" checked={section.visible !== false} onChange={e => onChange({ ...content, sections: { ...content.sections, [sectionKey]: { ...section, visible: e.target.checked } } })} />
        <span>Visible</span>
      </label>
    </div>
  );
}


