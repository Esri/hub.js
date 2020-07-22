import { getItem, IItem, searchItems } from "@esri/arcgis-rest-portal";
import { UserSession } from "@esri/arcgis-rest-auth";
import { getLayer } from "@esri/arcgis-rest-feature-layer";
import { DownloadFormat } from "../download-format";
import { urlBuilder, composeDownloadId } from "../utils"

export interface IPortalDownloadMetadataRequestParams {
  datasetId: string;
  format: DownloadFormat;
  authentication: UserSession;
  spatialRefId?: string; 
}

/**
 * Fetch metadata for an Enterprise download.
 * @param params - parameters that define the download
 * @returns A Promise that will resolve with download metadata.
 */
export function portalRequestDownloadMetadata(
  params: IPortalDownloadMetadataRequestParams
): Promise<any> {
  const {
    datasetId,
    spatialRefId,
    authentication,
    format
  } = params;

  const [itemId] = datasetId.split('_');
  let serviceLastEditDate: number | undefined;
  let itemModifiedDate: number;
  let itemType: string;

  return getItem(itemId, { authentication }).then((item: IItem) => {
    const { type, modified, url } = item
    itemModifiedDate = modified;
    itemType = type;
    return fetchLastEditDate({ datasetId, url, authentication, type, modified });
  }).then((result: number) => {
    serviceLastEditDate = result;
    return searchItems({
      q: `type:"${format}" AND typekeywords:"export:${datasetId},spatialRefId:${spatialRefId},exportFormat:${format}"`,
      num: 1,
      sortField: 'modified',
      sortOrder: 'DESC',
      authentication,
    })
  }).then((searchResponse: any) => {
    return formatDownloadMetadata({
      cachedDownload: searchResponse.results[0],
      datasetId,
      format,
      serviceLastEditDate,
      itemModifiedDate,
      itemType,
      authentication
    });
  }).catch((err: any) => {
    throw err;
  });
}

function fetchLastEditDate(
  params: any
): Promise<number | undefined> {
  const {
    datasetId,
    url,
    type,
    modified,
    authentication
  } = params;

  const layerId = datasetId.split('_')[1] || 0;

  if (type !== "Feature Service" && type !== 'Map Service') {
    return Promise.resolve(modified);
  }

  return getLayer({
    url: `${url}/${layerId}`,
    authentication,
  })
  .then((layer: any) => {
    const editingInfo: any | null = layer.editingInfo;
    return editingInfo ? editingInfo.lastEditDate : undefined
  });
}

function formatDownloadMetadata (params: any) {
  const {
    cachedDownload,
    serviceLastEditDate,
    authentication
  } = params;

  const lastEditDate = serviceLastEditDate ? (new Date(serviceLastEditDate)).toISOString() : undefined
  
  if (!cachedDownload) {
    return {
      downloadId: composeDownloadId(params),
      status: 'not_ready',
      lastEditDate
    };
  }

  const { created, id } = cachedDownload; 
  return {
    downloadId: id,
    status: serviceLastEditDate && serviceLastEditDate > created ? 'stale' : 'ready',
    lastEditDate,
    contentLastModified: (new Date(created)).toISOString(),
    lastModified: (new Date(created)).toISOString(),
    downloadUrl: urlBuilder({ host: authentication.portal, route: `content/items/${id}/data`, query: { token: authentication.token } }),
  };
}
