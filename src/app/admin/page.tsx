import { ManualUpdateForm } from "@/app/admin/ManualUpdateForm";

export default function AdminPage() {
  return (
    <main style={{ fontFamily: "Arial, sans-serif", margin: "40px auto", maxWidth: 560, padding: 24 }}>
      <h1 style={{ fontSize: 28, lineHeight: "34px", margin: "0 0 8px" }}>Widget Admin</h1>
      <p style={{ color: "#555", fontSize: 14, lineHeight: "22px", margin: "0 0 24px" }}>
        Spotify 순위를 즉시 갱신하고 저장된 위젯 데이터를 확인합니다.
      </p>

      <section style={{ border: "1px solid #dedede", padding: 18 }}>
        <h2 style={{ fontSize: 16, lineHeight: "22px", margin: "0 0 14px" }}>수동 갱신</h2>
        <ManualUpdateForm />
      </section>

      <section style={{ display: "grid", gap: 10, marginTop: 24 }}>
        <a href="/api/widget-data" target="_blank">
          저장된 데이터 보기
        </a>
        <a href="/api/naver-html?format=min" target="_blank">
          네이버 위젯 HTML 보기
        </a>
        <a href="/api/widget.svg" target="_blank">
          전체 SVG 보기
        </a>
      </section>
    </main>
  );
}
