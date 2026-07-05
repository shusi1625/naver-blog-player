import { svgResponse } from "@/lib/http";
import { getWidgetData } from "@/lib/storage";
import { renderFullWidgetSvg } from "@/lib/svg";

export async function GET() {
  const data = await getWidgetData();
  return svgResponse(renderFullWidgetSvg(data));
}
