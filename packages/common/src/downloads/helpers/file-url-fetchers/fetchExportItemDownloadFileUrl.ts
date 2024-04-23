import {
  IExportItemRequestOptions,
  IExportParameters,
  exportItem,
  getItemStatus,
} from "@esri/arcgis-rest-portal";
import {
  DownloadOperationStatus,
  ExportItemFormat,
  IFetchDownloadFileUrlOptions,
  LegacyExportItemFormat,
  PORTAL_EXPORT_TYPES,
  ServiceDownloadFormat,
  downloadProgressCallback,
} from "../types";
import { getExportItemDataUrl } from "../getExportItemDataUrl";
import HubError from "../../../HubError";
import { IArcGISContext } from "../../../ArcGISContext";

export async function fetchExportItemDownloadFileUrl(
  options: IFetchDownloadFileUrlOptions
): Promise<string> {
  validateOptions(options);
  const { entity, format, context, progressCallback } = options;
  progressCallback && progressCallback(DownloadOperationStatus.PENDING);
  const { exportItemId, jobId } = await exportItem({
    id: entity.id,
    exportFormat: getExportFormatParam(format as ExportItemFormat),
    exportParameters: getExportParameters(options),
    authentication: context.hubRequestOptions.authentication,
  });

  await pollForJobCompletion(exportItemId, jobId, context);

  // TODO: Once the job is completed, we still need to set the special typekeywords needed to find the item later.
  // Also, I _think_ we can only do one layer at a time (at least with the current typeKeywords schema we're using)
  progressCallback && progressCallback(DownloadOperationStatus.COMPLETED);
  return getExportItemDataUrl(exportItemId, context);
}

function validateOptions(options: IFetchDownloadFileUrlOptions) {
  const { geometry, where } = options;

  if (geometry) {
    throw new HubError(
      "fetchExportItemDownloadFileUrl",
      "Geometric filters are not supported for this type of download"
    );
  }

  if (where) {
    throw new HubError(
      "fetchExportItemDownloadFileUrl",
      "Attribute filters are not supported for this type of download"
    );
  }
}

function getExportFormatParam(
  format: ExportItemFormat
): IExportItemRequestOptions["exportFormat"] {
  const legacyFormat = getLegacyExportItemFormat(format);
  return PORTAL_EXPORT_TYPES[legacyFormat]
    ?.name as IExportItemRequestOptions["exportFormat"];
}

function getLegacyExportItemFormat(
  format: ExportItemFormat
): LegacyExportItemFormat {
  return format === ServiceDownloadFormat.FILE_GDB ? "fileGeodatabase" : format;
}

function getExportParameters(
  options: IFetchDownloadFileUrlOptions
): IExportParameters {
  const { layers, where } = options;
  const result: IExportParameters = {};

  if (layers) {
    result.layers = layers.map((id) => ({ id, where }));
  }

  return result;
}

async function pollForJobCompletion(
  exportedItemId: string,
  jobId: string,
  context: IArcGISContext,
  progressCallback?: downloadProgressCallback
): Promise<void> {
  const POLL_INTERVAL = 3000;
  const { status } = await getItemStatus({
    id: exportedItemId,
    jobId,
    jobType: "export",
    authentication: context.hubRequestOptions.authentication,
  });

  if (status === "failed") {
    throw new HubError("fetchExportItemDownloadFileUrl", "Export job failed");
  }

  if (status !== "completed") {
    progressCallback && progressCallback(DownloadOperationStatus.PROCESSING);
    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL));
    return pollForJobCompletion(exportedItemId, jobId, context);
  }
}
