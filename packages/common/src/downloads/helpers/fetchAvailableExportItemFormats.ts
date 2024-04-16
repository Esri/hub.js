import { IArcGISContext } from "../../ArcGISContext";
import { IHubEditableContent } from "../../core/types/IHubEditableContent";
import { buildExistingExportsPortalQuery } from "./build-existing-exports-portal-query";
import { IDynamicDownloadFormat, PORTAL_EXPORT_TYPES } from "./types";
import { fetchAllPages } from "../../items";
import { IItem, searchItems } from "@esri/arcgis-rest-portal";

export async function fetchAvailableExportItemFormats(
  entity: IHubEditableContent,
  context: IArcGISContext
): Promise<IDynamicDownloadFormat[]> {
  // NOTE: we _need_ to pass the spatialRefId otherwise we're going to default to 4326
  // Dang it, we'll need to pass the layerId as well... should we support multiple layers?
  const q = buildExistingExportsPortalQuery(entity.id);
  const exportItems = (await fetchAllPages(searchItems, {
    q,
    ...context.requestOptions,
  })) as IItem[];
  const formatsWithDuplicates = exportItems
    .map(itemToExportFormat)
    .filter(Boolean);
  const formatsWithoutDuplicates = Array.from(new Set(formatsWithDuplicates));

  return formatsWithoutDuplicates.map((format) => ({
    type: "dynamic",
    format,
  }));
}

// TODO: man, can't we make this cleaner???
function itemToExportFormat(item: IItem): string {
  return Object.keys(PORTAL_EXPORT_TYPES).find((format) =>
    PORTAL_EXPORT_TYPES[
      format as keyof typeof PORTAL_EXPORT_TYPES
    ].itemTypes.includes(item.type)
  );
}
