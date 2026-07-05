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
  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "no-store, no-cache, must-revalidate",
      Pragma: "no-cache",
      Expires: "0"
    }
  });
}
