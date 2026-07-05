import { svgResponse } from "@/lib/http";
import { getWidgetData } from "@/lib/storage";
import { renderRankSvg } from "@/lib/svg";

function isAllowedSpotifyImageUrl(value: string): boolean {
  return value.startsWith("https://i.scdn.co/") || value.startsWith("https://image-cdn-ak.spotifycdn.com/");
}

function parseRankParam(value: string): number {
  const normalized = value.replace(/\.svg$/i, "");
  return Number(normalized);
}

async function fetchImageDataUri(imageUrl?: string | null): Promise<string | null> {
  if (!imageUrl || !isAllowedSpotifyImageUrl(imageUrl)) {
    return null;
  }

  const response = await fetch(imageUrl, { next: { revalidate: 3600 } }).catch(() => null);

  if (!response?.ok) {
    return null;
  }

  const contentType = response.headers.get("Content-Type") ?? "image/jpeg";

  if (!contentType.startsWith("image/")) {
    return null;
  }

  const bytes = Buffer.from(await response.arrayBuffer()).toString("base64");
  return `data:${contentType};base64,${bytes}`;
}

export async function GET(_request: Request, context: { params: Promise<{ rank: string }> }) {
  const { rank } = await context.params;
  const parsedRank = parseRankParam(rank);
  const data = await getWidgetData();
  const track = data?.tracks.find((item) => item.rank === parsedRank);
  const coverDataUri = await fetchImageDataUri(track?.imageUrl);

  return svgResponse(renderRankSvg(data, parsedRank, coverDataUri));
}
