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

export function renderRankSvg(data: WidgetData | null, rank: number, coverDataUri?: string | null): string {
  const safeRank = Number.isInteger(rank) && rank >= 1 && rank <= 10 ? rank : 1;
  const track = data?.tracks.find((item) => item.rank === safeRank);
  const rankLabel = String(safeRank).padStart(2, "0");
  const accent = rankAccent(safeRank);

  if (!track) {
    const background = safeRank === 1 ? "#1e1e1e" : "#121212";

    return svgShell(
      170,
      43,
      `<rect width="170" height="43" fill="none"/>
<rect width="170" height="43" fill="${background}"/>
<rect x="4" y="4" width="35" height="35" fill="#2a2a2a"/>
<text x="21.5" y="25" text-anchor="middle" font-size="9" font-family="${FONT}" font-weight="700" fill="#777777">${rankLabel}</text>
<text x="47" y="17.5" font-size="10.5" font-family="${FONT}" font-weight="700" fill="#9b9b9b">loading...</text>
<text x="47" y="31.5" font-size="8.5" font-family="${FONT}" fill="#777777">not updated yet</text>`
    );
  }

  const title = escapeXml(truncateText(track.name, 21));
  const artists = escapeXml(truncateText(`${rankLabel} - ${joinArtists(track.artists)}`, 22));
  const background = safeRank === 1 ? "#1e1e1e" : "#121212";
  const titleColor = safeRank === 1 ? accent : "#f2f2f2";
  const artistColor = safeRank === 1 ? "#f2f2f2" : "#a7a7a7";
  const clipId = `cover-${safeRank}`;

  return svgShell(
    170,
    43,
    `<rect width="170" height="43" fill="none"/>
<rect width="170" height="43" fill="${background}"/>
<clipPath id="${clipId}"><rect x="4" y="4" width="35" height="35"/></clipPath>
<rect x="4" y="4" width="35" height="35" fill="#2a2a2a"/>
${coverDataUri ? `<image href="${escapeXml(coverDataUri)}" x="4" y="4" width="35" height="35" preserveAspectRatio="xMidYMid slice" clip-path="url(#${clipId})"/>` : ""}
<text x="47" y="17.5" font-size="10.5" font-family="${FONT}" font-weight="700" fill="${titleColor}">${title}</text>
<text x="47" y="31.5" font-size="8.5" font-family="${FONT}" fill="${artistColor}">${artists}</text>`
  );
}

export function renderFullWidgetSvg(data: WidgetData | null): string {
  const title = escapeXml(truncateText(getWidgetTitle(), 18));
  const updatedAt = data?.updatedAt ? formatKstShort(new Date(data.updatedAt)) : "not updated";
  const rowHeight = 43;
  const dividerHeight = 8;
  const height = 624;

  function renderCompactTrack(rank: number, y: number): string {
    const track = data?.tracks.find((item) => item.rank === rank);
    const rankLabel = String(rank).padStart(2, "0");
    const background = rank === 1 ? "#1e1e1e" : "#121212";
    const titleColor = rank === 1 ? "#1db954" : "#f2f2f2";
    const artistColor = rank === 1 ? "#f2f2f2" : "#a7a7a7";

    if (!track) {
      return `<rect x="0" y="${y}" width="170" height="${rowHeight}" fill="${background}"/>
<rect x="4" y="${y + 4}" width="35" height="35" fill="#2a2a2a"/>
<text x="21.5" y="${y + 25}" text-anchor="middle" font-size="9" font-family="${FONT}" font-weight="700" fill="#777777">${rankLabel}</text>
<text x="47" y="${y + 17.5}" font-size="10.5" font-family="${FONT}" font-weight="700" fill="#9b9b9b">loading...</text>
<text x="47" y="${y + 31.5}" font-size="8.5" font-family="${FONT}" fill="#777777">not updated yet</text>`;
    }

    return `<rect x="0" y="${y}" width="170" height="${rowHeight}" fill="${background}"/>
<rect x="4" y="${y + 4}" width="35" height="35" fill="#2a2a2a"/>
<text x="21.5" y="${y + 25}" text-anchor="middle" font-size="9" font-family="${FONT}" font-weight="700" fill="#777777">${rankLabel}</text>
<text x="47" y="${y + 17.5}" font-size="10.5" font-family="${FONT}" font-weight="700" fill="${titleColor}">${escapeXml(truncateText(track.name, 21))}</text>
<text x="47" y="${y + 31.5}" font-size="8.5" font-family="${FONT}" fill="${artistColor}">${escapeXml(truncateText(`${rankLabel} - ${joinArtists(track.artists)}`, 22))}</text>`;
  }

  return svgShell(
    170,
    height,
    `<rect width="170" height="${height}" fill="#121212"/>
<rect x="0" y="0" width="170" height="${rowHeight}" fill="#121212"/>
<circle cx="19.5" cy="21.5" r="15.5" fill="#2a2a2a"/>
<text x="19.5" y="25" text-anchor="middle" font-size="9" font-family="${FONT}" font-weight="700" fill="#1db954">SP</text>
<text x="47" y="17" font-size="13" font-family="${FONT}" font-weight="700" fill="#f5f5f5">${title}</text>
<text x="47" y="31" font-size="8.5" font-family="${FONT}" fill="#9b9b9b">${escapeXml(updatedAt)} updated</text>
${renderCompactTrack(1, 52)}
${renderCompactTrack(2, 105)}
<rect x="0" y="150" width="170" height="${dividerHeight}" fill="#ffffff"/>
${renderCompactTrack(3, 158)}
${renderCompactTrack(4, 211)}
${renderCompactTrack(5, 264)}
<rect x="0" y="308" width="170" height="${dividerHeight}" fill="#ffffff"/>
${renderCompactTrack(6, 317)}
${renderCompactTrack(7, 370)}
${renderCompactTrack(8, 423)}
<rect x="0" y="466" width="170" height="${dividerHeight}" fill="#ffffff"/>
${renderCompactTrack(9, 476)}
${renderCompactTrack(10, 529)}
<rect x="0" y="582" width="170" height="${rowHeight}" fill="#121212"/>
<text x="9" y="599" font-size="10" font-family="${FONT}" font-weight="700" fill="#1db954">Link to profile</text>
<text x="9" y="613" font-size="8.5" font-family="${FONT}" fill="#9b9b9b">open in Spotify</text>`
  );
}
