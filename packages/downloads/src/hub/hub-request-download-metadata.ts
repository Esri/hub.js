import { RemoteServerError } from "../remote-server-error";
import { urlBuilder, composeDownloadId } from "../utils";
import { DownloadFormat } from "../download-format"
import { convertToHubFormat } from "./format-converter";

export interface IHubDownloadMetadataRequestParams {
  host: string;
  datasetId: string;
  format: DownloadFormat;
  spatialRefId?: string;
  geometry?: string;
  where?: string;
}

/**
 * ```js
 * import { hubRequestDownloadMetadata } from "@esri/hub-downloads";
 * const params = {
 *   host: 'https://hub.arcgis.com,
 *   datasetId: 'abcdef0123456789abcdef0123456789_0',
 *   format: 'CSV'
 * };
 * hubRequestDownloadMetadata(params)
 *   .then(response => {
 *     // {
 *     //   downloadId: 'abcdef0123456789abcdef0123456789_0::csv',
 *     //   contentLastModified: '2020-06-17T01:16:01.933Z',
 *     //   lastEditDate: '2020-06-18T01:17:31.492Z',
 *     //   lastModified: '2020-06-17T13:04:28.000Z',
 *     //   status: 'stale',
 *     //   downloadUrl: 'https://dev-hub-indexer.s3.amazonaws.com/files/dd4580c810204019a7b8eb3e0b329dd6/0/full/4326/dd4580c810204019a7b8eb3e0b329dd6_0_full_4326.csv',
 *     //   contentLength: 1391454,
 *     //   cacheTime: 13121
 *     // }
 *   });
 * ```
 * Fetch metadata for a Hub download.
 * @param params - parameters that define the download
 * @returns A Promise that will resolve with download metadata.
 */
export function hubRequestDownloadMetadata(
  params: IHubDownloadMetadataRequestParams
): Promise<any> {
  const {
    host,
    datasetId,
    spatialRefId,
    geometry,
    where
  } = params;

  const queryParams = {
    spatialRefId,
    formats: convertToHubFormat(params.format),
    geometry: geometry ? JSON.stringify(geometry) : undefined,
    where
  };
  const url = urlBuilder({ host, route: `/api/v3/datasets/${datasetId}/downloads`, query: queryParams });

  return fetch(url).then(resp => {
    const { ok, status, statusText } = resp;
    if (!ok) {
      throw new RemoteServerError(statusText, url, status);
    }
    return resp.json();
    })
    .then(json => {
      validateApiResponse(json);
      return formatApiResponse(json, composeDownloadId(params));
    });
}

function validateApiResponse ({ data }: any): void {
  if (!data) {
    throw new Error('Unexpected API response; no "data" property.');
  }

  if (!Array.isArray(data)) {
    throw new Error('Unexpected API response; "data" is not an array.');
  }

  if (data.length > 1) {
    throw new Error('Unexpected API response; "data" contains more than one download.')
  }
}

function formatApiResponse(json: any, downloadId: string) {
  const { data: [ metadata ] } = json;

  if (!metadata) {
    return {
      downloadId,
      status: 'not_ready'
    };
  }

  const {
      attributes: {
        contentLastModified,
        lastModified,
        status,
        contentLength,
        cacheTime,
        source: {
          lastEditDate,
        }
      },
      links: {
        content: downloadUrl
      }
    } = metadata;

  return {
    downloadId,
    contentLastModified,
    lastEditDate,
    lastModified,
    status,
    downloadUrl,
    contentLength,
    cacheTime
   };
};
