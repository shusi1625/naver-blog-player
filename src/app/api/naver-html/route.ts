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

function renderImageMapWidget(baseUrl: string, pretty: boolean, withWrapper: boolean): string {
  const image = `<img src="${baseUrl}/api/widget.svg" width="170" height="570" border="0" usemap="#wavy-top-10">`;
  const areas = Array.from({ length: 10 }, (_, index) => {
    const rank = index + 1;
    const top = 54 + index * 48;
    const bottom = top + 48;

    return `<area shape="rect" coords="0,${top},170,${bottom}" href="${baseUrl}/go/${rank}" target="_blank" alt="${rank}">`;
  });

  if (!withWrapper) {
    return pretty
      ? `${image}
<map name="wavy-top-10">
  ${areas.join("\n  ")}
</map>`
      : `${image}<map name="wavy-top-10">${areas.join("")}</map>`;
  }

  if (!pretty) {
    return `<div style="width:170px;height:570px;overflow:hidden">${image}<map name="wavy-top-10">${areas.join("")}</map></div>`;
  }

  return `<div style="width:170px;height:570px;overflow:hidden">
  ${image}
  <map name="wavy-top-10">
    ${areas.join("\n    ")}
  </map>
</div>`;
}

function renderImageOnlyWidget(baseUrl: string): string {
  return `<img src="${baseUrl}/api/widget.svg" width="170" height="570" border="0">`;
}

function renderLinkedImageWidget(baseUrl: string): string {
  return `<a href="${baseUrl}/go/1" target="_blank"><img src="${baseUrl}/api/widget.svg" width="170" height="570" border="0"></a>`;
}

function renderTableImageWidget(baseUrl: string): string {
  return `<table width="170" height="570" border="0" cellpadding="0" cellspacing="0"><tr><td><img src="${baseUrl}/api/widget.svg" width="170" height="570" border="0"></td></tr></table>`;
}

function renderCompactRow(baseUrl: string, rank: number): string {
  return `<a href="${baseUrl}/go/${rank}" target="_blank"><img src="${baseUrl}/api/rank/${rank}.svg" width="154" height="50" border="0" style="display:block"></a>`;
}

function renderSplitWidget(baseUrl: string, index: number): string | null {
  if (index === 1) {
    return `<div style="width:154px;height:150px;overflow:hidden;margin:0 auto;font-family:Arial,sans-serif;background:#fff"><div style="height:50px;background:#f7f5ef;border:1px solid #ece9df;box-sizing:border-box;padding:8px 10px"><b style="font-size:15px;line-height:17px;color:#111">Wavy Top 10</b><br><span style="font-size:9px;color:#777">recent Spotify picks</span></div>${renderCompactRow(baseUrl, 1)}${renderCompactRow(baseUrl, 2)}</div>`;
  }

  if (index === 2) {
    return `<div style="width:154px;height:150px;overflow:hidden;margin:0 auto;background:#fff">${renderCompactRow(baseUrl, 3)}${renderCompactRow(baseUrl, 4)}${renderCompactRow(baseUrl, 5)}</div>`;
  }

  if (index === 3) {
    return `<div style="width:154px;height:150px;overflow:hidden;margin:0 auto;background:#fff">${renderCompactRow(baseUrl, 6)}${renderCompactRow(baseUrl, 7)}${renderCompactRow(baseUrl, 8)}</div>`;
  }

  if (index === 4) {
    return `<div style="width:154px;height:150px;overflow:hidden;margin:0 auto;font-family:Arial,sans-serif;background:#fff">${renderCompactRow(baseUrl, 9)}${renderCompactRow(baseUrl, 10)}<div style="height:50px;background:#f7f5ef;border:1px solid #ece9df;box-sizing:border-box;padding:10px"><a href="${baseUrl}/api/widget.svg" target="_blank" style="font-size:10px;line-height:12px;color:#1db954;text-decoration:none">open full chart</a><br><span style="font-size:9px;color:#777">updated daily</span></div></div>`;
  }

  return null;
}

function plainTextResponse(html: string): Response {
  return new Response(html, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store"
    }
  });
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const format = url.searchParams.get("format") ?? "pretty";
  const mode = url.searchParams.get("mode") ?? "rows";
  const pretty = format !== "min";
  const baseUrl = getWidgetBaseUrl();

  if (mode === "map") {
    return plainTextResponse(renderImageMapWidget(baseUrl, pretty, true));
  }

  if (mode === "map-bare") {
    return plainTextResponse(renderImageMapWidget(baseUrl, pretty, false));
  }

  if (mode === "image") {
    return plainTextResponse(renderImageOnlyWidget(baseUrl));
  }

  if (mode === "linked-image") {
    return plainTextResponse(renderLinkedImageWidget(baseUrl));
  }

  if (mode === "table-image") {
    return plainTextResponse(renderTableImageWidget(baseUrl));
  }

  if (mode.startsWith("split-")) {
    const index = Number(mode.replace("split-", ""));
    const widget = renderSplitWidget(baseUrl, index);

    if (widget) {
      return plainTextResponse(widget);
    }
  }

  const rows = Array.from({ length: 10 }, (_, index) => renderRow(baseUrl, index + 1, pretty));

  const html = pretty
    ? `<div style="width:170px;height:520px;overflow:hidden;font-family:Arial,sans-serif;font-size:12px;line-height:1.4;">
${rows.join("<br>\n")}
</div>`
    : `<div style="width:170px;height:520px;overflow:hidden;font-family:Arial,sans-serif;font-size:12px">${rows.join("<br>")}</div>`;

  return plainTextResponse(html);
}
