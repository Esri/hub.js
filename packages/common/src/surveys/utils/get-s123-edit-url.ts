import type { IArcGISContext } from "../../types/IArcGISContext";

export function getS123EditUrl(id: string, context: IArcGISContext): string {
  return `${context.survey123Url}/surveys/${id}?portalUrl=${encodeURIComponent(
    context.portalUrl
  )}`;
}
