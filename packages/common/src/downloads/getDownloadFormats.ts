import { IHubAdditionalResource } from "../core/types/IHubAdditionalResource";
import { canUseExportImageFlow } from "./_internal/canUseExportImageFlow";
import { getExportImageFormats } from "./_internal/format-fetchers/getExportImageFormats";
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
 * Fetches download formats for the given entity. Also folds in any additional resources defined on the entity.
 * @param options options to refine / filter the results of the fetchDownloadFormats operation
 * @returns a promise that resolves with the download formats
 */
export function getDownloadFormats(
  options: IFetchDownloadFormatsOptions
): IDownloadFormat[] {
  const { entity, context, layers } = options;
  // fetch base formats for the item
  let baseFormats: IDynamicDownloadFormat[] = [];
  if (canUseHubDownloadApi(entity, context)) {
    baseFormats = getHubDownloadApiFormats(entity);
  } else if (canUseExportImageFlow(entity)) {
    baseFormats = getExportImageFormats(entity);
  }

  // add additional resource links as static formats
  // TODO: change to use `extendedProps.additionalResources`
  const additionalFormats = (entity.additionalResources || []).map(
    toStaticFormat
  );

  // combine formats into single list
  const downloadConfiguration = getDownloadConfiguration(entity);
  return downloadConfiguration.formats.reduce((acc, format) => {
    if (!format.hidden) {
      let includedFormat;
      const isAdditionalResource = format.key.startsWith(
        "additionalResource::"
      );
      if (isAdditionalResource) {
        const additionalResourceIndex = parseInt(format.key.split("::")[1], 10);
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
