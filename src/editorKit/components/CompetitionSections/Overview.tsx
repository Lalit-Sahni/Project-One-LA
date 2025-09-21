import type { DetailPageContent } from "../../types/competitionDetail";
import { SectionControls } from "../SectionControls";

export function Overview({ content, onChange, isEditing }: { content: DetailPageContent; onChange: (next: DetailPageContent) => void; isEditing: boolean; }) {
  const tokens = content.sections.overview;
  if (tokens?.visible === false) return null;
  return (
    <section style={{ padding: "60px 0", background: "var(--surface)", color: "var(--text-color)" }}>
      <div style={{ maxWidth: 980, margin: "0 auto", padding: "0 24px" }}>
        {isEditing && <SectionControls sectionKey="overview" content={content} onChange={onChange} />}
        <h2 style={{ margin: 0 }}>{tokens?.title ?? "Overview"}</h2>
        <p style={{ color: "var(--muted-text)" }}>This section is driven by content tokens.</p>
      </div>
    </section>
  );
}


