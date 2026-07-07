export default function Home() {
  return (
    <main style={{ maxWidth: 720, margin: "40px auto", padding: 24, fontFamily: "Arial, sans-serif" }}>
      <h1>Naver Blog Player</h1>
      <p>Spotify Top 10 data is rendered as static SVG rows for Naver Blog widgets.</p>
      <ul>
        <li>
          <a href="/api/auth/login">Connect Spotify</a>
        </li>
        <li>
          <a href="/api/widget-data">View widget data</a>
        </li>
        <li>
          <a href="/admin">Open admin</a>
        </li>
        <li>
          <a href="/api/widget.svg">View full SVG</a>
        </li>
        <li>
          <a href="/demo">View design demo</a>
        </li>
        <li>
          <a href="/api/naver-html?format=min">Get Naver widget HTML</a>
        </li>
      </ul>
    </main>
  );
}
