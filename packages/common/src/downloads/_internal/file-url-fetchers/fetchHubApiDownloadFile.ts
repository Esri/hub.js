import HubError from "../../../HubError";
import { getProp } from "../../../objects/get-prop";
import { wait } from "../../../utils/wait";
import {
  ArcgisHubDownloadError,
  DownloadCacheStatus,
  DownloadOperationStatus,
  IFetchDownloadFileOptions,
  IFetchDownloadFileResponse,
  ServiceDownloadFormat,
  downloadProgressCallback,
} from "../../types";

/**
 * @private
 * Fetches a download file url from the Hub Download API. If we know the file will be served from
 * a cache, we also return the status of the cache.
 *
 * NOTE: The Hub Download API only works with a certain subset of Feature and Map services
 * and performs different operations (i.e., calling createReplica or paging the service's
 * features) depending on the service type and capabilities.
 *
 * This function does it's best to abstract those differences and provide a consistent
 * interface for downloading data from any service supported by the Hub Download API.
 *
 * @param options options for refining / filtering the resulting download file
 * @returns the url to download the file and cache status
 */
export async function fetchHubApiDownloadFile(
  options: IFetchDownloadFileOptions
): Promise<IFetchDownloadFileResponse> {
  validateOptions(options);
  const requestUrl = getDownloadApiRequestUrl(options);

  const { pollInterval, updateCache, progressCallback } = options;

  let cacheQueryParam: CacheQueryParam;
  if (updateCache) {
    // The download api has 2 query params that can be used for controlling cache behavior.
    // This one should only be used as part of an initial request to update the cache
    cacheQueryParam = "updateCache";
  }

  return pollDownloadApi(
    requestUrl,
    pollInterval,
    cacheQueryParam,
    progressCallback
  );
}

function validateOptions(options: IFetchDownloadFileOptions) {
  const { layers = [] } = options;

  // The Hub Download API currently requires a target layer to be specified
  if (layers.length === 0) {
    throw new HubError(
      "fetchHubApiDownloadFileUrl",
      "No layers provided for download"
    );
  }

  // The Hub Download API currently only supports downloading one
  // layer at a time, though it could allow multiple in the future
  if (layers.length > 1) {
    throw new HubError(
      "fetchHubApiDownloadFileUrl",
      "Multiple layer downloads are not yet supported"
    );
  }
}

/**
 * @private
 * Generates a URL to the Hub Download API that can be polled until the download is ready
 *
 * @param options options for refining / filtering the resulting download file
 * @returns a download api url that can be polled
 */
function getDownloadApiRequestUrl(options: IFetchDownloadFileOptions) {
  const { entity, format, context, layers, geometry, where, updateCache } =
    options;

  const searchParams = new URLSearchParams({
    redirect: "false", // Needed to get the download URL instead of the file itself
    layers: layers[0].toString(),
  });

  if (geometry) {
    const geometryJSON = geometry.toJSON();
    // Not sure why type isn't included in the toJSON() output, but our API expects it
    geometryJSON.type = geometry.type;
    searchParams.append("geometry", JSON.stringify(geometryJSON));
  }

  // GeoJSON and KML are only supported in WGS84, so we need to specify the spatial reference here
  if (
    [ServiceDownloadFormat.GEOJSON, ServiceDownloadFormat.KML].includes(format)
  ) {
    searchParams.append("spatialRefId", "4326");
  }

  where && searchParams.append("where", where);

  const token = getProp(context, "hubRequestOptions.authentication.token");
  token && searchParams.append("token", token);

  return `${context.hubUrl}/api/download/v1/items/${
    entity.id
  }/${format}?${searchParams.toString()}`;
}

/**
 * @private
 * Polls the Hub Download API until the download is ready, then returns the download file URL
 *
 * @param requestUrl Hub Download Api URL to poll
 * @param pollInterval interval in milliseconds to poll for job completion
 * @param cacheQueryParam an optional query param to control cache behavior. 'updateCache' should
 * only be used with the initial request when a download cache update is desired. All subsequent
 * requests should use'trackCacheUpdate' to follow the progress of the cache update.
 * for subsequent requests when polling the progress of a cache update.
 * @param progressCallback an optional callback to report download generation progress
 * @returns the final file URL
 */
