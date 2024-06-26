import { request } from "@esri/arcgis-rest-request";
import {
  DownloadOperationStatus,
  IFetchDownloadFileUrlOptions,
} from "../../types";
import HubError from "../../../HubError";
import { getProp } from "../../../objects/get-prop";

/**
 * @private
 * Fetches a download file url from an Image Service via the exportImage endpoint
 *
 * NOTE: This function is incomplete and needs various parameters to be validated
 * and implemented. It is a work in progress.
 *
 * @param options options for refining / filtering the resulting download file
 * @returns a url to download the file
 */
export async function fetchExportImageDownloadFileUrl(
  options: IFetchDownloadFileUrlOptions
): Promise<string> {
  validateOptions(options);

  const { entity, format, context, geometry, progressCallback } = options;
  progressCallback && progressCallback(DownloadOperationStatus.PENDING);

  const extent = getExportImageExtent(options);
  const { xmin, xmax, ymin, ymax } = extent;
  const { wkid } = extent.spatialReference;

  const requestOptions = { ...context.requestOptions };
  requestOptions.httpMethod = "GET";
  requestOptions.params = {
    bbox: `${xmin},${ymin},${xmax},${ymax}`,
    bboxSR: `${wkid}`,
    format,
    mosaicRule:
      '{"ascending":true,"mosaicMethod":"esriMosaicNorthwest","mosaicOperation":"MT_FIRST"}',
  };

  const { maxImageHeight, maxImageWidth } =
    getProp(entity, "extendedProps.server") || {};
  if (maxImageWidth && maxImageHeight) {
    requestOptions.params.size = `${maxImageWidth},${maxImageHeight}`;
  }

  const { href } = await request(`${entity.url}/exportImage`, requestOptions);
  progressCallback && progressCallback(DownloadOperationStatus.COMPLETED);
  return href;
}

function validateOptions(options: IFetchDownloadFileUrlOptions) {
  const { geometry } = options;

  if (geometry && geometry.type !== "extent") {
    throw new HubError(
      "fetchExportImageDownloadFileUrl",
      "Only extent geometric filters are supported for this type of download"
    );
  }
}

function getExportImageExtent(
  options: IFetchDownloadFileUrlOptions
): __esri.Extent {
  const { entity, geometry } = options;
  const serverExtent = getProp(entity, "extendedProps.server.extent");

  let result: __esri.Extent = null;
  if (geometry) {
    result = geometry as __esri.Extent;
  } else if (entity.extent) {
    const [[xmin, ymin], [xmax, ymax]] = entity.extent;
    result = {
      type: "extent",
      xmin,
      ymin,
      xmax,
      ymax,
      spatialReference: {
        wkid: 4326,
      } as __esri.SpatialReference,
    } as __esri.Extent;
  } else if (serverExtent) {
    result = serverExtent;
  }

  if (!result) {
    throw new HubError(
      "fetchExportImageDownloadFileUrl",
      "Extent required for this download operation"
    );
  }

  return result;
}
