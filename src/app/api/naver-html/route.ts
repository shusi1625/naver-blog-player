import { getWidgetBaseUrl } from "@/lib/env";
import { getWidgetData } from "@/lib/storage";
import type { WidgetData } from "@/types/widget";

const COMPACT_WIDTH = "170";
const COMPACT_HEIGHT = "150";
const COMPACT_ROW_HEIGHT = "43";
const COMPACT_GAP = "10";
const NAVER_BODY_OFFSET = "position:relative;left:-8px;";
const SPOTIFY_PROFILE_URL = "https://open.spotify.com/user/31exfjrt452lr2qgfqz7wt5245h4?si=99913f921efc4054";

type WidgetCode = {
  label: string;
  description: string;
  html: string;
};

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function renderCompactRow(baseUrl: string, rank: number, marginBottom = "0"): string {
  return `<a href="${baseUrl}/go/${rank}" target="_blank" style="display:block;text-decoration:none"><img src="${baseUrl}/api/rank/${rank}.svg" width="${COMPACT_WIDTH}" height="${COMPACT_ROW_HEIGHT}" border="0" style="display:block;width:${COMPACT_WIDTH}px;height:${COMPACT_ROW_HEIGHT}px;margin:0 0 ${marginBottom}px 0"></a>`;
}

function renderDynamicHeader(baseUrl: string): string {
  return `<img src="${baseUrl}/api/header.svg" width="${COMPACT_WIDTH}" height="${COMPACT_ROW_HEIGHT}" border="0" style="display:block;width:${COMPACT_WIDTH}px;height:${COMPACT_ROW_HEIGHT}px;margin:0 0 9px 0">`;
}

function renderSplitWidget(baseUrl: string, index: number, data: WidgetData | null): string {
  if (index === 1) {
    return `<div style="width:${COMPACT_WIDTH}px;height:${COMPACT_HEIGHT}px;overflow:hidden;margin:0 auto;${NAVER_BODY_OFFSET}background:#121212;font-family:Arial,sans-serif">${renderDynamicHeader(baseUrl)}${renderCompactRow(baseUrl, 1, COMPACT_GAP)}${renderCompactRow(baseUrl, 2, "2")}</div>`;
  }

  if (index === 2) {
    return `<div style="width:${COMPACT_WIDTH}px;height:${COMPACT_HEIGHT}px;overflow:hidden;margin:0 auto;${NAVER_BODY_OFFSET}background:#121212">${renderCompactRow(baseUrl, 3, COMPACT_GAP)}${renderCompactRow(baseUrl, 4, COMPACT_GAP)}${renderCompactRow(baseUrl, 5, "1")}</div>`;
  }

  if (index === 3) {
    return `<div style="width:${COMPACT_WIDTH}px;height:${COMPACT_HEIGHT}px;overflow:hidden;margin:0 auto;${NAVER_BODY_OFFSET}padding-top:1px;box-sizing:border-box;background:#121212">${renderCompactRow(baseUrl, 6, COMPACT_GAP)}${renderCompactRow(baseUrl, 7, COMPACT_GAP)}${renderCompactRow(baseUrl, 8)}</div>`;
  }

  const profileUrl = data?.profile?.spotifyUrl ?? SPOTIFY_PROFILE_URL;
  return `<div style="width:${COMPACT_WIDTH}px;height:${COMPACT_HEIGHT}px;overflow:hidden;margin:0 auto;${NAVER_BODY_OFFSET}padding-top:2px;box-sizing:border-box;background:#121212;font-family:Arial,sans-serif">${renderCompactRow(baseUrl, 9, COMPACT_GAP)}${renderCompactRow(baseUrl, 10, "9")}<div style="height:${COMPACT_ROW_HEIGHT}px;background:#121212;box-sizing:border-box;padding:7px 9px"><a href="${profileUrl}" target="_blank" style="display:block;font-size:10px;line-height:13px;color:#1db954;text-decoration:none;font-weight:bold">Link to profile</a><span style="display:block;margin-top:3px;font-size:8.5px;line-height:10px;color:#9b9b9b">open in Spotify</span></div></div>`;
}

