import type { IArcGISContext } from "../../types/IArcGISContext";
import { getProp } from "../../objects";

/**
 * @private
 * Generates a URL to download the data of an export item.
 * @param exportItemId ID of the export item
 * @param context ArcGIS application context
 * @returns URL to download the data of the export item
 */
export function getExportItemDataUrl(
  exportItemId: string,
  context: IArcGISContext
): string {
  const baseUrl = `${context.portalUrl}/sharing/rest/content/items/${exportItemId}/data`;
  const token = getProp(context, "hubRequestOptions.authentication.token");
  return token ? `${baseUrl}?token=${token}` : baseUrl;
}
