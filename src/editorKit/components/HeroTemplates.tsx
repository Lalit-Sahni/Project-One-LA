import type { DetailPageContent } from "../types/competitionDetail";

type Props = { content: DetailPageContent };

export function HeroTemplates({ content }: Props) {
  const key = content.layouts.hero;
  switch (key) {
    case "hero-centered":
      return (
        <section style={{ padding: "100px 0", textAlign: "center" }}>
          <h1 style={{ margin: 0, fontSize: 48 }}>Competition Landing</h1>
          <p style={{ marginTop: 12, color: "var(--muted-text)" }}>Powered by EditorKit tokens</p>
        </section>
      );
    default:
      return (
        <section style={{ padding: "80px 0" }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <h1 style={{ margin: 0, fontSize: 44 }}>Competition Landing</h1>
            <p style={{ marginTop: 12, color: "var(--muted-text)" }}>Edit via ?edit=true</p>
          </div>
        </section>
      );
  }
}


