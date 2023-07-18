import { IPropertyMap } from "../../core/_internal/PropertyMapper";
import { getBasePropertyMap } from "../../core/_internal/getBasePropertyMap";

/**
 * Returns an Array of IPropertyMap objects
 * We could define these directly, but since the
 * properties of IHubSite map directly to properties
 * on item or data, it's slightly less verbose to
 * generate the structure.
 * @returns
 */
export function getPropertyMap(): IPropertyMap[] {
  const map = getBasePropertyMap();
  // Site specific mappings
  map.push({ entityKey: "feeds", storeKey: "data.feeds" });
  map.push({ entityKey: "permissions", storeKey: "data.permissions" });
  map.push({
    entityKey: "capabilities",
    storeKey: "data.capabilities",
  });
  // Props stored below `data.values`
  const valueProps = [
    "pages",
    "theme",
    "subdomain",
    "defaultHostname",
    "customHostname",
    "clientId",
    "defaultExtent",
    "map",
    "telemetry",
    "headerSass",
    "headContent",
    "layout",
  ];
  valueProps.forEach((entry) => {
    map.push({ entityKey: entry, storeKey: `data.values.${entry}` });
  });
  // Deeper/Indirect mappings
  map.push({
    entityKey: "slug",
    storeKey: "item.properties.slug",
  });
  map.push({
    entityKey: "legacyCapabilities",
    storeKey: "data.values.capabilities",
  });
  map.push({
    entityKey: "capabilities",
    storeKey: "data.settings.capabilities",
  });
  map.push({
    entityKey: "orgUrlKey",
    storeKey: "item.properties.orgUrlKey",
  });
  map.push({
    entityKey: "name",
    storeKey: "item.title",
  });
  map.push({
    entityKey: "location",
    storeKey: "item.properties.location",
  });
  map.push({ entityKey: "catalog", storeKey: "data.catalog" });

  return map;
}