function buildWidgetCodes(baseUrl: string, data: WidgetData | null): WidgetCode[] {
  return [
    {
      label: "Widget 1",
      description: "Header, rank 1-2",
      html: renderSplitWidget(baseUrl, 1, data)
    },
    {
      label: "Widget 2",
      description: "Rank 3-5",
      html: renderSplitWidget(baseUrl, 2, data)
    },
    {
      label: "Widget 3",
      description: "Rank 6-8",
      html: renderSplitWidget(baseUrl, 3, data)
    },
    {
      label: "Widget 4",
      description: "Rank 9-10, profile link",
      html: renderSplitWidget(baseUrl, 4, data)
    }
  ];
}

function htmlResponse(codes: WidgetCode[], updatedAtKst?: string | null): Response {
  const cards = codes
    .map(
      (code, index) => `<section class="card">
        <div class="card-head">
          <div>
            <h2>${escapeHtml(code.label)}</h2>
            <p>${escapeHtml(code.description)}</p>
          </div>
          <button type="button" data-copy-target="code-${index + 1}">Copy</button>
        </div>
        <textarea id="code-${index + 1}" readonly spellcheck="false">${escapeHtml(code.html)}</textarea>
      </section>`
    )
    .join("");

  return new Response(
    `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Naver Widget HTML</title>
  <style>
    body{margin:0;background:#f5f5f2;color:#111;font-family:Arial,sans-serif}
    main{max-width:920px;margin:0 auto;padding:36px 20px}
    h1{font-size:28px;line-height:34px;margin:0 0 8px}
    .lead{color:#555;font-size:14px;line-height:22px;margin:0 0 24px}
    .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:14px}
    .card{background:#fff;border:1px solid #dcdcd8;padding:14px}
    .card-head{align-items:flex-start;display:flex;gap:12px;justify-content:space-between;margin-bottom:10px}
    h2{font-size:15px;line-height:20px;margin:0}
    p{color:#666;font-size:12px;line-height:18px;margin:2px 0 0}
    button{background:#1db954;border:0;color:#07130b;cursor:pointer;font-size:13px;font-weight:700;height:34px;padding:0 14px}
    button.copied{background:#111;color:#fff}
    textarea{box-sizing:border-box;border:1px solid #d8d8d8;font-family:Consolas,monospace;font-size:12px;height:170px;line-height:17px;padding:10px;resize:vertical;width:100%}
    .hint{color:#666;font-size:12px;line-height:18px;margin-top:18px}
  </style>
</head>
<body>
  <main>
    <h1>Naver Widget HTML</h1>
    <p class="lead">Copy these four snippets into Naver Blog widgets in order. Last data update: ${escapeHtml(updatedAtKst ?? "not updated")}</p>
    <div class="grid">${cards}</div>
    <p class="hint">Use Widget 1, 2, 3, 4 from top to bottom in the Naver layout.</p>
  </main>
  <script>
    document.querySelectorAll("button[data-copy-target]").forEach((button) => {
      button.addEventListener("click", async () => {
        const target = document.getElementById(button.dataset.copyTarget);
        await navigator.clipboard.writeText(target.value);
        button.textContent = "Copied";
        button.classList.add("copied");
        setTimeout(() => {
          button.textContent = "Copy";
          button.classList.remove("copied");
        }, 1200);
      });
    });
  </script>
</body>
</html>`,
    {
      headers: {
        "Cache-Control": "no-store",
        "Content-Type": "text/html; charset=utf-8"
      }
    }
  );
}

export async function GET() {
  const baseUrl = getWidgetBaseUrl();
  const data = await getWidgetData();
  const codes = buildWidgetCodes(baseUrl, data);

  return htmlResponse(codes, data?.updatedAtKst ?? null);
}
