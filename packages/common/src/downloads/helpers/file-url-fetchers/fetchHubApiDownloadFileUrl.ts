import HubError from "../../../HubError";
import { getProp } from "../../../objects/get-prop";
import {
  ArcgisHubDownloadError,
  DownloadOperationStatus,
  IFetchDownloadFileUrlOptions,
  downloadProgressCallback,
} from "../types";

export async function fetchHubApiDownloadFileUrl(
  options: IFetchDownloadFileUrlOptions
): Promise<string> {
  validateOptions(options);
  const requestUrl = getDownloadApiRequestUrl(options);
  return pollDownloadApi(requestUrl, options.progressCallback);
}

function validateOptions(options: IFetchDownloadFileUrlOptions) {
  const { layers = [] } = options;

  if (layers.length === 0) {
    throw new HubError(
      "fetchHubApiDownloadFileUrl",
      "No layers provided for download"
    );
  }

  if (layers.length > 1) {
    throw new HubError(
      "fetchHubApiDownloadFileUrl",
      "Multiple layer downloads are not yet supported"
    );
  }
}

function getDownloadApiRequestUrl(options: IFetchDownloadFileUrlOptions) {
  const { entity, format, context, layers, geometry, where } = options;

  const searchParams = new URLSearchParams({
    redirect: "false",
    layers: layers[0].toString(),
  });

  if (geometry) {
    const geometryJSON = geometry.toJSON();
    // Not sure why type isn't included in the toJSON() output, but our API expects it
    geometryJSON.type = geometry.type;
    searchParams.append("geometry", JSON.stringify(geometryJSON));
  }

  where && searchParams.append("where", where);

  const token = getProp(context, "hubRequestOptions.authentication.token");
  token && searchParams.append("token", token);

  return `${context.hubUrl}/api/download/v1/items/${
    entity.id
  }/${format}?${searchParams.toString()}`;
}

async function pollDownloadApi(
  requestUrl: string,
  progressCallback?: downloadProgressCallback
): Promise<string> {
  const response = await fetch(requestUrl);
  if (!response.ok) {
    const errorBody = await response.json();
    // TODO: Add standarized messageId when available
    throw new ArcgisHubDownloadError({
      rawMessage: errorBody.message,
    });
  }
  const { status, progressInPercent, resultUrl }: IHubDownloadApiResponse =
    await response.json();
  const operationStatus = toDownloadOperationStatus(status);
  if (operationStatus === DownloadOperationStatus.FAILED) {
    throw new HubError(
      "fetchHubApiDownloadFileUrl",
      "Download operation failed with a 200 status code"
    );
  }
  progressCallback && progressCallback(operationStatus, progressInPercent);

  // Operation complete, return the download URL
  if (resultUrl) {
    return resultUrl;
  }

  // Operation still in progress, poll again
  await new Promise((resolve) => setTimeout(resolve, 3000));
  return pollDownloadApi(requestUrl, progressCallback);
}

function toDownloadOperationStatus(
  status: HubDownloadApiStatus
): DownloadOperationStatus {
  // TODO: verify the correct mapping for each create replica status
  const createReplicaStatusMap: Record<
    CreateReplicaStatus,
    DownloadOperationStatus
  > = {
    Pending: DownloadOperationStatus.PENDING,
    InProgress: DownloadOperationStatus.PENDING,
    ImportChanges: DownloadOperationStatus.PENDING,
    ExportChanges: DownloadOperationStatus.PENDING,
    ExportingData: DownloadOperationStatus.PROCESSING,
    ExportingSnapshot: DownloadOperationStatus.PROCESSING,
    ExportAttachments: DownloadOperationStatus.PROCESSING,
    ImportAttachments: DownloadOperationStatus.PROCESSING,
    ProvisioningReplica: DownloadOperationStatus.PROCESSING,
    UnRegisteringReplica: DownloadOperationStatus.PROCESSING,
    Completed: DownloadOperationStatus.COMPLETED,
    Failed: DownloadOperationStatus.FAILED,
    CompletedWithErrors: DownloadOperationStatus.FAILED,
  };

  const pagingJobStatusMap: Record<PagingJobStatus, DownloadOperationStatus> = {
    Pending: DownloadOperationStatus.PENDING,
    PagingData: DownloadOperationStatus.PROCESSING,
    ConvertingData: DownloadOperationStatus.PROCESSING,
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
  | "PagingData"
  | "ConvertingData"
  | "Failed"
  | "Completed";

type HubDownloadApiStatus = CreateReplicaStatus | PagingJobStatus;

interface IHubDownloadApiResponse {
  status: HubDownloadApiStatus;
  resultUrl?: string;
  recordCount?: number;
  progressInPercent?: number;
}
