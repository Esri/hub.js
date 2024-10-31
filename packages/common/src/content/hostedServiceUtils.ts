import { IFeatureServiceDefinition } from "@esri/arcgis-rest-feature-layer";
import { IItem } from "@esri/arcgis-rest-portal";
import { IHubEditableContent } from "../core/types/IHubEditableContent";

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
  return (
    !!url &&
    url.includes("arcgis.com") &&
    FEATURE_SERVICE_URL_REGEX.test(url) &&
    !isSecureProxyServiceUrl(url)
  );
}

/**
 * Portal secure proxy services are identified by looking for these patterns in the `url`:
 * - /sharing/servers/
 * - /sharing/appservices/
 * - /usrsvcs/servers/
 * - /usrsvcs/appservices/
 *
 * This function was given to us by the JSAPI team, so we trust the regex's are correct,
 * and won't be adding additional tests for it.
 * @param url
 */
export function isSecureProxyServiceUrl(url: string): boolean {
  return /\/(sharing|usrsvcs)\/(appservices|servers)\//i.test(url);
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
