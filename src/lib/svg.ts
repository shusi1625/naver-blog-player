import { formatKstShort } from "@/lib/date";
import { escapeXml, joinArtists, truncateText } from "@/lib/text";
import { getWidgetTitle } from "@/lib/env";
import type { WidgetData } from "@/types/widget";

const FONT = "Arial, sans-serif";

function svgShell(width: number, height: number, children: string): string {
  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" role="img">${children}</svg>`;
}

function rankAccent(rank: number): string {
  if (rank <= 3) {
    return "#1db954";
  }

  if (rank <= 6) {
    return "#3a6ea5";
  }

  return "#d05f45";
}

export function renderRankSvg(data: WidgetData | null, rank: number): string {
  const safeRank = Number.isInteger(rank) && rank >= 1 && rank <= 10 ? rank : 1;
  const track = data?.tracks.find((item) => item.rank === safeRank);
  const rankLabel = String(safeRank).padStart(2, "0");
  const accent = rankAccent(safeRank);

  if (!track) {
    return svgShell(
      170,
      52,
      `<rect width="170" height="52" fill="#ffffff"/>
<rect x="2" y="4" width="166" height="44" rx="7" fill="#fbfbf8" stroke="#ece9df"/>
<rect x="8" y="13" width="23" height="23" rx="11.5" fill="${accent}"/>
<text x="19.5" y="28.5" text-anchor="middle" font-size="10" font-family="${FONT}" font-weight="700" fill="#ffffff">${rankLabel}</text>
<text x="39" y="22" font-size="11.5" font-family="${FONT}" font-weight="700" fill="#9b978e">loading...</text>
<text x="39" y="38" font-size="9.5" font-family="${FONT}" fill="#777777">not updated yet</text>`
    );
  }

  const title = escapeXml(truncateText(track.name, 16));
  const artists = escapeXml(truncateText(joinArtists(track.artists), 18));

  return svgShell(
    170,
    52,
    `<rect width="170" height="52" fill="#ffffff"/>
<rect x="2" y="4" width="166" height="44" rx="7" fill="#fbfbf8" stroke="#ece9df"/>
<rect x="8" y="13" width="23" height="23" rx="11.5" fill="${accent}"/>
<text x="19.5" y="28.5" text-anchor="middle" font-size="10" font-family="${FONT}" font-weight="700" fill="#ffffff">${rankLabel}</text>
<text x="39" y="22" font-size="11.5" font-family="${FONT}" font-weight="700" fill="#1a1a18">${title}</text>
<text x="39" y="38" font-size="9.5" font-family="${FONT}" fill="#68645d">${artists}</text>`
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
      return `<rect x="10" y="${y - 16}" width="150" height="34" rx="6" fill="#fbfbf8" stroke="#ece9df"/>
<text x="18" y="${y + 5}" font-size="10" font-family="${FONT}" font-weight="700" fill="#999999">${String(rank).padStart(2, "0")}</text>
<text x="42" y="${y + 5}" font-size="10.5" font-family="${FONT}" font-weight="700" fill="#999999">loading...</text>`;
    }

    return `<rect x="10" y="${y - 16}" width="150" height="38" rx="6" fill="#fbfbf8" stroke="#ece9df"/>
<rect x="16" y="${y - 7}" width="20" height="20" rx="10" fill="${rankAccent(rank)}"/>
<text x="26" y="${y + 6}" text-anchor="middle" font-size="8.8" font-family="${FONT}" font-weight="700" fill="#ffffff">${String(rank).padStart(2, "0")}</text>
<text x="43" y="${y}" font-size="10.5" font-family="${FONT}" font-weight="700" fill="#1a1a18">${escapeXml(truncateText(track.name, 16))}</text>
<text x="43" y="${y + 14}" font-size="8.8" font-family="${FONT}" fill="#68645d">${escapeXml(truncateText(joinArtists(track.artists), 19))}</text>`;
  }).join("\n");

  return svgShell(
    170,
    570,
    `<rect width="170" height="570" rx="0" fill="#ffffff"/>
<rect x="10" y="10" width="150" height="42" rx="8" fill="#f7f5ef" stroke="#ece9df"/>
<text x="20" y="28" font-size="14" font-family="${FONT}" font-weight="700" fill="#111111">${title}</text>
<text x="20" y="43" font-size="9" font-family="${FONT}" fill="#777777">updated ${escapeXml(updatedAt)}</text>
${rows}
<text x="20" y="548" font-size="10" font-family="${FONT}" fill="#1db954">open in Spotify</text>`
  );
}
