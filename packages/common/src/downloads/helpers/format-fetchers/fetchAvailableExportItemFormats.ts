import { buildExistingExportsPortalQuery } from "../build-existing-exports-portal-query";
import {
  ExportItemFormat,
  IStaticDownloadFormat,
  LegacyExportItemFormat,
  PORTAL_EXPORT_TYPES,
  ServiceDownloadFormat,
} from "../types";
import { IItem, searchItems } from "@esri/arcgis-rest-portal";
import { getExportItemDataUrl } from "../getExportItemDataUrl";
import { IHubEditableContent } from "../../../core/types/IHubEditableContent";
import { IArcGISContext } from "../../../ArcGISContext";
import HubError from "../../../HubError";
import { fetchAllPages } from "../../../items/fetch-all-pages";

/**
 * @private
 * Fetches an entity's available download formats that were previously created by the Portal API's item /export
 * endpoint. This is useful for anonymous enterprise users who need to download data from a Hosted Feature Service,
 * but do not have the privileges to create their own item export. As the exports have been previously created, they
 * can be downloaded statically by anyone with the URL.
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
export async function fetchAvailableExportItemFormats(
  entity: IHubEditableContent,
  context: IArcGISContext,
  layers: number[] = []
): Promise<IStaticDownloadFormat[]> {
  if (layers.length > 1) {
    throw new HubError(
      "fetchAvailableExportItemFormats",
      "Multi-layer downloads are not supported for this item"
    );
  }
  // NOTE: we _need_ to pass the spatialRefId otherwise we're going to default to 4326
  // Dang it, we'll need to pass the layerId as well... should we support multiple layers?
  const q = buildExistingExportsPortalQuery(entity.id, { layerId: layers[0] });
  const exportItems = (await fetchAllPages(searchItems, {
    q,
    ...context.requestOptions,
  })) as IItem[];

  // TODO: Do we need to worry about duplicates here?

  return exportItems.map((item) => ({
    type: "static",
    label: null,
    format: getExportItemFormat(item.type),
    url: getExportItemDataUrl(item.id, context),
  })) as any[]; // TODO: change export formats to use the ServiceDownloadFormat type
}

function getExportItemFormat(itemType: string): ExportItemFormat {
  const legacyExportItemFormat = (
    Object.keys(PORTAL_EXPORT_TYPES) as LegacyExportItemFormat[]
  ).find((format: LegacyExportItemFormat) => {
    return PORTAL_EXPORT_TYPES[format].itemTypes.includes(itemType);
  }) as LegacyExportItemFormat;
  return migrateExportItemFormat(legacyExportItemFormat);
}

function migrateExportItemFormat(
  format: LegacyExportItemFormat
): ExportItemFormat {
  return format === "fileGeodatabase"
    ? ServiceDownloadFormat.FILE_GDB
    : (format as ExportItemFormat);
}
