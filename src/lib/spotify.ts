import type { SpotifyProfile, TimeRange, TopTrack } from "@/types/widget";
import { readRequiredEnv } from "@/lib/env";

type SpotifyTokenResponse = {
  access_token?: string;
  refresh_token?: string;
  token_type?: string;
  expires_in?: number;
  error?: string;
  error_description?: string;
};

type SpotifyTrackItem = {
  id: string;
  name: string;
  artists: Array<{ name: string }>;
  album: {
    name: string;
    images?: Array<{ url: string; height: number | null; width: number | null }>;
  };
  external_urls: {
    spotify?: string;
  };
  preview_url?: string | null;
  duration_ms?: number;
};

type SpotifyTopTracksResponse = {
  items?: SpotifyTrackItem[];
  error?: {
    status: number;
    message: string;
  };
};

type SpotifyCurrentUserResponse = {
  display_name?: string | null;
  external_urls?: {
    spotify?: string;
  };
  images?: Array<{ url: string; height: number | null; width: number | null }>;
  error?: {
    status: number;
    message: string;
  };
};

function getSpotifyBasicAuth(): string {
  const clientId = readRequiredEnv("SPOTIFY_CLIENT_ID");
  const clientSecret = readRequiredEnv("SPOTIFY_CLIENT_SECRET");
  return Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
}

export async function refreshSpotifyAccessToken(): Promise<string> {
  const refreshToken = readRequiredEnv("SPOTIFY_REFRESH_TOKEN");

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${getSpotifyBasicAuth()}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken
    })
  });

  const payload = (await response.json()) as SpotifyTokenResponse;

  if (!response.ok || !payload.access_token) {
    throw new Error(payload.error_description ?? payload.error ?? "Failed to refresh Spotify access token.");
  }

  return payload.access_token;
}

export async function exchangeSpotifyCode(code: string): Promise<SpotifyTokenResponse> {
  const redirectUri = readRequiredEnv("SPOTIFY_REDIRECT_URI");

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${getSpotifyBasicAuth()}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri
    })
  });

  const payload = (await response.json()) as SpotifyTokenResponse;

  if (!response.ok) {
    throw new Error(payload.error_description ?? payload.error ?? "Failed to exchange Spotify authorization code.");
  }

  return payload;
}

export async function fetchTopTracks(options: {
  accessToken: string;
  timeRange: TimeRange;
  limit: number;
}): Promise<TopTrack[]> {
  const params = new URLSearchParams({
    time_range: options.timeRange,
    limit: String(options.limit),
    offset: "0"
  });

  const response = await fetch(`https://api.spotify.com/v1/me/top/tracks?${params}`, {
    headers: {
      Authorization: `Bearer ${options.accessToken}`
    }
  });

  const payload = (await response.json()) as SpotifyTopTracksResponse;

  if (!response.ok || payload.error) {
    const status = payload.error?.status ?? response.status;
    const message = payload.error?.message ?? "Failed to fetch Spotify top tracks.";
    throw new Error(`Spotify API failed (${status}): ${message}`);
  }

  return (payload.items ?? []).slice(0, options.limit).map((track, index) => ({
    rank: index + 1,
    id: track.id,
    name: track.name,
    artists: track.artists.map((artist) => artist.name),
    albumName: track.album.name,
    spotifyUrl: track.external_urls.spotify ?? `https://open.spotify.com/track/${track.id}`,
    previewUrl: track.preview_url ?? null,
    imageUrl: track.album.images?.at(-1)?.url ?? track.album.images?.[0]?.url ?? null,
    durationMs: track.duration_ms
  }));
}

export async function fetchCurrentUserProfile(accessToken: string): Promise<SpotifyProfile | null> {
  const response = await fetch("https://api.spotify.com/v1/me", {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  const payload = (await response.json()) as SpotifyCurrentUserResponse;

  if (!response.ok || payload.error) {
    return null;
  }

  return {
    displayName: payload.display_name ?? null,
    spotifyUrl: payload.external_urls?.spotify ?? null,
    imageUrl: payload.images?.at(-1)?.url ?? payload.images?.[0]?.url ?? null
  };
}
