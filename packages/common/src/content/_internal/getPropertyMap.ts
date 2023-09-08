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
   * content-specific mappings. Note: we do not need to explicitly map
   * properties from the content item's data.view into the entity's view
   * because that mapping is already defined in the base property map
   */
  // NOTE: we may want to move these into getBaseProprtyMap(), see:
  // https://github.com/Esri/hub.js/pull/993#discussion_r1134005511
  map.push({ entityKey: "permissions", storeKey: "data.permissions" });

  map.push({
    entityKey: "location",
    storeKey: "item.properties.location",
  });

  map.push({
    entityKey: "licenseInfo",
    storeKey: "item.licenseInfo",
  });

  map.push({
    entityKey: "hostedDownloads",
    storeKey: "item.properties.downloads.hosted",
  });

  // features is intentionally left out

  // TODO: look into composeContent() for what we can add here

  return map;
}
