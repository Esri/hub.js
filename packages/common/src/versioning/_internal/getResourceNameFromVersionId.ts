import { getPrefix } from "./getPrefix";
import { VERSION_RESOURCE_NAME } from "./constants";

/**
 * Returns the resource name
 * @param versionId
 * @private
 */
export function getResourceNameFromVersionId(versionId: string) {
  return getPrefix(`${versionId}/${VERSION_RESOURCE_NAME}`);
}
