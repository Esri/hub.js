import { IPropertyMap } from "../../core/_internal/PropertyMapper";
import { getBasePropertyMap } from "../../core/_internal/getBasePropertyMap";

/**
 * Returns an Array of IPropertyMap objects
 * that define the projection of properties from a IModel to an IHubDiscussion
 * @returns an IPropertyMap array
 * @private
 */

export function getPropertyMap(): IPropertyMap[] {
  const map = getBasePropertyMap();

  // Type specific mappings
  map.push({ objectKey: "prompt", modelKey: "data.prompt" });
  map.push({
    objectKey: "location",
    modelKey: "item.properties.location",
  });
  return map;
}
