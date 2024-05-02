import { IArcGISContext } from "../../ArcGISContext";
import { IHubEditableContent } from "../../core/types/IHubEditableContent";

/**
 * @private
 * Determines if the current user can create an export item for the given entity.
 *
 * NOTE: This function is a placeholder. Various permissions and logic branches are not yet implemented.
 *
 * @param _entity
 * @param _context
 * @returns
 */
export function canCreateExportItem(
  _entity: IHubEditableContent,
  _context: IArcGISContext
) {
  // TODO: port over logic from the download-service
  return true;
}
