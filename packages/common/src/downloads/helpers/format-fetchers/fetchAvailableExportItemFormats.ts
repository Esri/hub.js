import { IArcGISContext } from "../../../ArcGISContext";
import { IHubEditableContent } from "../../../core/types/IHubEditableContent";
import { buildExistingExportsPortalQuery } from "../build-existing-exports-portal-query";
import {
  ExportItemFormat,
  IStaticDownloadFormat,
  PORTAL_EXPORT_TYPES,
} from "../types";
import { fetchAllPages } from "../../../items";
import { IItem, searchItems } from "@esri/arcgis-rest-portal";
import { getExportItemDataUrl } from "../getExportItemDataUrl";
import HubError from "../../../HubError";

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
    format: toExportItemFormat(item.type),
    url: getExportItemDataUrl(item.id, context),
  }));
}

// TODO: man, can't we make this cleaner???
function toExportItemFormat(itemType: string): ExportItemFormat {
  return Object.keys(PORTAL_EXPORT_TYPES).find((format) =>
    PORTAL_EXPORT_TYPES[
      format as keyof typeof PORTAL_EXPORT_TYPES
    ].itemTypes.includes(itemType)
  ) as ExportItemFormat;
}
