import { svgResponse } from "@/lib/http";
import { getWidgetData } from "@/lib/storage";
import { renderRankSvg } from "@/lib/svg";

function parseRankParam(value: string): number {
  const normalized = value.replace(/\.svg$/i, "");
  return Number(normalized);
}

export async function GET(_request: Request, context: { params: Promise<{ rank: string }> }) {
  const { rank } = await context.params;
  const parsedRank = parseRankParam(rank);
  const data = await getWidgetData();

  return svgResponse(renderRankSvg(data, parsedRank));
}
