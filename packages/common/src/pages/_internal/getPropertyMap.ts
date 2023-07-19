import { IPropertyMap } from "../../core/_internal/PropertyMapper";
import { getBasePropertyMap } from "../../core/_internal/getBasePropertyMap";

/**
 * Returns an Array of IPropertyMap objects
 * that define the projection of properties from a IModel to an IHubPage
 * @returns
 * @private
 */

export function getPropertyMap(): IPropertyMap[] {
  const map = getBasePropertyMap();

  /**
   * page-specific mappings.
   */
  // map.push({ entityKey: "permissions", storeKey: "data.permissions" });
  const valueProps = ["headContent", "layout"];
  valueProps.forEach((entityKey) => {
    map.push({ entityKey, storeKey: `data.values.${entityKey}` });
  });

  return map;
}
