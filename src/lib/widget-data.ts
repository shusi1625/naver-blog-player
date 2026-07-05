import { formatKst, getKstNow } from "@/lib/date";
import { fetchCurrentUserProfile, fetchTopTracks, refreshSpotifyAccessToken } from "@/lib/spotify";
import { getWidgetProfileImageUrl, getWidgetProfileUrl, getWidgetTimeRange } from "@/lib/env";
import type { WidgetData } from "@/types/widget";

export async function buildLatestWidgetData(): Promise<WidgetData> {
  const accessToken = await refreshSpotifyAccessToken();
  const timeRange = getWidgetTimeRange();
  const [tracks, profile] = await Promise.all([
    fetchTopTracks({
      accessToken,
      timeRange,
      limit: 10
    }),
    fetchCurrentUserProfile(accessToken)
  ]);

  if (tracks.length === 0) {
    throw new Error("Spotify returned zero top tracks.");
  }

  const now = getKstNow();

  return {
    updatedAt: now.toISOString(),
    updatedAtKst: formatKst(now),
    source: "spotify-top-tracks",
    timeRange,
    profile: {
      displayName: profile?.displayName ?? null,
      spotifyUrl: profile?.spotifyUrl ?? getWidgetProfileUrl() ?? null,
      imageUrl: profile?.imageUrl ?? getWidgetProfileImageUrl() ?? null
    },
    tracks
  };
}
