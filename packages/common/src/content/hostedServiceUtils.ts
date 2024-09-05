import { IFeatureServiceDefinition } from "@esri/arcgis-rest-feature-layer";
import { IItem } from "@esri/arcgis-rest-portal";
import { IHubEditableContent } from "../core/types/IHubEditableContent";

/**
 * DEPRECATED: This will be removed in the next breaking version. Use "isHostedFeatureServiceMainItem" instead.
 * Determines whether an item represents a hosted feature service
 * @param item item to check
 * @returns whether the item represents a hosted feature service
 */
export function isHostedFeatureServiceItem(item: IItem): boolean {
  /* tslint:disable no-console */
  console.warn(
    `"isHostedFeatureServiceItem()" is deprecated. Please use "isHostedFeatureServiceMainItem()"`
  );
  return isHostedFeatureServiceMainItem(item);
}

/**
 * Determines whether an item represents the main item of a hosted feature service
 * (i.e. the item that was created when the service was published, not an item that
 * referenced the service via url after it was created).
 *
 * NOTE: This check works for both hosted feature service items created in ArcGIS Online
 * and in ArcGIS Enterprise.
 *
 * @param item item to check
 * @returns whether the item passes the hosted feature service check
 */
export function isHostedFeatureServiceMainItem(item: IItem): boolean {
  return isHostedFeatureServiceMain(item.type, item.typeKeywords);
}

/**
 * DEPRECATED: This will be removed in the next breaking version Use "isHostedFeatureServiceMainEntity" instead
 * Determines whether an entity represents a hosted feature service
 * @param content content entity to check
 * @returns
 */
export function isHostedFeatureServiceEntity(
  content: IHubEditableContent
): boolean {
  /* tslint:disable no-console */
  console.warn(
    `"isHostedFeatureServiceEntity()" is deprecated. Please use "isHostedFeatureServiceMainEntity()"`
  );
  return isHostedFeatureServiceMain(content.type, content.typeKeywords);
}

/**
 * Determines whether an entity represents the main entity of a hosted feature service
 * (i.e. the entity that was created when the service was published, not an entity that
 * referenced the service via url after it was created)
 *
 * NOTE: This check works for both hosted feature service entities created in ArcGIS Online
 * and in ArcGIS Enterprise.
 *
 * @param content content entity to check
 * @returns
 */
export function isHostedFeatureServiceMainEntity(
  content: IHubEditableContent
): boolean {
  return isHostedFeatureServiceMain(content.type, content.typeKeywords);
}

/**
 * @private
 * base helper to determine whether the arguments correspond to the main item of a hosted feature service.
 * @param type an item type
 * @param typeKeywords an item typeKeywords array
 * @returns whether the arguments correspond to a hosted feature service
 */
function isHostedFeatureServiceMain(
  type: string,
  typeKeywords: string[] = []
): boolean {
  // This logic was given to us by the ArcGIS Online home app team. Apparently this is
  // part of the check they internally do when deciding whether to show the "Export Data"
  // button on the item settings page. See the "Tech" section of this issue for more details:
  // https://devtopia.esri.com/dc/hub/issues/7210
  return type === "Feature Service" && typeKeywords.includes("Hosted Service");
}

export function isAGOFeatureServiceUrl(url: string): boolean {
  // TODO: we should really centralize this regex somewhere
  const FEATURE_SERVICE_URL_REGEX = /(feature)server(\/|\/(\d+))?$/i;
  const isFeatureServer = FEATURE_SERVICE_URL_REGEX.test(url);

  // in AGO the url of a proxied service contains `arcgis.com` (regardless of whether or not the service is hosted)
  // what needs to be added here is whether or not it starts with `services`, `tiles`, or `features`
  // we also can't determine if a proxy URL aka a secure service is protecting a _hosted_ vs _non-hosted_ service
  return !!url && isHostedAgolService(url) && isFeatureServer;
}

/**
 * Get the origin of a URL
 * @param url the URL to get the origin from
 * @returns the origin of the URL
 */
function getOrigin(url: string): string {
  const parsedUrl = new URL(url);
  return parsedUrl.origin;
}

// stolen from js-api -- https://devtopia.esri.com/WebGIS/arcgis-js-api/blob/7b493793958948a2b32eb53ef6c7e4b355d0f74d/esri/layers/support/arcgisLayerUrl.ts#L158-L177
// no tests needed for this
export function isHostedAgolService(url: string): boolean {
  let origin = getOrigin(url); // -> www.esri.com

  if (!origin) {
    return false;
  }

  origin = origin.toLowerCase();

  // unfortunately, when a service is proxied and requires credentials, we have no way of knowing if it's hosted or not
  // ... meaning that we are returning false for all services that are proxied
  return (
    origin.endsWith(".arcgis.com") &&
    (origin.startsWith("services") ||
      origin.startsWith("tiles") ||
      origin.startsWith("features"))
  );
}

export enum ServiceCapabilities {
  EXTRACT = "Extract",
  QUERY = "Query",
}

/**
 * Returns a whether a service has a capability
 * @param capability
 * @param serviceDefinition
 *
 * @returns {boolean}
 */
export function hasServiceCapability(
  capability: ServiceCapabilities,
  serviceDefinition: Partial<IFeatureServiceDefinition>
) {
  const capabilities = (serviceDefinition.capabilities || "").split(",");
  return capabilities.includes(capability);
}

/**
 * Toggles a single capability on a given feature service.
 * Returns a service definition object with updated capabilities
 * @param capability capability to toggle
 * @param serviceDefinition current definition of the service
 *
 * @returns updated definition
 */
export function toggleServiceCapability(
  capability: ServiceCapabilities,
  serviceDefinition: Partial<IFeatureServiceDefinition>
): Partial<IFeatureServiceDefinition> {
  const updatedDefinition = hasServiceCapability(capability, serviceDefinition)
    ? removeServiceCapability(capability, serviceDefinition)
    : addServiceCapability(capability, serviceDefinition);

  return updatedDefinition;
}

/**
 * @private
 * adds a capability onto a service definition
 * @param capability capability to add
 * @param serviceDefinition the definition to modify
 * @returns a copy of the modified definition
 */
function addServiceCapability(
  capability: ServiceCapabilities,
  serviceDefinition: Partial<IFeatureServiceDefinition>
): Partial<IFeatureServiceDefinition> {
  const capabilities = (serviceDefinition.capabilities || "")
    .split(",")
    .filter((c) => !!c)
    .concat(capability)
    .join(",");
  const updated = { ...serviceDefinition, capabilities };
  return updated;
}

/**
 * @private
 * removes a capability from a service definition
 * @param capability capability to remove
 * @param serviceDefinition the definition to modify
 * @returns a copy of the modified definition
 */
function removeServiceCapability(
  capability: ServiceCapabilities,
  serviceDefinition: Partial<IFeatureServiceDefinition>
): Partial<IFeatureServiceDefinition> {
  const capabilities = serviceDefinition.capabilities
    .split(",")
    .filter((c) => c !== capability)
    .join(",");
  const updated = { ...serviceDefinition, capabilities };
  return updated;
}
