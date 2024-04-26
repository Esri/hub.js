import { request } from "@esri/arcgis-rest-request";
import {
  DownloadOperationStatus,
  IFetchDownloadFileUrlOptions,
} from "../../types";

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
  const { entity, format, context, geometry, progressCallback } = options;
  progressCallback && progressCallback(DownloadOperationStatus.PENDING);

  // TODO: validate layers, geometry, where, etc. I don't think all of them are applicable in every permutation

  const requestOptions = { ...context.requestOptions };
  requestOptions.httpMethod = "GET";
  requestOptions.params = {
    f: "image",
    format,
    mosaicRule:
      '{"ascending":true,"mosaicMethod":"esriMosaicNorthwest","mosaicOperation":"MT_FIRST"}',
  };

  if (geometry && geometry.type === "extent") {
    const { xmin, xmax, ymin, ymax } = geometry as __esri.Extent;
    const { wkid } = geometry.spatialReference;
    requestOptions.params.bbox = `${xmin},${ymin},${xmax},${ymax}`;
    requestOptions.params.bboxSR = `${wkid}`;
    requestOptions.params.imageSR = `${wkid}`;
  }
  // Note: validate where "extent" and "layer" are coming from in the old ember code,
  // check if they are still applicable here
  else {
    const coords = entity.extent;
    requestOptions.params.bbox = `${coords[0][0]},${coords[0][1]},${coords[1][0]},${coords[1][1]}`;
    requestOptions.params.bboxSR = "4326";
    requestOptions.params.imageSR = "4326";
  }

  // const { maxImageHeight, maxImageWidth } = this.args.model.layer || {};
  // if (maxImageWidth && maxImageHeight) {
  //   requestOptions.params.size = `${maxImageWidth},${maxImageHeight}`;
  // }

  const blob = await request(`${entity.url}/exportImage`, requestOptions);
  const url = URL.createObjectURL(blob);
  progressCallback && progressCallback(DownloadOperationStatus.COMPLETED);
  return url;
}
