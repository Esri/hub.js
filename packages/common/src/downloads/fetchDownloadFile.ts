import HubError from "../HubError";
import { canUseExportImageFlow } from "./_internal/canUseExportImageFlow";
import { canUseHubDownloadApi } from "./canUseHubDownloadApi";
import { IFetchDownloadFileOptions, IFetchDownloadFileResponse } from "./types";

/**
 * Fetches a download file URL for the given entity and format.
 * @param options options to refine / filter the results of the fetchDownloadFile operation
 * @returns a promise that resolves with a download file url or blob
 * @throws {ArcgisHubDownloadError} if the download file URL cannot be fetched for a well-known reason
 */
export async function fetchDownloadFile(
  options: IFetchDownloadFileOptions
): Promise<IFetchDownloadFileResponse> {
  // If the pollInterval is not set, default to 3 seconds
  const withPollInterval =
    options.pollInterval == null ? { ...options, pollInterval: 3000 } : options;

  let fetchingFn;
  if (canUseHubDownloadApi(withPollInterval.entity, withPollInterval.context)) {
    fetchingFn = (
      await import("./_internal/file-url-fetchers/fetchHubApiDownloadFile")
    ).fetchHubApiDownloadFile;
  } else if (canUseExportImageFlow(withPollInterval.entity)) {
    fetchingFn = (
      await import("./_internal/file-url-fetchers/fetchExportImageDownloadFile")
    ).fetchExportImageDownloadFile;
  } else {
    throw new HubError(
      "fetchDownloadFile",
      "Downloads are not supported for this item in this environment"
    );
  }
  return fetchingFn(withPollInterval);
}
