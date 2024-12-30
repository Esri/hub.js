import { parseServiceUrl } from "@esri/arcgis-rest-feature-layer";
import HubError from "../../../HubError";
import { wait } from "../../../utils/wait";
import {
  DownloadOperationStatus,
  IFetchDownloadFileOptions,
  IFetchDownloadFileResponse,
  downloadProgressCallback,
} from "../../types";
import {
  IAuthenticationManager,
  IRequestOptions,
  request,
} from "@esri/arcgis-rest-request";

/**
 * TODO: DOCUMENT ME!
 */
export async function fetchCreateReplicaDownloadFile(
  opts: IFetchDownloadFileOptions
): Promise<IFetchDownloadFileResponse> {
  const { entity, context, pollInterval, progressCallback } = opts;
  const serviceUrl = parseServiceUrl(entity.url);
  const createReplicaOptions = getCreateReplicaOptions(opts);
  const { authentication } = context.requestOptions;

  const totalFeatureCount = await getTotalRecordCount({
    serviceUrl,
    createReplicaOptions,
    authentication,
  });

  const statusUrl = await _initiateCreateReplica({
    serviceUrl,
    authentication,
    createReplicaOptions,
  });

  const { resultUrl, authRequired } = await _pollUntilComplete({
    statusUrl,
    authentication,
    totalFeatureCount,
    pollInterval,
    progressCallback,
  });

  let withOptionalToken = resultUrl;
  if (authRequired) {
    const token = await authentication.getToken(resultUrl);
    withOptionalToken = `${resultUrl}?token=${token}`;
  }

  return {
    type: "url",
    href: withOptionalToken,
  };
}

// TODO: Add return type
function getCreateReplicaOptions(opts: IFetchDownloadFileOptions): any {
  // TODO: RE-IMPLEMENT THIS
  return {
    layers: "0",
    layerQueries: {
      0: { queryOption: "all" },
    },
    returnAttachments: true,
    returnAttachmentsDataByUrl: true,
    async: true,
    syncModel: "none",
    targetType: "client",
    syncDirection: "bidirectional",
    attachmentsSyncDirection: "bidirectional",
  };
}

async function getTotalRecordCount(opts: {
  serviceUrl: string;
  createReplicaOptions: any;
  authentication: IAuthenticationManager;
}): Promise<number> {
  // TODO: RE-IMPLEMENT THIS
  // const { layerQueries, geometry, geometryType, inSR } = options;
  // const layerDefinitions =
  //   Object.keys(layerQueries).reduce((acc, key) => {
  //     acc[key] =
  //       layerQueries[key].queryOption === 'useFilter' ? layerQueries[key].where : '1=1';
  //       return acc;
  //     },
  //   {});
  const requestOptions: IRequestOptions = {
    // Use POST to avoid URL length limits with complex geometries
    httpMethod: "POST",
    params: {
      f: "json",
      returnCountOnly: true,
      spatialRel: "esriSpatialRelIntersects",
      // layerDefs: layerDefinitions,
      // geometry,
      // geometryType,
      // inSR
    },
    authentication: opts.authentication,
  };
  const response = await request(`${opts.serviceUrl}/query`, requestOptions);
  const totalCount = response.layers.reduce(
    (acc: number, curr: any) => acc + curr.count,
    0
  );

  return totalCount;
}

interface IInitiateCreateReplicaOptions {
  serviceUrl: string;
  // TODO: Change this!
  createReplicaOptions: any;
  authentication: IAuthenticationManager;
}

async function _initiateCreateReplica(
  opts: IInitiateCreateReplicaOptions
): Promise<string> {
  const { serviceUrl, createReplicaOptions, authentication } = opts;

  const requestOptions: IRequestOptions = {
    httpMethod: "POST",
    params: createReplicaOptions,
    authentication,
  };
  const { statusUrl } = await request(
    `${serviceUrl}/createReplica`,
    requestOptions
  );
  return statusUrl;
}

