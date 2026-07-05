import { getWidgetProfileImageUrl } from "@/lib/env";
import { getWidgetData } from "@/lib/storage";

const SPOTIFY_PROFILE_URL = "https://open.spotify.com/user/31exfjrt452lr2qgfqz7wt5245h4?si=99913f921efc4054";

function isAllowedSpotifyImageUrl(value: string): boolean {
  return value.startsWith("https://i.scdn.co/") || value.startsWith("https://image-cdn-ak.spotifycdn.com/");
}

async function fetchPublicProfileImageUrl(): Promise<string | null> {
  const response = await fetch(SPOTIFY_PROFILE_URL, { next: { revalidate: 3600 } }).catch(() => null);

  if (!response?.ok) {
    return null;
  }

  const html = await response.text();
  const meta = html.match(/<meta[^>]+property=["']og:image["'][^>]*>/i)?.[0];
  const imageUrl = meta?.match(/content=["']([^"']+)["']/i)?.[1];

  return imageUrl && isAllowedSpotifyImageUrl(imageUrl) ? imageUrl : null;
}

function placeholderResponse(): Response {
  return new Response(
    `<svg width="35" height="35" viewBox="0 0 35 35" xmlns="http://www.w3.org/2000/svg"><rect width="35" height="35" rx="17.5" fill="#2a2a2a"/><circle cx="17.5" cy="14" r="6" fill="#777"/><path d="M7 31c1.8-6.5 6-10 10.5-10s8.7 3.5 10.5 10" fill="#777"/></svg>`,
    {
      headers: {
        "Cache-Control": "public, max-age=300, s-maxage=300",
        "Content-Type": "image/svg+xml"
      }
    }
  );
}

export async function GET() {
  const data = await getWidgetData();
  const imageUrl = data?.profile?.imageUrl ?? getWidgetProfileImageUrl() ?? (await fetchPublicProfileImageUrl());

  if (!imageUrl || !isAllowedSpotifyImageUrl(imageUrl)) {
    return placeholderResponse();
  }

  const response = await fetch(imageUrl, { next: { revalidate: 3600 } }).catch(() => null);

  if (!response?.ok || !response.body) {
    return placeholderResponse();
  }

  return new Response(response.body, {
    headers: {
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
      "Content-Type": response.headers.get("Content-Type") ?? "image/jpeg"
    }
  });
}
