import { NextResponse } from "next/server";
import { readRequiredEnv } from "@/lib/env";

const STATE_COOKIE = "spotify_oauth_state";

export async function GET() {
  const state = crypto.randomUUID();
  const authorizeUrl = new URL("https://accounts.spotify.com/authorize");

  authorizeUrl.searchParams.set("response_type", "code");
  authorizeUrl.searchParams.set("client_id", readRequiredEnv("SPOTIFY_CLIENT_ID"));
  authorizeUrl.searchParams.set("scope", "user-top-read");
  authorizeUrl.searchParams.set("redirect_uri", readRequiredEnv("SPOTIFY_REDIRECT_URI"));
  authorizeUrl.searchParams.set("state", state);

  const response = NextResponse.redirect(authorizeUrl);
  response.cookies.set(STATE_COOKIE, state, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/api/auth",
    maxAge: 60 * 10
  });

  return response;
}
