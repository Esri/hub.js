import { bBoxToExtent, orgExtent } from "../../../extent";
import { IHubRequestOptions } from "../../../types";
import { EditorOptions } from "./EditorOptions";
/**
 * Get the extent from the entity's location, if it has one.
 * Otherwise, fall back to using the org extent.
 */
export async function getLocationExtent(
  entity: EditorOptions,
  hubRequestOptions: IHubRequestOptions
) {
  return entity.location?.extent?.length
    ? bBoxToExtent(entity.location.extent)
    : await orgExtent(hubRequestOptions);
}
