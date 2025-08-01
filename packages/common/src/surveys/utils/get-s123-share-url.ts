import type { IArcGISContext } from "../../types/IArcGISContext";

export function getS123ShareUrl(id: string, context: IArcGISContext): string {
  return `${context.survey123Url}/share/${id}?portalUrl=${encodeURIComponent(
    context.portalUrl
  )}`;
}
