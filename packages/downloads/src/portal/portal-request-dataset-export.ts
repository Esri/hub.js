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
}

/**
 * @private
 */
export function portalRequestDatasetExport (params: IPortalDatasetExportRequestParams): Promise<any> {
  const {
    datasetId,
    title,
    format,
    authentication
  } = params;
  const [itemId, layerId = 0] = datasetId.split('_');
  return exportItem({
    id: itemId,
    exportFormat: format,
    exportParameters: { layers: [{ id: Number(layerId) }]},
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
