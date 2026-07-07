import { getWidgetProfileImageUrl } from "@/lib/env";
import { svgResponse } from "@/lib/http";
import { getWidgetData } from "@/lib/storage";
import { renderHeaderSvg } from "@/lib/svg";

function isAllowedSpotifyImageUrl(value: string): boolean {
  return value.startsWith("https://i.scdn.co/") || value.startsWith("https://image-cdn-ak.spotifycdn.com/");
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

export async function GET() {
  const data = await getWidgetData();
  const profileDataUri = await fetchImageDataUri(data?.profile?.imageUrl ?? getWidgetProfileImageUrl());

  return svgResponse(renderHeaderSvg(data, profileDataUri));
}
