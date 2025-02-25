import type { IArcGISContext } from "../../IArcGISContext";

export function getS123EditUrl(id: string, context: IArcGISContext) {
  return `${context.survey123Url}/surveys/${id}?portalUrl=${encodeURIComponent(
    context.portalUrl
  )}`;
}
