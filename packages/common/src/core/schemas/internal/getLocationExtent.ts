import { bBoxToExtent, orgExtent } from "../../../extent";
import { IHubRequestOptions } from "../../../types";
import { IEntityEditorOptions } from "./EditorOptions";
/**
 * Get the extent from the entity's location, if it has one.
 * Otherwise, fall back to using the org extent.
 */
export async function getLocationExtent(
  options: IEntityEditorOptions,
  hubRequestOptions: IHubRequestOptions
) {
  return options.location?.extent?.length
    ? bBoxToExtent(options.location.extent)
    : await orgExtent(hubRequestOptions);
}
