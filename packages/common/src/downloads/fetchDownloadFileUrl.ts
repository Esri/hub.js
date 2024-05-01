import HubError from "../HubError";
import { cloneObject } from "../util";
import { canUseExportImageFlow } from "./_internal/canUseExportImageFlow";
import { canUseExportItemFlow } from "./_internal/canUseExportItemFlow";
import { canUseHubDownloadApi } from "./canUseHubDownloadApi";
import { IFetchDownloadFileUrlOptions } from "./types";

/**
 * Fetches a download file URL for the given entity and format.
 * @param options options to refine / filter the results of the fetchDownloadFileUrl operation
 * @returns a promise that resolves with the download file URL
 * @throws {ArcgisHubDownloadError} if the download file URL cannot be fetched for a well-known reason
 */
export async function fetchDownloadFileUrl(
  options: IFetchDownloadFileUrlOptions
): Promise<string> {
  // If the pollInterval is not set, default to 3 seconds
  const withPollInterval =
    options.pollInterval == null ? { ...options, pollInterval: 3000 } : options;

  let fetchingFn;
  if (canUseHubDownloadApi(withPollInterval.entity, withPollInterval.context)) {
    fetchingFn = (
      await import("./_internal/file-url-fetchers/fetchHubApiDownloadFileUrl")
    ).fetchHubApiDownloadFileUrl;
  } else if (canUseExportItemFlow(withPollInterval.entity)) {
    fetchingFn = (
      await import(
        "./_internal/file-url-fetchers/fetchExportItemDownloadFileUrl"
      )
    ).fetchExportItemDownloadFileUrl;
  } else if (canUseExportImageFlow(withPollInterval.entity)) {
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
  return fetchingFn(withPollInterval);
}
