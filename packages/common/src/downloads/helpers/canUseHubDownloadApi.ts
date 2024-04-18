import { IArcGISContext } from "../../ArcGISContext";
import { IHubEditableContent } from "../../core/types/IHubEditableContent";

export function canUseHubDownloadApi(
  entity: IHubEditableContent,
  context: IArcGISContext
): boolean {
  // TODO: use permission instead.
  return !context.isPortal && entity.access === "public";
}
