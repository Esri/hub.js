import { IArcGISContext } from "../../../ArcGISContext";
import { IHubEditableContent } from "../../../core/types/IHubEditableContent";
import { IDownloadFormat } from "../types";

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

// function canCreateExport(
//   _entity: IHubEditableContent,
//   _context: IArcGISContext
// ): boolean {
//   // TODO: port over logic from ember's download-service
//   return true;
// }
