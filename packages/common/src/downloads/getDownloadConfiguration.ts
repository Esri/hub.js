import { IHubAdditionalResource } from "../core/types/IHubAdditionalResource";
import {
  IDownloadFormatConfiguration,
  IEntityDownloadConfiguration,
  IHubEditableContent,
} from "../core/types/IHubEditableContent";
import { getProp } from "../objects/get-prop";
import { getDownloadFlow } from "./_internal/getDownloadFlow";
import { getDownloadFormatsByFlow } from "./_internal/getDownloadFormatsByFlow";

/**
 * Returns the download configuration for an entity at this moment in time.
 *
 * If no configuration exists, a default configuration is returned based on the entity's current download flow.
 * If a configuration exists but is no longer valid, the default configuration will also be returned.
 *
 * @param entity entity to get download configuration for
 * @returns the current download configuration for the entity
 */
export function getDownloadConfiguration(
  entity: IHubEditableContent
): IEntityDownloadConfiguration {
  // TODO: account for enterprise environments
  const downloadFlow = getDownloadFlow(entity);
  const serverFormats = getDownloadFormatsByFlow(downloadFlow, entity);
  const additionalResources: IHubAdditionalResource[] =
    getProp(entity, "extendedProps.additionalResources") || [];
  const existingConfiguration: IEntityDownloadConfiguration = getProp(
    entity,
    "extendedProps.downloads"
  );

  // Base combined default formats
  const combinedDefaultFormats: IDownloadFormatConfiguration[] =
    serverFormats.map((f): IDownloadFormatConfiguration => {
      return {
        key: f.format,
        hidden: false,
      };
    });
  additionalResources.forEach((f, idx) => {
    combinedDefaultFormats.push({
      key: `additionalResource::${idx}`,
      hidden: false,
    });
  });

  const shouldUseExistingConfiguration =
    existingConfiguration && existingConfiguration.flowType === downloadFlow;

  // Existing configuration matches the current flow
  if (shouldUseExistingConfiguration) {
    const missingDefaultFormats = combinedDefaultFormats.filter((f) => {
      return !existingConfiguration.formats.find((df) => df.key === f.key);
    });
    const validConfiguredFormats = existingConfiguration.formats.filter((f) => {
      return combinedDefaultFormats.find((df) => df.key === f.key);
    });
    return {
      flowType: downloadFlow,
      formats: [...validConfiguredFormats, ...missingDefaultFormats],
    };
  }

  // Existing configuration does not match the current flow
  return {
    flowType: downloadFlow,
    formats: combinedDefaultFormats,
  };
}
