import { getWidgetData } from "@/lib/storage";

export async function GET(_request: Request, context: { params: Promise<{ rank: string }> }) {
  const { rank } = await context.params;
  const parsedRank = Number(rank);

  if (!Number.isInteger(parsedRank) || parsedRank < 1 || parsedRank > 10) {
    return new Response("Invalid rank.", { status: 404 });
  }

  const data = await getWidgetData();
  const track = data?.tracks.find((item) => item.rank === parsedRank);

  if (!track?.spotifyUrl) {
    return Response.redirect("https://open.spotify.com/", 302);
  }

  return Response.redirect(track.spotifyUrl, 302);
}
