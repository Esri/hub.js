import { IArcGISContext } from "../../ArcGISContext";
import { IHubEditableContent } from "../../core/types/IHubEditableContent";

export function canCreateExportItem(
  _entity: IHubEditableContent,
  _context: IArcGISContext
) {
  // TODO: port over logic from ember's download-service
  return true;
}
