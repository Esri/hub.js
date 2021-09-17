import {
  updateItem,
  removeItem,
  moveItem,
  setItemAccess,
} from "@esri/arcgis-rest-portal";
import {
  getExportLayerTypeKeyword,
  getExportItemTypeKeyword,
  getSpatialRefTypeKeyword,
  parseDatasetId,
} from "@esri/hub-common";
import { urlBuilder } from "../utils";
import { getExportsFolderId } from "./portal-get-exports-folder-id";
import { DownloadStatus } from "../download-status";
import ExportCompletionError from "./portal-export-completion-error";

/**
 * @private
 */
export function exportSuccessHandler(params: any): Promise<any> {
  const {
    downloadId,
    datasetId,
    exportCreated,
    spatialRefId,
    eventEmitter,
    authentication,
  } = params;

  const { itemId, layerId } = parseDatasetId(datasetId);

  const typeKeywords = [
    getExportItemTypeKeyword(itemId),
    getExportLayerTypeKeyword(layerId),
    `modified:${exportCreated}`, // TODO - is this typekeyword still used for anything?
    getSpatialRefTypeKeyword(spatialRefId),
  ];

  return updateItem({
    item: {
      id: downloadId,
      typekeywords: typeKeywords.join(","),
    },
    authentication,
  })
    .then(() => {
      return setItemAccess({
        id: downloadId,
        authentication,
        access: "private",
      });
    })
    .then(() => {
      return getExportsFolderId(authentication);
    })
    .then((exportFolderId) => {
      return moveItem({
        itemId: downloadId,
        folderId: exportFolderId,
        authentication,
      });
    })
    .catch((err) => {
      if (err && err.code === "CONT_0011") {
        // Skipping file move, already exists in target folder
        return;
      }

      removeItem({
        id: downloadId,
        authentication,
      });
      throw new ExportCompletionError(err.message);
    })
    .then(() => {
      return eventEmitter.emit(`${downloadId}ExportComplete`, {
        detail: {
          metadata: {
            downloadId,
            status: DownloadStatus.READY,
            lastModified: new Date().toISOString(),
            downloadUrl: urlBuilder({
              host: authentication.portal,
              route: `content/items/${downloadId}/data`,
              query: { token: authentication.token },
            }),
          },
        },
      });
    });
}
