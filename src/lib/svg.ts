import { formatKstShort } from "@/lib/date";
import { escapeXml, joinArtists, truncateText } from "@/lib/text";
import { getWidgetTitle } from "@/lib/env";
import type { WidgetData } from "@/types/widget";

const FONT = "Arial, sans-serif";

function svgShell(width: number, height: number, children: string): string {
  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" role="img">${children}</svg>`;
}

function rankAccent(rank: number): string {
  return rank === 1 ? "#1db954" : "#a7a7a7";
}

export function renderRankSvg(data: WidgetData | null, rank: number): string {
  const safeRank = Number.isInteger(rank) && rank >= 1 && rank <= 10 ? rank : 1;
  const track = data?.tracks.find((item) => item.rank === safeRank);
  const rankLabel = String(safeRank).padStart(2, "0");
  const accent = rankAccent(safeRank);

  if (!track) {
    const background = safeRank === 1 ? "#1e1e1e" : "#121212";

    return svgShell(
      154,
      43,
      `<rect width="154" height="43" fill="none"/>
<rect width="154" height="43" fill="${background}"/>
<rect x="4" y="4" width="35" height="35" fill="#2a2a2a"/>
<text x="21.5" y="25" text-anchor="middle" font-size="9" font-family="${FONT}" font-weight="700" fill="#777777">${rankLabel}</text>
<text x="47" y="17.5" font-size="10.5" font-family="${FONT}" font-weight="700" fill="#9b9b9b">loading...</text>
<text x="47" y="31.5" font-size="8.5" font-family="${FONT}" fill="#777777">not updated yet</text>`
    );
  }

  const title = escapeXml(truncateText(track.name, 18));
  const artists = escapeXml(truncateText(`${rankLabel} · ${joinArtists(track.artists)}`, 19));
  const background = safeRank === 1 ? "#1e1e1e" : "#121212";
  const titleColor = safeRank === 1 ? accent : "#f2f2f2";
  const artistColor = safeRank === 1 ? "#f2f2f2" : "#a7a7a7";
  const clipId = `cover-${safeRank}`;

  return svgShell(
    154,
    43,
    `<rect width="154" height="43" fill="none"/>
<rect width="154" height="43" fill="${background}"/>
<clipPath id="${clipId}"><rect x="4" y="4" width="35" height="35"/></clipPath>
<rect x="4" y="4" width="35" height="35" fill="#2a2a2a"/>
<image href="/api/cover/${safeRank}" x="4" y="4" width="35" height="35" preserveAspectRatio="xMidYMid slice" clip-path="url(#${clipId})"/>
<text x="47" y="17.5" font-size="10.5" font-family="${FONT}" font-weight="700" fill="${titleColor}">${title}</text>
<text x="47" y="31.5" font-size="8.5" font-family="${FONT}" fill="${artistColor}">${artists}</text>`
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
    `<rect width="170" height="570" rx="0" fill="none"/>
<rect x="10" y="10" width="150" height="42" rx="8" fill="#f7f5ef" stroke="#ece9df"/>
<text x="20" y="28" font-size="14" font-family="${FONT}" font-weight="700" fill="#111111">${title}</text>
<text x="20" y="43" font-size="9" font-family="${FONT}" fill="#777777">updated ${escapeXml(updatedAt)}</text>
${rows}
<text x="20" y="548" font-size="10" font-family="${FONT}" fill="#1db954">open in Spotify</text>`
  );
}
