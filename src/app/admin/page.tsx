import { ManualUpdateForm } from "@/app/admin/ManualUpdateForm";

export default function AdminPage() {
  return (
    <main style={{ fontFamily: "Arial, sans-serif", margin: "40px auto", maxWidth: 560, padding: 24 }}>
      <h1 style={{ fontSize: 28, lineHeight: "34px", margin: "0 0 8px" }}>Widget Admin</h1>
      <p style={{ color: "#555", fontSize: 14, lineHeight: "22px", margin: "0 0 24px" }}>
        Update Spotify rankings and open the generated Naver widget snippets.
      </p>

      <section style={{ border: "1px solid #dedede", padding: 18 }}>
        <h2 style={{ fontSize: 16, lineHeight: "22px", margin: "0 0 14px" }}>Manual update</h2>
        <ManualUpdateForm />
      </section>

      <section style={{ display: "grid", gap: 10, marginTop: 24 }}>
        <a href="/api/widget-data" target="_blank">
          View stored data
        </a>
        <a href="/api/naver-html" target="_blank">
          Copy Naver widget HTML
        </a>
        <a href="/api/widget.svg" target="_blank">
          View full SVG
        </a>
      </section>
    </main>
  );
}
