import {
  IExportItemRequestOptions,
  IExportParameters,
  exportItem,
  getItemStatus,
} from "@esri/arcgis-rest-portal";
import { ExportItemFormat, IFetchDownloadFileUrlOptions } from "../types";
import HubError from "../../../HubError";
import { IArcGISContext } from "../../../ArcGISContext";
import { getExportItemDataUrl } from "../getExportedItemDownloadUrl";

export async function fetchExportItemDownloadFileUrl(
  options: IFetchDownloadFileUrlOptions
): Promise<string> {
  validateOptions(options);
  const { entity, format, context } = options;
  const { exportItemId, jobId } = await exportItem({
    id: entity.id,
    exportFormat: toExportFormat(format as ExportItemFormat), // oh no, the format strings are _totally_ different. We're going to have to come up with a centralizing mechanism.
    exportParameters: getExportParameters(options),
    authentication: context.hubRequestOptions.authentication,
  });

  await pollForJobCompletion(exportItemId, jobId, context);

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

function toExportFormat(
  format: ExportItemFormat
): IExportItemRequestOptions["exportFormat"] {
  const formatMap: Record<
    ExportItemFormat,
    IExportItemRequestOptions["exportFormat"]
  > = {
    csv: "CSV",
    shapefile: "Shapefile",
    kml: "KML",
    geojson: "GeoJson",
    fileGeodatabase: "File Geodatabase",
    excel: "Excel",
    featureCollection: "Feature Collection",
  };

  return formatMap[format];
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
  context: IArcGISContext
): Promise<void> {
  const POLL_INTERVAL = 3000;
  const { status } = await getItemStatus({
    id: exportedItemId,
    jobId,
    jobType: "export",
    authentication: context.hubRequestOptions.authentication,
  });

  // TODO: handle any errors that might come back from the job

  if (status !== "completed") {
    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL));
    return pollForJobCompletion(exportedItemId, jobId, context);
  }
}
