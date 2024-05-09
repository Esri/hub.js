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
    "headerSass",
    "headContent",
    "layout",
  ];
  valueProps.forEach((entry) => {
    map.push({ entityKey: entry, storeKey: `data.values.${entry}` });
  });
  // Capabilities
  map.push({ entityKey: "events", storeKey: "data.events" });
  map.push({ entityKey: "initiatives", storeKey: "data.initiatives" });
  map.push({ entityKey: "projects", storeKey: "data.projects" });
  map.push({ entityKey: "content", storeKey: "data.content" });

  // Deeper/Indirect mappings
  map.push({
    entityKey: "slug",
    storeKey: "item.properties.slug",
  });
  map.push({
    entityKey: "followersGroupId",
    storeKey: "item.properties.followersGroupId",
  });
  map.push({
    entityKey: "legacyCapabilities",
    storeKey: "data.values.capabilities",
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
  map.push({
    entityKey: "legacyTeams",
    storeKey: "item.properties.teams",
  });
  map.push({ entityKey: "catalog", storeKey: "data.catalog" });

  map.push({
    entityKey: "features",
    storeKey: "data.settings.features",
  });

  map.push({
    entityKey: "telemetry",
    storeKey: "data.telemetry",
  });

  return map;
}
