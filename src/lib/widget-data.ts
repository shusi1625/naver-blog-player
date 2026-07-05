import { formatKst, getKstNow } from "@/lib/date";
import { fetchTopTracks, refreshSpotifyAccessToken } from "@/lib/spotify";
import { getWidgetTimeRange } from "@/lib/env";
import type { WidgetData } from "@/types/widget";

export async function buildLatestWidgetData(): Promise<WidgetData> {
  const accessToken = await refreshSpotifyAccessToken();
  const timeRange = getWidgetTimeRange();
  const tracks = await fetchTopTracks({
    accessToken,
    timeRange,
    limit: 10
  });

  if (tracks.length === 0) {
    throw new Error("Spotify returned zero top tracks.");
  }

  const now = getKstNow();

  return {
    updatedAt: now.toISOString(),
    updatedAtKst: formatKst(now),
    source: "spotify-top-tracks",
    timeRange,
    tracks
  };
}
