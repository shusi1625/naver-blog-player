import { getWidgetProfileImageUrl } from "@/lib/env";
import { getWidgetData } from "@/lib/storage";

function placeholderResponse(): Response {
  return new Response(
    `<svg width="35" height="35" viewBox="0 0 35 35" xmlns="http://www.w3.org/2000/svg"><rect width="35" height="35" rx="17.5" fill="#2a2a2a"/><circle cx="17.5" cy="14" r="6" fill="#777"/><path d="M7 31c1.8-6.5 6-10 10.5-10s8.7 3.5 10.5 10" fill="#777"/></svg>`,
    {
      headers: {
        "Cache-Control": "public, max-age=300, s-maxage=300",
        "Content-Type": "image/svg+xml"
      }
    }
  );
}

export async function GET() {
  const data = await getWidgetData();
  const imageUrl = data?.profile?.imageUrl ?? getWidgetProfileImageUrl();

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
