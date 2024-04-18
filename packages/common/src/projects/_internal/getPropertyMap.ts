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

  // TOOD: Remove catalog and swap to using the content-capability-pane in the UI
  map.push({ entityKey: "catalog", storeKey: "data.catalog" });

  // Capabilities
  map.push({ entityKey: "content", storeKey: "data.content" });
  map.push({ entityKey: "events", storeKey: "data.events" });

  map.push({ entityKey: "permissions", storeKey: "data.permissions" });
  map.push({
    entityKey: "features",
    storeKey: "data.settings.features",
  });
  map.push({
    entityKey: "location",
    storeKey: "item.properties.location",
  });
  map.push({ entityKey: "metrics", storeKey: "item.properties.metrics" });

  return map;
}
