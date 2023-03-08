import { IPropertyMap } from "../../core/_internal/PropertyMapper";
import { getBasePropertyMap } from "../../core/_internal/getBasePropertyMap";

/**
 * Returns an Array of IPropertyMap objects
 * that define the projection of properties from a IModel to an IHubProject
 * @returns
 * @private
 */

export function getPropertyMap(): IPropertyMap[] {
  const map = getBasePropertyMap();

  /**
   * project-specific mappings. Note: we do not need to explicitly map
   * properties from the project item's data.view into the entity's view
   * because that mapping is already defined in the base property map
   */
  map.push({ objectKey: "status", modelKey: "data.status" });
  map.push({ objectKey: "catalog", modelKey: "data.catalog" });
  map.push({ objectKey: "permissions", modelKey: "data.permissions" });
  map.push({
    objectKey: "capabilities",
    modelKey: "data.settings.capabilities",
  });

  map.push({
    objectKey: "dynamicValues",
    modelKey: "item.properties.dynamicValues",
  });
  map.push({
    objectKey: "values",
    modelKey: "item.properties.values",
  });

  return map;
}
