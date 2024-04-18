import HubError from "../../../HubError";
import {
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
  const { entity, format, context, layers, where /* geometry, */ } = options;

  const searchParams = new URLSearchParams({
    status: "true",
    redirect: "false",
    layers: layers[0].toString(),
  });

  where && searchParams.append("where", where);

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
    // TODO: Standardize error messages
    throw new HubError(
      "pollDownloadApi",
      `Failed to fetch download status: ${response.status}`
    );
  }
  const { status, progressInPercent, resultUrl }: IHubDownloadApiResponse =
    await response.json();
  const operationStatus = toDownloadOperationStatus(status);
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
    Pending: "pending",
    InProgress: "pending",
    ImportChanges: "pending",
    ExportChanges: "pending",
    ExportingData: "processing",
    ExportingSnapshot: "processing",
    ExportAttachments: "processing",
    ImportAttachments: "processing",
    ProvisioningReplica: "processing",
    UnRegisteringReplica: "processing",
    Completed: "completed",
    Failed: "failed",
    CompletedWithErrors: "failed",
  };

  const pagingJobStatusMap: Record<PagingJobStatus, DownloadOperationStatus> = {
    Pending: "pending",
    PagingData: "processing",
    ConvertingData: "processing",
    Failed: "failed",
    Completed: "completed",
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
