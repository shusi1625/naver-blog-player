import { readOptionalEnv } from "@/lib/env";
import { jsonError } from "@/lib/http";
import { getWidgetData, setWidgetData } from "@/lib/storage";
import { buildLatestWidgetData } from "@/lib/widget-data";

export const dynamic = "force-dynamic";

function isAuthorized(request: Request): boolean {
  const url = new URL(request.url);
  const authorization = request.headers.get("authorization") ?? "";
  const cronSecret = readOptionalEnv("CRON_SECRET");
  const querySecret = url.searchParams.get("secret");

  if (!cronSecret) {
    return false;
  }

  return authorization === `Bearer ${cronSecret}` || querySecret === cronSecret;
}

async function updateTopTracks(request: Request) {
  if (!isAuthorized(request)) {
    return jsonError("UNAUTHORIZED", "Invalid or missing cron secret.", 401);
  }

  try {
    const data = await buildLatestWidgetData();
    await setWidgetData(data);

    return Response.json({
      ok: true,
      updatedAtKst: data.updatedAtKst,
      count: data.tracks.length,
      schedule: request.headers.get("x-vercel-cron-schedule")
    }, {
      headers: {
        "Cache-Control": "no-store"
      }
    });
  } catch (error) {
    const previous = await getWidgetData();

    return jsonError("UPDATE_TOP_TRACKS_FAILED", error instanceof Error ? error.message : "Update failed.", 502, {
      usedPreviousData: Boolean(previous)
    });
  }
}

export async function GET(request: Request) {
  return updateTopTracks(request);
}

export async function POST(request: Request) {
  return updateTopTracks(request);
}
