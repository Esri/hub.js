import { IFeatureServiceDefinition } from "@esri/arcgis-rest-feature-layer";
import { IItem } from "@esri/arcgis-rest-portal";
import { IHubEditableContent } from "../core/types/IHubEditableContent";

/**
 * Determines whether an item represents a hosted feature service
 * @param item item to check
 * @returns whether the item represents a hosted feature service
 */
export function isHostedFeatureServiceItem(item: IItem): boolean {
  return isHostedFeatureService(item.type, item.typeKeywords);
}

/**
 * Determines whether an entity represents a hosted feature service
 * @param item item to check
 * @returns whether the item represents a hosted feature service
 */
export function isHostedFeatureServiceEntity(
  content: IHubEditableContent
): boolean {
  return isHostedFeatureService(content.type, content.typeKeywords);
}

/**
 * @private
 * base helper to determine whether the arguments correspond to a hosted feature service
 * @param type an item type
 * @param typeKeywords an item typeKeywords array
 * @returns whether the arguments correspond to a hosted feature service
 */
function isHostedFeatureService(
  type: string,
  typeKeywords: string[] = []
): boolean {
  // This logic was given to us by the ArcGIS Online home app team. Apparently this is
  // part of the check they internally do when deciding whether to show the "Export Data"
  // button on the item settings page. See the "Tech" section of this issue for more details:
  // https://devtopia.esri.com/dc/hub/issues/7210
  return type === "Feature Service" && typeKeywords.includes("Hosted Service");
}

export enum ServiceCapabilities {
  EXTRACT = "Extract",
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