async function pollDownloadApi(
  requestUrl: string,
  pollInterval: number,
  cacheQueryParam?: CacheQueryParam,
  progressCallback?: downloadProgressCallback
): Promise<IFetchDownloadFileResponse> {
  // If requested, append the cache query param to the request URL
  let withCacheQueryParam = requestUrl;
  if (cacheQueryParam) {
    withCacheQueryParam = `${requestUrl}&${cacheQueryParam}=true`;
  }

  const response = await fetch(withCacheQueryParam);

  if (!response.ok) {
    const errorBody = await response.json();
    // TODO: Add standarized messageId when available
    throw new ArcgisHubDownloadError({
      rawMessage: errorBody.message,
    });
  }

  const {
    status,
    progressInPercent,
    resultUrl,
    cacheStatus,
  }: IHubDownloadApiResponse = await response.json();

  const operationStatus = toDownloadOperationStatus(status);
  if (operationStatus === DownloadOperationStatus.FAILED) {
    throw new HubError(
      "fetchHubApiDownloadFileUrl",
      "Download operation failed with a 200"
    );
  }

  if (resultUrl) {
    // Operation complete, return the download URL and cache status
    return {
      type: "url",
      href: resultUrl,
      cacheStatus,
    };
  }

  // Operation still in progress. Report progress if a callback was provided and poll again.
  progressCallback && progressCallback(operationStatus, progressInPercent);
  await wait(pollInterval);

  // always have `trackCacheUpdate` present when polling Hub download API
  // because polling is always done to update cache or create a new cache
  // if not already present
  const updatedCacheQueryParam: CacheQueryParam = "trackCacheUpdate";

  return pollDownloadApi(
    requestUrl,
    pollInterval,
    updatedCacheQueryParam,
    progressCallback
  );
}

/**
 * @private
 * Returns a standardized status string based on what is returned by the Hub Download API.
 * This is necessary because the Hub Download API returns a variety of statuses that are too
 * technical in nature that need to be translated into a more user-friendly status.
 *
 * @param status status returned by the Hub Download API
 * @returns a standardized download operation status
 */
function toDownloadOperationStatus(
  status: HubDownloadApiStatus
): DownloadOperationStatus {
  // Statuses that come back if the Download API uses createReplica under the hood
  const createReplicaStatusMap: Record<
    CreateReplicaStatus,
    DownloadOperationStatus
  > = {
    // Statuses that we expect to see (listed in the order they could occur)
    Pending: DownloadOperationStatus.PENDING, // Job hasn't started yet
    InProgress: DownloadOperationStatus.PROCESSING, // Job is in progress
    ExportingData: DownloadOperationStatus.PROCESSING, // Features are being exported, progress available
    ExportAttachments: DownloadOperationStatus.PROCESSING, // Reported by Khaled Hassen, unsure when this actually happens
    Completed: DownloadOperationStatus.COMPLETED,
    CompletedWithErrors: DownloadOperationStatus.FAILED, // Reported by Khaled Hassen, unsure when this actually happens
    Failed: DownloadOperationStatus.FAILED,

    // These statuses are not expected to be returned by the API, but are included in the documentation
    ProvisioningReplica: DownloadOperationStatus.PROCESSING, // NOTE: This used to occur before ExportingData, but according to Khalid Hassen we shouldn't see it anymore
    ImportChanges: DownloadOperationStatus.PROCESSING,
    ExportChanges: DownloadOperationStatus.PROCESSING,
    ExportingSnapshot: DownloadOperationStatus.PROCESSING,
    ImportAttachments: DownloadOperationStatus.PROCESSING,
    UnRegisteringReplica: DownloadOperationStatus.PROCESSING,
  };

  // Statuses that come back if the Download API pages the service's features
  // under the hood They are listed in the order they are expected to occur
  const pagingJobStatusMap: Record<PagingJobStatus, DownloadOperationStatus> = {
    Pending: DownloadOperationStatus.PENDING,
    InProgress: DownloadOperationStatus.PROCESSING,
    PagingData: DownloadOperationStatus.PROCESSING,
    ConvertingData: DownloadOperationStatus.CONVERTING,
    Failed: DownloadOperationStatus.FAILED,
    Completed: DownloadOperationStatus.COMPLETED,
  };

  return (
    createReplicaStatusMap[status as CreateReplicaStatus] ||
    pagingJobStatusMap[status as PagingJobStatus]
  );
}

type CreateReplicaStatus =
  | "Pending"
  | "InProgress"
  | "Completed"
  | "Failed"
  | "ImportChanges"
  | "ExportChanges"
  | "ExportingData"
  | "ExportingSnapshot"
  | "ExportAttachments"
  | "ImportAttachments"
  | "ProvisioningReplica"
  | "UnRegisteringReplica"
  | "CompletedWithErrors";

type PagingJobStatus =
  | "Pending"
  | "InProgress"
  | "PagingData"
  | "ConvertingData"
  | "Completed"
  | "Failed";

type HubDownloadApiStatus = CreateReplicaStatus | PagingJobStatus;

/**
 * @private
 * Interface for the raw response from the Hub Download API
 */
interface IHubDownloadApiResponse {
  status: HubDownloadApiStatus;
  resultUrl?: string;
  recordCount?: number;
  progressInPercent?: number;
  cacheStatus?: DownloadCacheStatus;
}

/**
 * @private
 * Query params that can be used to control cache behavior in the Hub Download API.
 * 'updateCache' is used with the initial request when a download cache update is desired.
 * 'trackCacheUpdate' is used for subsequent requests while polling the progress of a cache update.
 */
type CacheQueryParam = "updateCache" | "trackCacheUpdate";
