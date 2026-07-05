import { getWidgetData } from "@/lib/storage";

function parseRankParam(value: string): number {
  return Number(value.replace(/\.[a-z0-9]+$/i, ""));
}

function placeholderResponse(): Response {
  return new Response(
    `<svg width="35" height="35" viewBox="0 0 35 35" xmlns="http://www.w3.org/2000/svg"><rect width="35" height="35" fill="#2a2a2a"/></svg>`,
    {
      headers: {
        "Cache-Control": "public, max-age=300, s-maxage=300",
        "Content-Type": "image/svg+xml"
      }
    }
  );
}

export async function GET(_request: Request, context: { params: Promise<{ rank: string }> }) {
  const { rank } = await context.params;
  const parsedRank = parseRankParam(rank);
  const data = await getWidgetData();
  const imageUrl = data?.tracks.find((track) => track.rank === parsedRank)?.imageUrl;

  if (!imageUrl || !imageUrl.startsWith("https://i.scdn.co/")) {
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
