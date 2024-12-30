import { DownloadFlowType, IHubEditableContent } from "../core";
import HubError from "../HubError";
import { getDownloadFlow } from "./_internal/getDownloadFlow";
import {
  getAvailableDownloadFlows,
  IDownloadFlowFlags,
} from "./getAvailableDownloadFlows";
import { getDownloadFormats } from "./getDownloadFormats";
import {
  IDynamicDownloadFormat,
  IFetchDownloadFileOptions,
  IFetchDownloadFileResponse,
  ServiceDownloadFormat,
} from "./types";

/**
 * Fetches a download file URL for the given entity and format.
 * @param options options to refine / filter the results of the fetchDownloadFile operation
 * @returns a promise that resolves with a download file url or blob
 * @throws {ArcgisHubDownloadError} if the download file URL cannot be fetched for a well-known reason
 */
export async function fetchDownloadFile(
  options: IFetchDownloadFileOptions
): Promise<IFetchDownloadFileResponse> {
  const { entity, context } = options;
  const availableDownloadFlows = getAvailableDownloadFlows(context);
  const downloadFlow = getDownloadFlow(entity, availableDownloadFlows);

  // Throw an error if the entity cannot be downloaded (i.e., no download flow)
  if (!downloadFlow) {
    throw new HubError(
      "fetchDownloadFile",
      "Downloads are not available for this item"
    );
  }

  // Throw an error if the download flow is not enabled in the current environment
  if (!availableDownloadFlows[downloadFlow]) {
    throw new HubError(
      "fetchDownloadFile",
      "Downloads are not available for this item in this environment"
    );
  }

  // Throw an error if the format requested is not enabled for the entity
  const { format } = options;
  validateFormat(entity, format, availableDownloadFlows);

  // If the pollInterval is not set, default to 3 seconds
  const withPollInterval =
    options.pollInterval == null ? { ...options, pollInterval: 3000 } : options;

  let fetchingFn: (
    options: IFetchDownloadFileOptions
  ) => Promise<IFetchDownloadFileResponse>;

  // Note: We use a record rather than a switch statement so typescript can verify that all flows are handled
  const actionsByFlow: Record<DownloadFlowType, () => Promise<void>> = {
    hubCreateReplica: async () => {
      fetchingFn = (
        await import("./_internal/file-url-fetchers/fetchHubApiDownloadFile")
      ).fetchHubApiDownloadFile;
    },
    paging: async () => {
      fetchingFn = (
        await import("./_internal/file-url-fetchers/fetchHubApiDownloadFile")
      ).fetchHubApiDownloadFile;
    },
    fgdb: async () => {
      fetchingFn = (
        await import("./_internal/file-url-fetchers/fetchHubApiDownloadFile")
      ).fetchHubApiDownloadFile;
    },
    portalCreateReplica: async () => {
      fetchingFn = (
        await import(
          "./_internal/file-url-fetchers/fetchCreateReplicaDownloadFile"
        )
      ).fetchCreateReplicaDownloadFile;
    },
    exportImage: async () => {
      fetchingFn = (
        await import(
          "./_internal/file-url-fetchers/fetchExportImageDownloadFile"
        )
      ).fetchExportImageDownloadFile;
    },
  };

  await actionsByFlow[downloadFlow]();
  return fetchingFn(withPollInterval);
}

/**
 * Validates the format requested is enabled for the entity
 * @param options options for the fetchDownloadFile operation
 * @throws {HubError} if the format requested is not enabled for the entity
 */
function validateFormat(
  entity: IHubEditableContent,
  format: ServiceDownloadFormat,
  availableDownloadFlows: IDownloadFlowFlags
) {
  const validServerFormats: ServiceDownloadFormat[] = getDownloadFormats({
    entity,
    availableDownloadFlows,
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
