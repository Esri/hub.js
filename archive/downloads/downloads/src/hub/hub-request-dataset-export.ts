import { RemoteServerError } from "../remote-server-error";
import { composeDownloadId, urlBuilder } from "../utils";
import { DownloadFormat } from "../download-format";
import { convertToHubFormat } from "./format-converter";

/**
 * @private
 */
export interface IHubDatasetExportRequestParams {
  host: string;
  datasetId: string;
  format: DownloadFormat;
  spatialRefId: string;
  geometry?: string;
  where?: string;
}

/**
 * @private
 */
export function hubRequestDatasetExport(
  params: IHubDatasetExportRequestParams
) {
  const { host, datasetId, spatialRefId, geometry, where } = params;

  const body = {
    spatialRefId,
    format: convertToHubFormat(params.format),
    geometry,
    where,
  };

  // TODO: add @esri/hub-common as a peer dependency  next breaking change
  // and use buildUrl() for the following:
  const url = urlBuilder({
    host,
    route: `/api/v3/datasets/${datasetId}/downloads`,
  });

  // TODO: add @esri/hub-common as a peer dependency  next breaking change
  // and use hubRequest() for the following:
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .then((resp) => {
      const { ok, status, statusText } = resp;
      if (!ok) {
        throw new RemoteServerError(statusText, url, status);
      }
      return undefined;
    })
    .then(() => {
      return { downloadId: composeDownloadId(params) };
    });
}
