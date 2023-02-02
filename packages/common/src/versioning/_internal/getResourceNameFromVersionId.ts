import { getPrefix } from "./getPrefix";
import { VERSION_RESOURCE_NAME } from "./constants";

// gets the resource name from the version name
export function getResourceNameFromVersionId(versionId: string) {
  return getPrefix(`${versionId}/${VERSION_RESOURCE_NAME}`);
}
