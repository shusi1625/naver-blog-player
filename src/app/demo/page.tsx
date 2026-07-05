import { getWidgetData } from "@/lib/storage";
import { joinArtists, truncateText } from "@/lib/text";
import type { ReactNode } from "react";
import type { TopTrack } from "@/types/widget";

export const dynamic = "force-dynamic";

const WIDGET_WIDTH = 154;
const WIDGET_HEIGHT = 150;
const ROW_HEIGHT = 43;
const ROW_GAP = 10;
const DIVIDER_HEIGHT = 8;
const SPOTIFY_GREEN = "#1db954";

const sampleTracks: TopTrack[] = [
  {
    rank: 1,
    id: "sample-1",
    name: "True heart",
    artists: ["초록불꽃소년단"],
    albumName: "GREENROOF",
    spotifyUrl: "https://open.spotify.com/",
    imageUrl: "https://i.scdn.co/image/ab67616d0000b2736a07379be5c10e3c8189864a"
  },
  {
    rank: 2,
    id: "sample-2",
    name: "Homecoming",
    artists: ["Gogohawk"],
    albumName: "VOL.10",
    spotifyUrl: "https://open.spotify.com/",
    imageUrl: "https://i.scdn.co/image/ab67616d0000b273d2a74bfeace1fd2c4429dd7a"
  },
  {
    rank: 3,
    id: "sample-3",
    name: "NamgungFEFERE",
    artists: ["Silica Gel", "Japanese Breakfast"],
    albumName: "NamgungFEFERE",
    spotifyUrl: "https://open.spotify.com/",
    imageUrl: "https://i.scdn.co/image/ab67616d0000b27311fdbd18e9740096fa53a785"
  },
  {
    rank: 4,
    id: "sample-4",
    name: "The Cause",
    artists: ["Gogohawk"],
    albumName: "VOL.10",
    spotifyUrl: "https://open.spotify.com/",
    imageUrl: "https://i.scdn.co/image/ab67616d0000b273d2a74bfeace1fd2c4429dd7a"
  },
  {
    rank: 5,
    id: "sample-5",
    name: "Molecular Gastronomy",
    artists: ["Silica Gel"],
    albumName: "Molecular Gastronomy",
    spotifyUrl: "https://open.spotify.com/",
    imageUrl: "https://i.scdn.co/image/ab67616d0000b273a97c2b73bb857df076a21138"
  },
  {
    rank: 6,
    id: "sample-6",
    name: "Yo! Taiji!",
    artists: ["Seo Taiji and Boys"],
    albumName: "Seotaiji and Boys IV",
    spotifyUrl: "https://open.spotify.com/",
    imageUrl: "https://i.scdn.co/image/ab67616d0000b273043312c4495bf982f36f837a"
  },
  {
    rank: 7,
    id: "sample-7",
    name: "Andre99",
    artists: ["Silica Gel"],
    albumName: "POWER ANDRE 99",
    spotifyUrl: "https://open.spotify.com/",
    imageUrl: "https://i.scdn.co/image/ab67616d0000b273c0e82bd1db784c147b8cbe31"
  },
  {
    rank: 8,
    id: "sample-8",
    name: "P",
    artists: ["Gogohawk"],
    albumName: "VOL.10",
    spotifyUrl: "https://open.spotify.com/",
    imageUrl: "https://i.scdn.co/image/ab67616d0000b273d2a74bfeace1fd2c4429dd7a"
  },
  {
    rank: 9,
    id: "sample-9",
    name: "BIG VOID",
    artists: ["Silica Gel"],
    albumName: "BIG VOID",
    spotifyUrl: "https://open.spotify.com/",
    imageUrl: "https://i.scdn.co/image/ab67616d0000b2733d2736fb67da689e16496eb0"
  },
  {
    rank: 10,
    id: "sample-10",
    name: "Luminescence",
    artists: ["THORNAPPLE"],
    albumName: "My Century",
    spotifyUrl: "https://open.spotify.com/",
    imageUrl: "https://i.scdn.co/image/ab67616d0000b273b5e023b091f820924d763c9f"
  }
];

function getTrack(tracks: TopTrack[], rank: number): TopTrack {
  return tracks.find((track) => track.rank === rank) ?? sampleTracks[rank - 1];
}

function TrackRow({ track, active = false, marginBottom = 0 }: { track: TopTrack; active?: boolean; marginBottom?: number }) {
  const title = truncateText(track.name, 18);
  const artists = truncateText(joinArtists(track.artists), 19);

  return (
    <a
      href={track.spotifyUrl}
      target="_blank"
      style={{
        alignItems: "center",
        background: active ? "#1e1e1e" : "#121212",
        color: "#f2f2f2",
        display: "flex",
        gap: 8,
        height: ROW_HEIGHT,
        marginBottom,
        overflow: "hidden",
        padding: "4px 6px 4px 4px",
        textDecoration: "none",
        width: WIDGET_WIDTH
      }}
    >
      <span
        style={{
          background: track.imageUrl ? `#2a2a2a url("${track.imageUrl}") center / cover no-repeat` : "#2a2a2a",
          display: "block",
          flex: "0 0 35px",
          height: 35,
          overflow: "hidden"
        }}
      />
      <span style={{ display: "block", minWidth: 0 }}>
        <strong
          style={{
            color: active ? SPOTIFY_GREEN : "#f2f2f2",
            display: "block",
            fontSize: 10.5,
            lineHeight: "13px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap"
          }}
        >
          {title}
        </strong>
        <span
          style={{
            color: active ? "#f2f2f2" : "#a7a7a7",
            display: "block",
            fontSize: 8.5,
            lineHeight: "10px",
            marginTop: 2,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap"
          }}
        >
          {String(track.rank).padStart(2, "0")} · {artists}
        </span>
      </span>
    </a>
  );
}

