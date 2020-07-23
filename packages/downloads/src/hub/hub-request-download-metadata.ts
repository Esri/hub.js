import { RemoteServerError } from "../remote-server-error";
import { urlBuilder, composeDownloadId } from "../utils";
import { DownloadFormat } from "../download-format"
import { convertToHubFormat } from "./format-converter";

/**
 * @private
 */
export interface IHubDownloadMetadataRequestParams {
  host: string;
  datasetId: string;
  format: DownloadFormat;
  spatialRefId?: string;
  geometry?: string;
  where?: string;
}

/**
 * @private
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
