import { exportItem } from "@esri/arcgis-rest-portal";
import { DownloadFormat } from "../download-format";

/**
 * @private
 */
export interface IPortalDatasetExportRequestParams {
  datasetId: string;
  format: DownloadFormat;
  authentication: any;
  title?: string;
  spatialRefId?: string;
}

/**
 * @private
 */
export function portalRequestDatasetExport (params: IPortalDatasetExportRequestParams): Promise<any> {
  const {
    datasetId,
    title,
    format,
    authentication,
    spatialRefId
  } = params;
  const [itemId] = datasetId.split('_');
  return exportItem({
    id: itemId,
    exportFormat: format,
    exportParameters: composeExportParameters(params),
    title,
    authentication
  }).then((resp: any) => {
    const {
      size,
      jobId,
      exportItemId,
    } = resp;

    return {
      downloadId: exportItemId,
      jobId,
      size,
      exportCreated: Date.now()
    };
  })
}

function composeExportParameters (params: any) {
  const {
    datasetId,
    spatialRefId
  } = params;
  const layerId = datasetId.split('_')[1] || 0;
  const layers = [{ id: Number(layerId) }];
  return spatialRefId ? {
    layers,
    targetSR: {
      wkid: Number(spatialRefId)
    }
  } : { layers };
}