import { IHubAdditionalResource } from "../core/types/IHubAdditionalResource";
import { canUseExportImageFlow } from "./_internal/canUseExportImageFlow";
import { canUseHubDownloadApi } from "./canUseHubDownloadApi";
import {
  IDownloadFormat,
  IFetchDownloadFormatsOptions,
  IStaticDownloadFormat,
} from "./types";

/**
 * DEPRECATED: This will be removed in the next breaking version. Use "getDownloadFormats()" instead.
 *
 * Fetches download formats for the given entity. Also folds in any additional resources defined on the entity.
 * @param options options to refine / filter the results of the fetchDownloadFormats operation
 * @returns a promise that resolves with the download formats
 */
export async function fetchDownloadFormats(
  options: IFetchDownloadFormatsOptions
): Promise<IDownloadFormat[]> {
  /* tslint:disable no-console */
  console.warn(
    `"fetchDownloadFormats()" is deprecated. Please use "getDownloadFormats()"`
  );

  const { entity, context, layers } = options;
  // fetch base formats for the item
  let baseFormats: IDownloadFormat[] = [];
  if (canUseHubDownloadApi(entity, context)) {
    const { getHubDownloadApiFormats } = await import(
      "./getHubDownloadApiFormats"
    );
    baseFormats = getHubDownloadApiFormats(entity);
  } else if (canUseExportImageFlow(entity)) {
    const { getExportImageFormats } = await import(
      "./_internal/format-fetchers/getExportImageFormats"
    );
    baseFormats = getExportImageFormats(entity);
  }

  // add additional resource links as static formats
  // TODO: change to use `extendedProps.additionalResources`
  const additionalFormats = (entity.additionalResources || []).map(
    toStaticFormat
  );

  // combine formats into single list
  return [...baseFormats, ...additionalFormats];
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
