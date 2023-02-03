import { IVersionMetadata } from "../types";

export function versionMetadataFromResource(
  resource: Record<string, any>
): IVersionMetadata {
  // we get access, path, and size from the resource itself
  const { access, resource: path, size } = resource;

  // the rest is on properties as a json string
  let properties = resource.properties || {};
  if (properties) {
    if (typeof properties === "string") {
      try {
        properties = JSON.parse(properties);
      } catch (e) {
        // console.log("error parsing resource properties", e);
        properties = {};
      }
    }
  }

  return {
    ...properties,
    access,
    path,
    size,
  };
}
