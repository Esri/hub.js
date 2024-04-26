import HubError from "../HubError";
import { canUseExportImageFlow } from "./_internal/canUseExportImageFlow";
import { canUseExportItemFlow } from "./_internal/canUseExportItemFlow";
import { canUseHubDownloadApi } from "./canUseHubDownloadApi";
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
    fetchingFn = (
      await import("./_internal/file-url-fetchers/fetchHubApiDownloadFileUrl")
    ).fetchHubApiDownloadFileUrl;
  } else if (canUseExportItemFlow(options.entity)) {
    fetchingFn = (
      await import(
        "./_internal/file-url-fetchers/fetchExportItemDownloadFileUrl"
      )
    ).fetchExportItemDownloadFileUrl;
  } else if (canUseExportImageFlow(options.entity)) {
    fetchingFn = (
      await import(
        "./_internal/file-url-fetchers/fetchExportImageDownloadFileUrl"
      )
    ).fetchExportImageDownloadFileUrl;
  } else {
    throw new HubError(
      "fetchDownloadFileUrl",
      "Downloads are not supported for this item in this environment"
    );
  }
  return fetchingFn(options);
}
