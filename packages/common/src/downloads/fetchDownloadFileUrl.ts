import HubError from "../HubError";
import { canUseExportImage } from "./helpers/canUseExportImage";
import { canUseExportItem } from "./helpers/canUseExportItem";
import { canUseHubDownloadApi } from "./helpers/canUseHubDownloadApi";
import { fetchExportImageDownloadFileUrl } from "./helpers/file-url-fetchers/fetchExportImageDownloadFileUrl";
import { fetchExportItemDownloadFileUrl } from "./helpers/file-url-fetchers/fetchExportItemDownloadFileUrl";
import { fetchHubApiDownloadFileUrl } from "./helpers/file-url-fetchers/fetchHubApiDownloadFileUrl";
import { IFetchDownloadFileUrlOptions } from "./helpers/types";

export async function fetchDownloadFileUrl(
  options: IFetchDownloadFileUrlOptions
): Promise<string> {
  let fetchingFn;
  if (canUseHubDownloadApi(options.entity, options.context)) {
    fetchingFn = fetchHubApiDownloadFileUrl;
  } else if (canUseExportItem(options.entity)) {
    fetchingFn = fetchExportItemDownloadFileUrl;
  } else if (canUseExportImage(options.entity)) {
    fetchingFn = fetchExportImageDownloadFileUrl;
  } else {
    throw new HubError(
      "fetchDownloadFileUrl",
      " Downloads are not supported for this item in this environment"
    );
  }
  return fetchingFn(options);
}
