import { getItem, IItem, searchItems } from "@esri/arcgis-rest-portal";
import { UserSession } from "@esri/arcgis-rest-auth";
import {
  getService,
  getLayer,
  IFeatureServiceDefinition,
  ILayerDefinition,
} from "@esri/arcgis-rest-feature-layer";
import { DownloadFormat, DownloadFormats } from "../download-format";
import { urlBuilder, composeDownloadId } from "../utils";
import { DownloadTarget } from "../download-target";
import { DownloadStatus } from "../download-status";
import { isDownloadEnabled } from "./utils";
import { isRecentlyUpdated } from "./utils";
import { buildExistingExportsPortalQuery } from "@esri/hub-common";
import { parseDatasetId } from "@esri/hub-common";
import { IDownloadMetadataResults } from "..";
import { ArcGISAuthError } from "@esri/arcgis-rest-request";

enum ItemTypes {
  FeatureService = "Feature Service",
  MapService = "Map Service",
}

const isCollectionType = (format: DownloadFormat) =>
  format === DownloadFormats.CSV || format === DownloadFormats.KML;

/**
 * @private
 */
export interface IPortalDownloadMetadataRequestParams {
  datasetId: string;
  format: DownloadFormat;
  authentication?: UserSession;
  portal?: string; // optional if authentication is provided
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
): Promise<IDownloadMetadataResults> {
  const { datasetId, authentication, format, spatialRefId, target, portal } =
    params;

  const { itemId, layerId } = parseDatasetId(datasetId);

  let serviceLastEditDate: number | undefined;
  let itemModifiedDate: number;
  let itemType: string;
  let fetchedItem: IItem;

  return getItem(itemId, { authentication, portal })
    .then((item: IItem) => {
      const { type, modified, url } = item;
      fetchedItem = item;
      itemModifiedDate = modified;
      itemType = type;
      return fetchCacheSearchMetadata({
        url,
        authentication,
        type,
        modified,
        format,
        layerId,
        portal,
      });
    })
    .then((metadata: ICacheSearchMetadata) => {
      const { modified, format: searchFormat } = metadata;
      serviceLastEditDate = modified;
      return searchItems({
        q: buildExistingExportsPortalQuery(itemId, {
          layerId,
          onlyTypes: [searchFormat],
          spatialRefId,
        }),
        num: 1,
        sortField: "modified",
        sortOrder: "DESC",
        authentication,
        portal,
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
        target,
        item: fetchedItem,
        portal,
      });
    })
    .catch((err: any) => {
      throw err;
    });
}

function fetchCacheSearchMetadata(params: any): Promise<ICacheSearchMetadata> {
  const { format, layerId, url, type, modified, authentication, portal } =
    params;

  if (type !== ItemTypes.FeatureService && type !== ItemTypes.MapService) {
    return Promise.resolve({
      modified,
      format,
    });
  }

  return retryWithoutAuthOnFail(getService({ url, authentication, portal }))
    .then((response: IFeatureServiceDefinition) => {
      const layers: ILayerDefinition[] = response.layers || [];
      const promises: Array<Promise<ILayerDefinition>> = layers.map((layer) => {
        return retryWithoutAuthOnFail(
          getLayer({ url: `${url}/${layer.id}`, authentication, portal })
        );
      });
      return Promise.all(promises);
    })
    .then((layers: ILayerDefinition[]) => {
      return {
        format: getPortalFormat({ format, layerId, layers }),
        modified: extractLastEditDate(layers),
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
    .filter((timestamp) => {
      return timestamp !== undefined;
    })
    .sort((a, b) => {
      return b - a;
    });
  return result[0];
}

function formatDownloadMetadata(params: any): IDownloadMetadataResults {
  const {
    cachedDownload,
    serviceLastEditDate,
    authentication,
    target,
    item,
    format,
    portal,
  } = params;

  const lastEditDate =
    serviceLastEditDate === undefined
      ? undefined
      : new Date(serviceLastEditDate).toISOString();

  const { created, id } = cachedDownload || {};

  const recentlyUpdated = isRecentlyUpdated(target, serviceLastEditDate);
  const canDownload = isDownloadEnabled(item, format);

  const status = canDownload
    ? determineStatus(serviceLastEditDate, created, recentlyUpdated)
    : DownloadStatus.DISABLED;

  if (!cachedDownload) {
    return {
      downloadId: composeDownloadId(params),
      status,
      lastEditDate,
    };
  }

  return {
    downloadId: id,
    status,
    lastEditDate,
    contentLastModified: new Date(created).toISOString(),
    lastModified: new Date(created).toISOString(),
    downloadUrl: urlBuilder({
      host: portal || authentication.portal,
      route: `content/items/${id}/data`,
      query: { token: authentication?.token },
    }),
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

/**
 * Takes a request promise and retries the request without authentication
 * if it fails.
 *
 * TODO - consider incorporating this into rest-js. Discussion at https://github.com/Esri/arcgis-rest-js/issues/920
 *
 * @param requestPromise
 * @private
 */
function retryWithoutAuthOnFail<T>(requestPromise: Promise<T>): Promise<T> {
  return requestPromise.catch((error: ArcGISAuthError | Error) => {
    if (error.name === "ArcGISAuthError") {
      // try again with no auth
      return (error as ArcGISAuthError).retry(
        () => Promise.resolve(null),
        1
      ) as Promise<T>;
    } else {
      throw error;
    }
  });
}
