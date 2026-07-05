import { getWidgetBaseUrl } from "@/lib/env";

function renderRow(baseUrl: string, rank: number, pretty: boolean): string {
  const href = `${baseUrl}/go/${rank}`;
  const src = `${baseUrl}/api/rank/${rank}.svg`;

  if (!pretty) {
    return `<a href="${href}" target="_blank"><img src="${src}" width="170" height="52" border="0"></a>`;
  }

  return `  <a href="${href}" target="_blank">
    <img src="${src}" width="170" height="52" border="0">
  </a>`;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const format = url.searchParams.get("format") ?? "pretty";
  const pretty = format !== "min";
  const baseUrl = getWidgetBaseUrl();
  const rows = Array.from({ length: 10 }, (_, index) => renderRow(baseUrl, index + 1, pretty));

  const html = pretty
    ? `<div style="width:170px;font-family:Arial,sans-serif;font-size:12px;line-height:1.4;">
${rows.join("<br>\n")}
</div>`
    : `<div style="width:170px;font-family:Arial,sans-serif;font-size:12px">${rows.join("<br>")}</div>`;

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store"
    }
  });
}
