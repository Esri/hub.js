import { IFeatureServiceDefinition } from "@esri/arcgis-rest-feature-layer";
import { IItem } from "@esri/arcgis-rest-portal";
import { IHubEditableContent } from "../../core/types/IHubEditableContent";

export function isHostedFeatureServiceItem(item: IItem): boolean {
  return isHostedFeatureService(item.type, item.typeKeywords);
}

export function isHostedFeatureServiceEntity(
  content: IHubEditableContent
): boolean {
  return isHostedFeatureService(content.type, content.typeKeywords);
}

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
 * @param serviceUrl url of service to modify
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

function addServiceCapability(
  capability: ServiceCapabilities,
  serviceDefinition: Partial<IFeatureServiceDefinition>
): Partial<IFeatureServiceDefinition> {
  const capabilities = (serviceDefinition.capabilities || "")
    .split(",")
    .concat(capability)
    .join(",");
  const updated = { ...serviceDefinition, capabilities };
  return updated;
}

export function removeServiceCapability(
  capability: ServiceCapabilities,
  serviceDefinition: Partial<IFeatureServiceDefinition>
): Partial<IFeatureServiceDefinition> {
  const capabilities = (serviceDefinition.capabilities || "")
    .split(",")
    .filter((c) => c !== capability)
    .join(",");
  const updated = { ...serviceDefinition, capabilities };
  return updated;
}
