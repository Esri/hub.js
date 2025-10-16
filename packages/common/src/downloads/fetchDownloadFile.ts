import HubError from "../HubError";
import { canUseExportImageFlow } from "./_internal/canUseExportImageFlow";
import { canUseHubDownloadApi } from "./canUseHubDownloadApi";
import { ServiceDownloadFormat } from "./enums/serviceDownloadFormat";
import { getDownloadFormats } from "./getDownloadFormats";
import {
  IDynamicDownloadFormat,
  IFetchDownloadFileOptions,
  IFetchDownloadFileResponse,
} from "./types";
import { fetchHubApiDownloadFile } from "./_internal/file-url-fetchers/fetchHubApiDownloadFile";
import { fetchExportImageDownloadFile } from "./_internal/file-url-fetchers/fetchExportImageDownloadFile";

/**
 * Fetches a download file URL for the given entity and format.
 * @param options options to refine / filter the results of the fetchDownloadFile operation
 * @returns a promise that resolves with a download file url or blob
 * @throws {ArcgisHubDownloadError} if the download file URL cannot be fetched for a well-known reason
 */
export async function fetchDownloadFile(
  options: IFetchDownloadFileOptions
): Promise<IFetchDownloadFileResponse> {
  // Make sure that format requested has been enabled for the entity
  validateFormat(options);

  // If the pollInterval is not set, default to 3 seconds
  const withPollInterval =
    options.pollInterval == null ? { ...options, pollInterval: 3000 } : options;

  let fetchingFn;
  if (canUseHubDownloadApi(withPollInterval.entity, withPollInterval.context)) {
    fetchingFn = fetchHubApiDownloadFile;
  } else if (canUseExportImageFlow(withPollInterval.entity)) {
    fetchingFn = fetchExportImageDownloadFile;
  } else {
    throw new HubError(
      "fetchDownloadFile",
      "Downloads are not supported for this item in this environment"
    );
  }
  return fetchingFn(withPollInterval);
}

/**
 * Validates the format requested is enabled for the entity
 * @param options options for the fetchDownloadFile operation
 * @throws {HubError} if the format requested is not enabled for the entity
 */
function validateFormat(options: IFetchDownloadFileOptions): void {
  const { entity, context, format } = options;
  const validServerFormats: ServiceDownloadFormat[] = getDownloadFormats({
    entity,
    context,
  })
    .filter((f) => f.type === "dynamic")
    .map((f) => (f as IDynamicDownloadFormat).format);
  if (!validServerFormats.includes(format)) {
    throw new HubError(
      "fetchDownloadFile",
      `The following format is not enabled for the entity: ${format}`
    );
  }
}
