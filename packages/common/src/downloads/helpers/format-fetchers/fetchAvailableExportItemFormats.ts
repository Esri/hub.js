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
