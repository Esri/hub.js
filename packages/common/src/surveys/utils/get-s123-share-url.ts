import type { IArcGISContext } from "../../IArcGISContext";

export function getS123ShareUrl(id: string, context: IArcGISContext) {
  return `${context.survey123Url}/share/${id}?portalUrl=${encodeURIComponent(
    context.portalUrl
  )}`;
}
