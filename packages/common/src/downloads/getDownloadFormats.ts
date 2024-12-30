import { IHubAdditionalResource } from "../core/types/IHubAdditionalResource";
import { getProp } from "../objects/get-prop";
import {
  getAdditionalResourceIndex,
  isAdditionalResourceConfiguration,
} from "./_internal/additional-resources/utils";
import { getDownloadConfiguration } from "./getDownloadConfiguration";
import {
  IDownloadFormat,
  IDynamicDownloadFormat,
  IGetDownloadFormatsOptions,
  IStaticDownloadFormat,
} from "./types";

/**
 * Gets available download formats / additional resources for the given entity in the order they have been configured.
 * If a format has been configured to be hidden, it will not be included in the results.
 *
 * @param options options to refine / filter the results of the getDownloadFormats operation
 * @returns The available download formats and additional resources
 */
export function getDownloadFormats(
  options: IGetDownloadFormatsOptions
): IDownloadFormat[] {
  const { entity, availableDownloadFlows } = options;

  const additionalResources =
    getProp(entity, "extendedProps.additionalResources") || [];

  // Respect the order and visibility of the formats as configured for the entity
  const downloadConfiguration = getDownloadConfiguration(
    entity,
    availableDownloadFlows
  );
  return downloadConfiguration.formats.reduce((acc, format) => {
    if (!format.hidden) {
      if (isAdditionalResourceConfiguration(format)) {
        const index = getAdditionalResourceIndex(format);
        const additionalResource = additionalResources[index];
        additionalResource && acc.push(toStaticFormat(additionalResource));
      } else {
        acc.push({
          type: "dynamic",
          format: format.key,
        } as IDynamicDownloadFormat);
      }
    }
    return acc;
  }, []);
}

function toStaticFormat(
  resource: IHubAdditionalResource
): IStaticDownloadFormat {
  return {
    type: "static",
    label:
      resource.name ||
      (resource.isDataSource && `{{dataSource:translate}}`) || // if the additional resource is the datasource
      `{{noTitle:translate}}`, // if the additional resource has no name
    url: resource.url,
  };
}
