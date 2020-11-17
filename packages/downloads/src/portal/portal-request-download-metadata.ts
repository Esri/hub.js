import { getItem, IItem, searchItems } from "@esri/arcgis-rest-portal";
import { UserSession } from "@esri/arcgis-rest-auth";
import {
  getService,
  IFeatureServiceDefinition,
  ILayerDefinition
} from "@esri/arcgis-rest-feature-layer";
import { DownloadFormat, DownloadFormats } from "../download-format";
import { urlBuilder, composeDownloadId } from "../utils";

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

  if (type !== ItemTypes.FeatureService && type !== ItemTypes.MapService) {
    return Promise.resolve({
      modified,
      format
    });
  }

  return getService({ url, authentication }).then(
    (response: IFeatureServiceDefinition) => {
      const layers: ILayerDefinition[] = response.layers || [];
      const multilayer = isMultilayerRequest(layerId, layers);
      return {
        format:
          multilayer && isCollectionType(format)
            ? `${format} Collection`
            : format,
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
