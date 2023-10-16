import { getBasePropertyMap } from "../../core/_internal/getBasePropertyMap";
import { IPropertyMap } from "../../core/_internal/PropertyMapper";

/**
 * @private
 * Returns an Array of IPropertyMap objects that
 * define the projection of properties from an
 * IModel to an IHubTemplate
 */
export function getPropertyMap(): IPropertyMap[] {
  const map = getBasePropertyMap();

  // IHubTemplate specific mappings
  map.push({ entityKey: "previewUrl", storeKey: "item.properties.previewUrl" });

  return map;
}
