import { formatKstShort } from "@/lib/date";
import { escapeXml, joinArtists, truncateText } from "@/lib/text";
import { getWidgetTitle } from "@/lib/env";
import type { WidgetData } from "@/types/widget";

const FONT = "Arial, sans-serif";

function svgShell(width: number, height: number, children: string): string {
  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" role="img">${children}</svg>`;
}

export function renderRankSvg(data: WidgetData | null, rank: number): string {
  const safeRank = Number.isInteger(rank) && rank >= 1 && rank <= 10 ? rank : 1;
  const track = data?.tracks.find((item) => item.rank === safeRank);
  const rankLabel = String(safeRank).padStart(2, "0");

  if (!track) {
    return svgShell(
      170,
      52,
      `<rect width="170" height="52" fill="#ffffff"/>
<text x="8" y="21" font-size="12" font-family="${FONT}" font-weight="700" fill="#111111">${rankLabel}</text>
<text x="34" y="21" font-size="12" font-family="${FONT}" font-weight="700" fill="#999999">loading...</text>
<text x="34" y="38" font-size="10" font-family="${FONT}" fill="#777777">not updated yet</text>
<line x1="0" y1="51" x2="170" y2="51" stroke="#eeeeee"/>`
    );
  }

  const title = escapeXml(truncateText(track.name, 18));
  const artists = escapeXml(truncateText(joinArtists(track.artists), 20));

  return svgShell(
    170,
    52,
    `<rect width="170" height="52" fill="#ffffff"/>
<text x="8" y="21" font-size="12" font-family="${FONT}" font-weight="700" fill="#111111">${rankLabel}</text>
<text x="34" y="21" font-size="12" font-family="${FONT}" font-weight="700" fill="#111111">${title}</text>
<text x="34" y="38" font-size="10" font-family="${FONT}" fill="#666666">${artists}</text>
<line x1="0" y1="51" x2="170" y2="51" stroke="#eeeeee"/>`
  );
}

export function renderFullWidgetSvg(data: WidgetData | null): string {
  const title = escapeXml(truncateText(getWidgetTitle(), 19));
  const updatedAt = data?.updatedAt ? formatKstShort(new Date(data.updatedAt)) : "not updated";
  const rows = Array.from({ length: 10 }, (_, index) => {
    const rank = index + 1;
    const y = 68 + index * 48;
    const track = data?.tracks.find((item) => item.rank === rank);

    if (!track) {
      return `<text x="10" y="${y}" font-size="11" font-family="${FONT}" font-weight="700" fill="#999999">${String(rank).padStart(2, "0")}</text>
<text x="34" y="${y}" font-size="11" font-family="${FONT}" font-weight="700" fill="#999999">loading...</text>
<line x1="10" y1="${y + 18}" x2="160" y2="${y + 18}" stroke="#eeeeee"/>`;
    }

    return `<text x="10" y="${y}" font-size="11" font-family="${FONT}" font-weight="700" fill="#111111">${String(rank).padStart(2, "0")}</text>
<text x="34" y="${y}" font-size="11" font-family="${FONT}" font-weight="700" fill="#111111">${escapeXml(truncateText(track.name, 17))}</text>
<text x="34" y="${y + 16}" font-size="9" font-family="${FONT}" fill="#666666">${escapeXml(truncateText(joinArtists(track.artists), 21))}</text>
<line x1="10" y1="${y + 24}" x2="160" y2="${y + 24}" stroke="#eeeeee"/>`;
  }).join("\n");

  return svgShell(
    170,
    570,
    `<rect width="170" height="570" rx="0" fill="#ffffff"/>
<text x="10" y="24" font-size="15" font-family="${FONT}" font-weight="700" fill="#111111">${title}</text>
<text x="10" y="42" font-size="10" font-family="${FONT}" fill="#777777">updated: ${escapeXml(updatedAt)}</text>
<line x1="10" y1="54" x2="160" y2="54" stroke="#e7e7e7"/>
${rows}
<text x="10" y="548" font-size="10" font-family="${FONT}" fill="#1db954">open in Spotify</text>`
  );
}