function Header() {
  return (
    <div style={{ background: "#121212", boxSizing: "border-box", height: ROW_HEIGHT, padding: "8px 9px", width: WIDGET_WIDTH }}>
      <strong style={{ color: "#f5f5f5", display: "block", fontSize: 13, lineHeight: "15px" }}>Wavy Top 10</strong>
      <span style={{ color: "#9b9b9b", display: "block", fontSize: 8.5, lineHeight: "10px", marginTop: 3 }}>
        recent Spotify tracks
      </span>
    </div>
  );
}

function Footer() {
  return (
    <div style={{ background: "#121212", boxSizing: "border-box", height: ROW_HEIGHT, padding: "7px 9px", width: WIDGET_WIDTH }}>
      <a
        href="/api/widget.svg"
        target="_blank"
        style={{ color: SPOTIFY_GREEN, display: "block", fontSize: 10, fontWeight: 700, lineHeight: "13px", textDecoration: "none" }}
      >
        open full chart
      </a>
      <span style={{ color: "#9b9b9b", display: "block", fontSize: 8.5, lineHeight: "10px", marginTop: 3 }}>
        updated daily
      </span>
    </div>
  );
}

function WidgetFrame({ children, paddingTop = 0 }: { children: ReactNode; paddingTop?: number }) {
  return (
    <div
      style={{
        background: "#121212",
        boxSizing: "border-box",
        fontFamily: "Arial, sans-serif",
        height: WIDGET_HEIGHT,
        overflow: "hidden",
        paddingTop,
        width: WIDGET_WIDTH
      }}
    >
      {children}
    </div>
  );
}

export default async function DemoPage() {
  const data = await getWidgetData();
  const tracks = data?.tracks?.length ? data.tracks : sampleTracks;

  return (
    <main
      style={{
        background: "#f2f2f2",
        color: "#111",
        fontFamily: "Arial, sans-serif",
        minHeight: "100vh",
        padding: "36px 24px"
      }}
    >
      <div style={{ margin: "0 auto", maxWidth: 760 }}>
        <h1 style={{ fontSize: 24, lineHeight: "30px", margin: "0 0 8px" }}>Compact Spotify Widget Demo</h1>
        <p style={{ color: "#555", fontSize: 14, lineHeight: "22px", margin: "0 0 28px" }}>
          Layout values are locked: row 43px, row gap 10px, widget 154x150px, Naver divider 8px.
        </p>

        <div style={{ alignItems: "flex-start", display: "flex", gap: 40, flexWrap: "wrap" }}>
          <section>
            <h2 style={{ fontSize: 13, letterSpacing: 0, margin: "0 0 10px" }}>Naver stacked preview</h2>
            <div style={{ background: "#ffffff", border: "1px solid #d8d8d8", padding: 8, width: 172 }}>
              <WidgetFrame>
                <Header />
                <div style={{ height: 9 }} />
                <TrackRow active track={getTrack(tracks, 1)} marginBottom={ROW_GAP} />
                <TrackRow track={getTrack(tracks, 2)} marginBottom={2} />
              </WidgetFrame>
              <div style={{ height: DIVIDER_HEIGHT }} />
              <WidgetFrame>
                <TrackRow track={getTrack(tracks, 3)} marginBottom={ROW_GAP} />
                <TrackRow track={getTrack(tracks, 4)} marginBottom={ROW_GAP} />
                <TrackRow track={getTrack(tracks, 5)} marginBottom={1} />
              </WidgetFrame>
              <div style={{ height: DIVIDER_HEIGHT }} />
              <WidgetFrame paddingTop={1}>
                <TrackRow track={getTrack(tracks, 6)} marginBottom={ROW_GAP} />
                <TrackRow track={getTrack(tracks, 7)} marginBottom={ROW_GAP} />
                <TrackRow track={getTrack(tracks, 8)} />
              </WidgetFrame>
              <div style={{ height: DIVIDER_HEIGHT }} />
              <WidgetFrame paddingTop={2}>
                <TrackRow track={getTrack(tracks, 9)} marginBottom={ROW_GAP} />
                <TrackRow track={getTrack(tracks, 10)} marginBottom={9} />
                <Footer />
              </WidgetFrame>
            </div>
          </section>

          <section style={{ maxWidth: 420 }}>
            <h2 style={{ fontSize: 13, letterSpacing: 0, margin: "0 0 10px" }}>Design notes</h2>
            <div style={{ background: "#fff", border: "1px solid #ddd", padding: 18 }}>
              <p style={{ color: "#333", fontSize: 14, lineHeight: "22px", margin: "0 0 14px" }}>
                Minimal Spotify-inspired grayscale UI with one accent color. Album covers come from the Spotify track data
                already stored in Redis.
              </p>
              <ul style={{ color: "#555", fontSize: 13, lineHeight: "22px", margin: 0, paddingLeft: 18 }}>
                <li>Background: #121212</li>
                <li>Active title: Spotify green</li>
                <li>Rows use real album image URLs when available</li>
                <li>Widget sizing and spacing are unchanged</li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
