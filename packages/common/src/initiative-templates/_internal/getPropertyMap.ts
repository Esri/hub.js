import { getBasePropertyMap } from "../../core/_internal/getBasePropertyMap";
import { IPropertyMap } from "../../core/_internal/PropertyMapper";

/**
 * @private
 * Returns an Array of IPropertyMap objects
 * that define the projection of properties from an IModel to an IHubInitiativeTemplate
 */
export function getPropertyMap(): IPropertyMap[] {
  const map = getBasePropertyMap();

  // Type specific mappings
  map.push({ entityKey: "previewUrl", storeKey: "item.properties.previewUrl" });
  map.push({ entityKey: "siteSolutionId", storeKey: "data.siteSolutionId" });
  map.push({
    entityKey: "recommendedTemplates",
    storeKey: "data.recommendedTemplates",
  });

  return map;
}
