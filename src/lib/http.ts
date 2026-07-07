import { getWidgetSvgCacheSeconds } from "@/lib/env";

export function jsonError(error: string, message: string, status = 500, extra?: Record<string, unknown>) {
  return Response.json(
    {
      ok: false,
      error,
      message,
      ...extra
    },
    { status }
  );
}

export function svgResponse(svg: string): Response {
  const cacheSeconds = getWidgetSvgCacheSeconds();

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control":
        cacheSeconds > 0
          ? `public, max-age=${cacheSeconds}, s-maxage=${cacheSeconds}`
          : "no-store, no-cache, must-revalidate"
    }
  });
}