interface IPollUntilCompleteOptions {
  statusUrl: string;
  authentication: IAuthenticationManager;
  pollInterval: number;
  totalFeatureCount: number;
  progressCallback?: downloadProgressCallback;
}
interface ICreateReplicaStatusResponse {
  status: CreateReplicaStatus;
  recordCount: number;
  error: any;
  resultUrl: string;
}
interface IPollUntilCompleteResult {
  authRequired: boolean; // Whether authentication was required for successful polling
  resultUrl: string; // Url to the final download file
}
async function _pollUntilComplete(
  opts: IPollUntilCompleteOptions
): Promise<IPollUntilCompleteResult> {
  const {
    statusUrl,
    authentication,
    totalFeatureCount,
    pollInterval,
    progressCallback,
  } = opts;

  const result = await tryAuthenticatedGet(statusUrl, { authentication });
  const { authRequired } = result;
  const {
    status,
    resultUrl,
    recordCount = 0,
    error = {},
  } = result.response as ICreateReplicaStatusResponse;

  // If an error was captured by `request()` during the polling operation, throw it
  if (error) {
    throw new HubError("fetchCreateReplicaDownloadFile", error.message);
  }

  // If the operation "failed" without a captured error, throw a generic error instead
  const operationStatus = toDownloadOperationStatus(status);
  if (operationStatus === DownloadOperationStatus.FAILED) {
    throw new HubError(
      "fetchCreateReplicaDownloadFile",
      "Download operation failed without an error message"
    );
  }

  if (resultUrl) {
    // Operation complete, return the download URL and auth requirement
    return {
      authRequired,
      resultUrl,
    };
  }

  // Operation still in progress. Report progress if a callback was provided and poll again.
  if (progressCallback) {
    const percentComplete = Math.round(recordCount / totalFeatureCount) * 100;
    progressCallback(operationStatus, percentComplete);
  }

  await wait(pollInterval);
  return _pollUntilComplete({
    statusUrl,
    authentication,
    totalFeatureCount,
    pollInterval,
    progressCallback,
  });
}

export interface ITryAuthenticatedGetResponse {
  authRequired: boolean; // Whether authentication was required for a successful request
  response: any; // JSON response from the underlying request
}

/**
 * Determines whether the specified url requires authentication and makes a get request.
 *
 * This function is particularly useful when interacting with feature
 * services, since there isn't another programmatic way to determine
 * whether a feature service is public or private
 *
 * @param url
 * @param requestOptions Pass-through to request(). Must include authentication.
 *
 * @returns {ITryAuthenticatedGetResponse}
 */
export async function tryAuthenticatedGet(
  url: string,
  requestOptions: IRequestOptions
): Promise<ITryAuthenticatedGetResponse> {
  const rawResponse = await request(url, {
    ...requestOptions,
    rawResponse: true,
    httpMethod: "GET",
  });
  const finalUrl = new URL("", rawResponse.url); // have to pass in a base because of a safari issue (https://bugs.webkit.org/show_bug.cgi?id=216841)
  const response = await rawResponse.json();
  return {
    response,
    authRequired: finalUrl.searchParams.has("token"),
  };
}

// NOTE: Use shared function from fetchHubApiDownloadFile.ts instead
function toDownloadOperationStatus(
  status: CreateReplicaStatus
): DownloadOperationStatus {
  // Statuses that come back from createReplica
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

    // These statuses are not expected to be returned by createReplica, but are included in the documentation
    ProvisioningReplica: DownloadOperationStatus.PROCESSING, // NOTE: This used to occur before ExportingData, but according to Khalid Hassen we shouldn't see it anymore
    ImportChanges: DownloadOperationStatus.PROCESSING,
    ExportChanges: DownloadOperationStatus.PROCESSING,
    ExportingSnapshot: DownloadOperationStatus.PROCESSING,
    ImportAttachments: DownloadOperationStatus.PROCESSING,
    UnRegisteringReplica: DownloadOperationStatus.PROCESSING,
  };

  return createReplicaStatusMap[status as CreateReplicaStatus];
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

/////////////////////////////////////////////////////////////////////////////////////
// TAKE NOTE OF THIS:
// GeoJSON and KML are only supported in WGS84, so we need to specify the spatial reference here
// if (
//   [ServiceDownloadFormat.GEOJSON, ServiceDownloadFormat.KML].includes(format)
// ) {
//   searchParams.append("spatialRefId", "4326");
// }
