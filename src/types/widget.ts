export type TimeRange = "short_term" | "medium_term" | "long_term";

export type TopTrack = {
  rank: number;
  id: string;
  name: string;
  artists: string[];
  albumName: string;
  spotifyUrl: string;
  previewUrl?: string | null;
  imageUrl?: string | null;
  durationMs?: number;
};

export type WidgetData = {
  updatedAt: string;
  updatedAtKst: string;
  source: "spotify-top-tracks";
  timeRange: TimeRange;
  tracks: TopTrack[];
};
