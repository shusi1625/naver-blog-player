import { readOptionalEnv } from "@/lib/env";
import { jsonError } from "@/lib/http";
import { getWidgetData, setWidgetData } from "@/lib/storage";
import { buildLatestWidgetData } from "@/lib/widget-data";

function isAuthorized(request: Request): boolean {
  const url = new URL(request.url);
  const userAgent = request.headers.get("user-agent") ?? "";
  const authorization = request.headers.get("authorization") ?? "";
  const cronSecret = readOptionalEnv("CRON_SECRET");
  const querySecret = url.searchParams.get("secret");
  const bearerToken = authorization.startsWith("Bearer ") ? authorization.slice("Bearer ".length) : null;

  if (userAgent.toLowerCase().includes("vercel-cron")) {
    return true;
  }

  return Boolean(cronSecret && (querySecret === cronSecret || bearerToken === cronSecret));
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return jsonError("UNAUTHORIZED", "Invalid or missing cron secret.", 401);
  }

  try {
    const data = await buildLatestWidgetData();
    await setWidgetData(data);

    return Response.json({
      ok: true,
      updatedAtKst: data.updatedAtKst,
      count: data.tracks.length
    });
  } catch (error) {
    const previous = await getWidgetData();

    return jsonError("UPDATE_TOP_TRACKS_FAILED", error instanceof Error ? error.message : "Update failed.", 502, {
      usedPreviousData: Boolean(previous)
    });
  }
}
