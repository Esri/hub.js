import HubError from "../HubError";
import { canUseExportImageFlow } from "./_internal/canUseExportImageFlow";
import { canUseExportItemFlow } from "./_internal/canUseExportItemFlow";
import { canUseHubDownloadApi } from "./_internal/canUseHubDownloadApi";
import { fetchExportImageDownloadFileUrl } from "./_internal/file-url-fetchers/fetchExportImageDownloadFileUrl";
import { fetchExportItemDownloadFileUrl } from "./_internal/file-url-fetchers/fetchExportItemDownloadFileUrl";
import { fetchHubApiDownloadFileUrl } from "./_internal/file-url-fetchers/fetchHubApiDownloadFileUrl";
import { IFetchDownloadFileUrlOptions } from "./types";

/**
 * Fetches a download file URL for the given entity and format.
 * @param options options to refine / filter the results of the fetchDownloadFileUrl operation
 * @returns a promise that resolves with the download file URL
 */
export async function fetchDownloadFileUrl(
  options: IFetchDownloadFileUrlOptions
): Promise<string> {
  let fetchingFn;
  if (canUseHubDownloadApi(options.entity, options.context)) {
    fetchingFn = fetchHubApiDownloadFileUrl;
  } else if (canUseExportItemFlow(options.entity)) {
    fetchingFn = fetchExportItemDownloadFileUrl;
  } else if (canUseExportImageFlow(options.entity)) {
    fetchingFn = fetchExportImageDownloadFileUrl;
  } else {
    throw new HubError(
      "fetchDownloadFileUrl",
      "Downloads are not supported for this item in this environment"
    );
  }
  return fetchingFn(options);
}
