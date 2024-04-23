import { IHubAdditionalResource } from "../core/types/IHubAdditionalResource";
import { canUseExportImageFlow } from "./helpers/canUseExportImageFlow";
import { canUseExportItemFlow } from "./helpers/canUseExportItemFlow";
import { canUseHubDownloadApi } from "./helpers/canUseHubDownloadApi";
import { fetchExportItemFormats } from "./helpers/format-fetchers/fetchExportItemFormats";
import { getExportImageDownloadFormats } from "./helpers/format-fetchers/getExportImageFormats";
import { getHubDownloadApiFormats } from "./helpers/format-fetchers/getHubDownloadApiFormats";
import {
  IDownloadFormat,
  IFetchDownloadFormatsOptions,
  IStaticDownloadFormat,
} from "./helpers/types";

export async function fetchDownloadFormats(
  options: IFetchDownloadFormatsOptions
): Promise<IDownloadFormat[]> {
  const { entity, context, layers } = options;
  // fetch base formats for the item
  let baseFormats: IDownloadFormat[] = [];
  if (canUseHubDownloadApi(entity, context)) {
    baseFormats = getHubDownloadApiFormats(entity);
  } else if (canUseExportItemFlow(entity)) {
    baseFormats = await fetchExportItemFormats(entity, context, layers);
  } else if (canUseExportImageFlow(entity)) {
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
