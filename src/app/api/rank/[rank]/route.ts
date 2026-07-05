import { svgResponse } from "@/lib/http";
import { getWidgetData } from "@/lib/storage";
import { renderRankSvg } from "@/lib/svg";

export async function GET(_request: Request, context: { params: Promise<{ rank: string }> }) {
  const { rank } = await context.params;
  const parsedRank = Number(rank);
  const data = await getWidgetData();

  return svgResponse(renderRankSvg(data, parsedRank));
}
