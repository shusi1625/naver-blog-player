import { getWidgetData } from "@/lib/storage";

export async function GET() {
  const data = await getWidgetData();

  if (!data) {
    return Response.json({
      updatedAt: null,
      updatedAtKst: null,
      source: "spotify-top-tracks",
      timeRange: null,
      tracks: []
    });
  }

  return Response.json(data, {
    headers: {
      "Cache-Control": "no-store"
    }
  });
}
