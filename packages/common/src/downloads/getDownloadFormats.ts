import { IHubAdditionalResource } from "../core/types/IHubAdditionalResource";
import { getProp } from "../objects/get-prop";
import { canUseExportImageFlow } from "./_internal/canUseExportImageFlow";
import { getExportImageFormats } from "./_internal/format-fetchers/getExportImageFormats";
import {
  getAdditionalResourceIndex,
  isAdditionalResourceConfiguration,
} from "./_internal/additional-resources/utils";
import { canUseHubDownloadApi } from "./canUseHubDownloadApi";
import { getDownloadConfiguration } from "./getDownloadConfiguration";
import { getHubDownloadApiFormats } from "./getHubDownloadApiFormats";
import {
  IDownloadFormat,
  IDynamicDownloadFormat,
  IFetchDownloadFormatsOptions,
  IStaticDownloadFormat,
} from "./types";

/**
 * Gets available download formats / additional resources for the given entity in the order they have been configured.
 * If a format has been configured to be hidden, it will not be included in the results.
 *
 * @param options options to refine / filter the results of the fetchDownloadFormats operation
 * @returns The available download formats and additional resources
 */
export function getDownloadFormats(
  options: IFetchDownloadFormatsOptions
): IDownloadFormat[] {
  const { entity, context } = options;
  // get the base formats for the item
  let baseFormats: IDynamicDownloadFormat[] = [];
  // TODO: use typescript to enforce a branch for each flow type
  if (canUseHubDownloadApi(entity, context)) {
    baseFormats = getHubDownloadApiFormats(entity);
  } else if (canUseExportImageFlow(entity)) {
    baseFormats = getExportImageFormats(entity);
  }

  // add additional resource links as static formats
  const additionalResources =
    getProp(entity, "extendedProps.additionalResources") || [];
  const additionalFormats = additionalResources.map(toStaticFormat);

  // Respect the order and visibility of the formats as configured for the entity
  const downloadConfiguration = getDownloadConfiguration(entity);
  return downloadConfiguration.formats.reduce((acc, format) => {
    if (!format.hidden) {
      let includedFormat;
      if (isAdditionalResourceConfiguration(format)) {
        const additionalResourceIndex = getAdditionalResourceIndex(format);
        includedFormat = additionalFormats[additionalResourceIndex];
      } else {
        baseFormats.forEach((baseFormat) => {
          if (baseFormat.format === format.key) {
            includedFormat = baseFormat;
          }
        });
      }
      acc.push(includedFormat);
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
