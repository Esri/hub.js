import { getItem, IItem, searchItems } from "@esri/arcgis-rest-portal";
import { UserSession } from "@esri/arcgis-rest-auth";
import {
  getService,
  getLayer,
  IFeatureServiceDefinition,
  ILayerDefinition
} from "@esri/arcgis-rest-feature-layer";
import { DownloadFormat, DownloadFormats } from "../download-format";
import { urlBuilder, composeDownloadId, isRecentlyUpdated } from "../utils";
import { DownloadTarget } from "../download-target";
import { DownloadStatus } from "../download-status";

enum ItemTypes {
  FeatureService = "Feature Service",
  MapService = "Map Service"
}

const isCollectionType = (format: DownloadFormat) =>
  format === DownloadFormats.CSV || format === DownloadFormats.KML;

/**
 * @private
 */
export interface IPortalDownloadMetadataRequestParams {
  datasetId: string;
  format: DownloadFormat;
  authentication: UserSession;
  spatialRefId?: string;
  target?: DownloadTarget;
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
  const { datasetId, authentication, format, spatialRefId, target } = params;

  const [itemId, layerId] = datasetId.split("_");
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
        format,
        layerId
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
        authentication,
        target
      });
    })
    .catch((err: any) => {
      throw err;
    });
}

function fetchCacheSearchMetadata(params: any): Promise<ICacheSearchMetadata> {
  const { format, layerId, url, type, modified, authentication } = params;

  if (type !== ItemTypes.FeatureService && type !== ItemTypes.MapService) {
    return Promise.resolve({
      modified,
      format
    });
  }

  return getService({ url, authentication })
    .then((response: IFeatureServiceDefinition) => {
      const layers: ILayerDefinition[] = response.layers || [];
      const promises: Array<Promise<ILayerDefinition>> = layers.map(layer => {
        return getLayer({ url: `${url}/${layer.id}`, authentication });
      });
      return Promise.all(promises);
    })
    .then((layers: ILayerDefinition[]) => {
      return {
        format: getPortalFormat({ format, layerId, layers }),
        modified: extractLastEditDate(layers)
      };
    });
}

function getPortalFormat(params: {
  format: DownloadFormat;
  layerId: string;
  layers: ILayerDefinition[];
}) {
  const { format, layerId, layers } = params;
  const multilayer = isMultilayerRequest(layerId, layers);
  return multilayer && isCollectionType(format)
    ? `${format} Collection`
    : format;
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

function formatDownloadMetadata(params: any) {
  const {
    cachedDownload,
    serviceLastEditDate,
    authentication,
    target
  } = params;

  const lastEditDate =
    serviceLastEditDate === undefined
      ? undefined
      : new Date(serviceLastEditDate).toISOString();

  const { created, id } = cachedDownload || {};
  const recentlyUpdated = isRecentlyUpdated(target, serviceLastEditDate);

  const status = determineStatus(serviceLastEditDate, created, recentlyUpdated);

  if (!cachedDownload) {
    return {
      downloadId: composeDownloadId(params),
      status,
      lastEditDate
    };
  }

  return {
    downloadId: id,
    status,
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

function determineStatus(
  serviceLastEditDate: Date,
  exportCreatedDate: Date,
  recentlyUpdated: boolean
) {
  if (!exportCreatedDate) {
    return recentlyUpdated ? DownloadStatus.LOCKED : DownloadStatus.NOT_READY;
  }
  if (!serviceLastEditDate) {
    return DownloadStatus.READY_UNKNOWN;
  }
  if (serviceLastEditDate > exportCreatedDate) {
    return recentlyUpdated ? DownloadStatus.STALE_LOCKED : DownloadStatus.STALE;
  }
  return DownloadStatus.READY;
}
