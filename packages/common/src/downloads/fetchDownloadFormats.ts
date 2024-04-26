import { IHubAdditionalResource } from "../core/types/IHubAdditionalResource";
import { canUseExportImageFlow } from "./_internal/canUseExportImageFlow";
import { canUseExportItemFlow } from "./_internal/canUseExportItemFlow";
import { canUseHubDownloadApi } from "./canUseHubDownloadApi";
import {
  IDownloadFormat,
  IFetchDownloadFormatsOptions,
  IStaticDownloadFormat,
} from "./types";

/**
 * Fetches download formats for the given entity. Also folds in any additional resources defined on the entity.
 * @param options options to refine / filter the results of the fetchDownloadFormats operation
 * @returns a promise that resolves with the download formats
 */
export async function fetchDownloadFormats(
  options: IFetchDownloadFormatsOptions
): Promise<IDownloadFormat[]> {
  const { entity, context, layers } = options;
  // fetch base formats for the item
  let baseFormats: IDownloadFormat[] = [];
  if (canUseHubDownloadApi(entity, context)) {
    const { getHubDownloadApiFormats } = await import(
      "./_internal/format-fetchers/getHubDownloadApiFormats"
    );
    baseFormats = getHubDownloadApiFormats(entity);
  } else if (canUseExportItemFlow(entity)) {
    const { fetchExportItemFormats } = await import(
      "./_internal/format-fetchers/fetchExportItemFormats"
    );
    baseFormats = await fetchExportItemFormats(entity, context, layers);
  } else if (canUseExportImageFlow(entity)) {
    const { getExportImageDownloadFormats } = await import(
      "./_internal/format-fetchers/getExportImageFormats"
    );
    baseFormats = getExportImageDownloadFormats();
  }

  // add additional resource links as static formats
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
    label: resource.name,
    url: resource.url,
  };
}
