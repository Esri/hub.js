import { IArcGISContext } from "../../ArcGISContext";
import { getProp } from "../../objects";

export function getExportItemDataUrl(
  exportItemId: string,
  context: IArcGISContext
): string {
  const baseUrl = `${context.portalUrl}/sharing/rest/content/items/${exportItemId}/data`;
  const token = getProp(context, "hubRequestOptions.authentication.token");
  return token ? `${baseUrl}?token=${token}` : baseUrl;
}
