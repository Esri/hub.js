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

  // Type specific mappings
  map.push({ entityKey: "status", storeKey: "data.status" });
  map.push({ entityKey: "catalog", storeKey: "data.catalog" });
  map.push({ entityKey: "permissions", storeKey: "data.permissions" });

  map.push({ entityKey: "contacts", storeKey: "data.contacts" });
  map.push({ entityKey: "timeline", storeKey: "data.timeline" });
  map.push({ entityKey: "metrics", storeKey: "item.properties.metrics" });

  map.push({
    entityKey: "location",
    storeKey: "item.properties.location",
  });

  map.push({
    entityKey: "features",
    storeKey: "data.settings.features",
  });

  return map;
}
