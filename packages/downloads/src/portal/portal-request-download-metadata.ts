import { getItem, IItem, searchItems } from "@esri/arcgis-rest-portal";
import { UserSession } from "@esri/arcgis-rest-auth";
import {
  getLayer,
  getService,
  IFeatureServiceDefinition,
  ILayerDefinition
} from "@esri/arcgis-rest-feature-layer";
import { DownloadFormat } from "../download-format";
import { urlBuilder, composeDownloadId } from "../utils";

/**
 * @private
 */
export interface IPortalDownloadMetadataRequestParams {
  datasetId: string;
  format: DownloadFormat;
  authentication: UserSession;
  spatialRefId?: string;
}

/**
 * @private
 */
export interface ICacheSearchMetadata {
  modified: number;
  format: string;
}

/**
 * @private
 */
export function portalRequestDownloadMetadata(
  params: IPortalDownloadMetadataRequestParams
): Promise<any> {
  const { datasetId, authentication, format, spatialRefId } = params;

  const [itemId] = datasetId.split("_");
  let serviceLastEditDate: number | undefined;
  let itemModifiedDate: number;
  let itemType: string;

  return getItem(itemId, { authentication })
    .then((item: IItem) => {
      const { type, modified, url } = item;
      itemModifiedDate = modified;
      itemType = type;
      return fetchCacheSearchMetadata({
        url,
        authentication,
        type,
        modified,
        format
      });
    })
    .then((metadata: ICacheSearchMetadata) => {
      const { modified, format: searchFormat } = metadata;
      serviceLastEditDate = modified;
      return searchItems({
        q: `type:"${searchFormat}" AND typekeywords:"export:${datasetId},spatialRefId:${spatialRefId}"`,
        num: 1,
        sortField: "modified",
        sortOrder: "DESC",
        authentication
      });
    })
    .then((searchResponse: any) => {
      return formatDownloadMetadata({
        cachedDownload: searchResponse.results[0],
        datasetId,
        format,
        spatialRefId,
        serviceLastEditDate,
        itemModifiedDate,
        itemType,
        authentication
      });
    })
    .catch((err: any) => {
      throw err;
    });
}

function fetchCacheSearchMetadata(params: any): Promise<ICacheSearchMetadata> {
  const { format, layerId, url, type, modified, authentication } = params;

  if (type !== "Feature Service" && type !== "Map Service") {
    return Promise.resolve({
      modified,
      format: getSearchFormat(format, false)
    });
  }

  return getService({ url, authentication }).then(
    (response: IFeatureServiceDefinition) => {
      const layers: ILayerDefinition[] = response.layers;
      const multilayer = isMultilayerRequest(layerId, layers);
      return {
        format: getSearchFormat(format, multilayer),
        modified: extractLastEditDate(layers)
      };
    }
  );
}

function isMultilayerRequest(layerId: string, layers: ILayerDefinition[]) {
  return layerId === undefined && layers.length > 1;
}

function extractLastEditDate(layers: ILayerDefinition[]) {
  const result = layers
    .map((layer: ILayerDefinition) => {
      const { editingInfo: { lastEditDate } = {} } = layer;
      return lastEditDate;
    })
    .filter(timestamp => {
      return timestamp !== undefined;
    })
    .sort((a, b) => {
      return b - a;
    });
  return result[0];
}

function getSearchFormat(format: DownloadFormat, multilayer: boolean) {
  if (multilayer && (format === "CSV" || format === "KML")) {
    return `${format} Collection`;
  }
  return format;
}

function formatDownloadMetadata(params: any) {
  const { cachedDownload, serviceLastEditDate, authentication } = params;

  const lastEditDate =
    serviceLastEditDate !== undefined
      ? new Date(serviceLastEditDate).toISOString()
      : undefined;

  if (!cachedDownload) {
    return {
      downloadId: composeDownloadId(params),
      status: "not_ready",
      lastEditDate
    };
  }

  const { created, id } = cachedDownload;
  return {
    downloadId: id,
    status:
      serviceLastEditDate && serviceLastEditDate > created ? "stale" : "ready",
    lastEditDate,
    contentLastModified: new Date(created).toISOString(),
    lastModified: new Date(created).toISOString(),
    downloadUrl: urlBuilder({
      host: authentication.portal,
      route: `content/items/${id}/data`,
      query: { token: authentication.token }
    })
  };
}
