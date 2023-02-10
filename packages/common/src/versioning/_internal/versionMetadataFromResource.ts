import { IVersionMetadata } from "../types";

/**
 * Returns an IVersionMetadata from the resource search result item
 * @param resource
 * @private
 */
export function versionMetadataFromResource(
  resource: Record<string, any>
): IVersionMetadata {
  // we get access, path, and size from the resource itself
  const { access, resource: path, size } = resource;

  // the rest is on properties as a json string
  let properties;
  const propertiesJson = resource.properties || "{}";
  try {
    properties = JSON.parse(propertiesJson);
  } catch (e) {
    properties = {};
  }

  return {
    ...properties,
    access,
    path,
    size,
  };
}
