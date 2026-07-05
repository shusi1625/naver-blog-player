import { exchangeSpotifyCode } from "@/lib/spotify";

const STATE_COOKIE = "spotify_oauth_state";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const cookieHeader = request.headers.get("cookie") ?? "";
  const stateCookie = cookieHeader
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${STATE_COOKIE}=`))
    ?.split("=")[1];

  if (!code || !state || !stateCookie || state !== decodeURIComponent(stateCookie)) {
    return new Response("Invalid Spotify authorization state.", { status: 400 });
  }

  const token = await exchangeSpotifyCode(code);
  const canShowRefreshToken =
    process.env.NODE_ENV !== "production" || process.env.SHOW_REFRESH_TOKEN_ON_CALLBACK === "true";

  const refreshTokenBlock =
    canShowRefreshToken && token.refresh_token
      ? `<p>Copy this refresh token into <code>SPOTIFY_REFRESH_TOKEN</code>:</p><pre>${token.refresh_token}</pre>`
      : "<p>Authorization complete. Store the refresh token securely as SPOTIFY_REFRESH_TOKEN.</p>";

  return new Response(
    `<!doctype html><html><body style="font-family:Arial,sans-serif;line-height:1.5"><h1>Spotify authorization complete</h1>${refreshTokenBlock}</body></html>`,
    {
      headers: {
        "Content-Type": "text/html; charset=utf-8"
      }
    }
  );
}
