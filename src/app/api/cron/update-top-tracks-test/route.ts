import { updateTopTracks } from "@/lib/top-tracks-update";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  return updateTopTracks(request);
}

export async function POST(request: Request) {
  return updateTopTracks(request);
}
