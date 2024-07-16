import {
  IExportItemRequestOptions,
  IExportParameters,
  exportItem,
  getItemStatus,
} from "@esri/arcgis-rest-portal";
import {
  DownloadOperationStatus,
  IFetchDownloadFileOptions,
  IFetchDownloadFileResponse,
  LegacyExportItemFormat,
  PORTAL_EXPORT_TYPES,
  ServiceDownloadFormat,
  downloadProgressCallback,
} from "../../types";
import { getExportItemDataUrl } from "../getExportItemDataUrl";
import HubError from "../../../HubError";
import { IArcGISContext } from "../../../ArcGISContext";
import { ExportItemFormat } from "../_types";
import { getProp } from "../../../objects/get-prop";

/**
 * @private
 * Fetches a download file url the Portal API via the item /export endpoint.
 *
 * NOTE: This function is incomplete and various permissions / branching paths need to be
 * validated and implemented. It is a work in progress.
 *
 * NOTE: This is a last resort approach for current Enterprise environments, but it will be replaced
 * by calling the service's /createReplica endpoint directly in the future (i.e., once the Enterprise
 * team achieves feature parity with the Online team's implementation).
 *
 * This is because The item /export endpoint can only be used on Hosted Feature Services
 * with the "Extract" capability enabled, which means the service will also have the /createReplica
 * endpoint available. As /createReplica is a more flexible operation, /export becomes obsolete.
 *
 * @param options options for refining / filtering the resulting download file
 * @returns a url to download the file
 */
export async function fetchExportItemDownloadFile(
  options: IFetchDownloadFileOptions
): Promise<IFetchDownloadFileResponse> {
  validateOptions(options);
  const { entity, format, context, progressCallback, pollInterval } = options;
  progressCallback && progressCallback(DownloadOperationStatus.PENDING);
  const { exportItemId, jobId } = await exportItem({
    id: entity.id,
    exportFormat: getExportFormatParam(format as ExportItemFormat),
    exportParameters: getExportParameters(options),
    authentication: context.hubRequestOptions.authentication,
  });

  await pollForJobCompletion(
    exportItemId,
    jobId,
    context,
    pollInterval,
    progressCallback
  );

  // TODO: Once the job is completed, we still need to set the special typekeywords needed to find the item later.
  // Also, I _think_ we can only do one layer at a time (at least with the current typeKeywords schema we're using)
  progressCallback && progressCallback(DownloadOperationStatus.COMPLETED);
  return {
    type: "url",
    href: getExportItemDataUrl(exportItemId, context),
  };
}

function validateOptions(options: IFetchDownloadFileOptions) {
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
  return getProp(
    PORTAL_EXPORT_TYPES,
    `${legacyFormat}.name`
  ) as IExportItemRequestOptions["exportFormat"];
}

function getLegacyExportItemFormat(
  format: ExportItemFormat
): LegacyExportItemFormat {
  return format === ServiceDownloadFormat.FILE_GDB ? "fileGeodatabase" : format;
}

function getExportParameters(
  options: IFetchDownloadFileOptions
): IExportParameters {
  const { layers } = options;
  const result: IExportParameters = {
    layers: layers.map((id) => ({ id })),
  };
  return result;
}

async function pollForJobCompletion(
  exportedItemId: string,
  jobId: string,
  context: IArcGISContext,
  pollInterval: number,
  progressCallback?: downloadProgressCallback
): Promise<void> {
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
    await new Promise((resolve) => setTimeout(resolve, pollInterval));
    return pollForJobCompletion(
      exportedItemId,
      jobId,
      context,
      pollInterval,
      progressCallback
    );
  }
}
