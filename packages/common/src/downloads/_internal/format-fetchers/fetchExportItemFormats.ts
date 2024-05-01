import { IArcGISContext } from "../../../ArcGISContext";
import { IHubEditableContent } from "../../../core/types/IHubEditableContent";
import { IDownloadFormat } from "../../types";

/**
 * @private
 * Fetches an entity's available download formats. Owners of the entity can create all formats supported by
 * the Portal API's item /export endpoint, while users that don't have privileges to the item /export endpoint
 * can only download formats that were previously exported by the entity's owner.
 *
 * NOTE: This function is a work-in-progress. Various permissions and logic branches are not yet implemented.
 *
 * NOTE: This is a last resort approach for current Enterprise environments, but it will be replaced
 * with using the formats defined the service's /createReplica endpoint directly in the future (i.e.,
 * once the Enterprise team achieves feature parity with the Online team's implementation).
 *
 * This is because The item /export endpoint can only be used on Hosted Feature Services with the "Extract" capability
 * enabled, which means the service will also have the /createReplica endpoint available. As /createReplica is a more
 * flexible operation that can be invoked by anonymous users, /export becomes obsolete.
 *
 * @param entity Hosted Feature Service entity to fetch download formats for
 * @param context ArcGIS application context
 * @param layers target layers that the download will be filtered to
 * @returns available download formats for the entity
 */
export async function fetchExportItemFormats(
  _entity: IHubEditableContent,
  _context: IArcGISContext,
  _layers?: number[]
): Promise<IDownloadFormat[]> {
  throw new Error("Not implemented");
  // return canCreateExport(entity, context)
  //   ? getAllExportItemFormats()
  //   : fetchAvailableExportItemFormats(entity, context, layers);
}
