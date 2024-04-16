import { IArcGISContext } from "../../ArcGISContext";
import { IHubEditableContent } from "../../core/types/IHubEditableContent";
import { fetchAvailableExportItemFormats } from "./fetchAvailableExportItemFormats";
import { getAllExportItemFormats } from "./getAllExportItemFormats";
import { IDynamicDownloadFormat } from "./types";

export async function fetchExportItemFormats(
  entity: IHubEditableContent,
  context: IArcGISContext,
  _layerId?: string
): Promise<IDynamicDownloadFormat[]> {
  return canCreateExport(entity, context)
    ? getAllExportItemFormats()
    : fetchAvailableExportItemFormats(entity, context);
}

function canCreateExport(
  _entity: IHubEditableContent,
  _context: IArcGISContext
): boolean {
  // TODO: port over logic from ember's download-service
  return true;
}
