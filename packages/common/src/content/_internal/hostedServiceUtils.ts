import { IFeatureServiceDefinition } from "@esri/arcgis-rest-feature-layer";
import { IItem } from "@esri/arcgis-rest-portal";
import { IHubEditableContent } from "../../core/types/IHubEditableContent";

export function isHostedFeatureService(
  content: IHubEditableContent | IItem
): boolean {
  return (
    content.type === "Feature Service" &&
    content.typeKeywords.includes("Hosted Service")
  );
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
export function hasCapability(
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
export function toggleCapability(
  capability: ServiceCapabilities,
  serviceDefinition: Partial<IFeatureServiceDefinition>
): Partial<IFeatureServiceDefinition> {
  const updatedDefinition = hasCapability(capability, serviceDefinition)
    ? removeCapability(capability, serviceDefinition)
    : addCapability(capability, serviceDefinition);

  return updatedDefinition;
}

function addCapability(
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

export function removeCapability(
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
