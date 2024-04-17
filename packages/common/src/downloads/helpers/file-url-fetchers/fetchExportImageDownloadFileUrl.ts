import { request } from "@esri/arcgis-rest-request";
import { IFetchDownloadFileUrlOptions } from "../types";

export async function fetchExportImageDownloadFileUrl(
  options: IFetchDownloadFileUrlOptions
): Promise<string> {
  const { entity, format, context, geometry } = options;

  // TODO: validate layers, geometry, where, etc. I don't think all of them are applicable in every permutation

  const requestOptions = { ...context.requestOptions };
  requestOptions.httpMethod = "GET";
  requestOptions.params = {
    format,
    mosaicRule:
      '{"ascending":true,"mosaicMethod":"esriMosaicNorthwest","mosaicOperation":"MT_FIRST"}',
  };

  if (geometry) {
    const { xmin, xmax, ymin, ymax } = geometry;
    const { wkid } = geometry.spatialReference;
    requestOptions.params.bbox = `${xmin},${ymin},${xmax},${ymax}`;
    requestOptions.params.bboxSR = `${wkid}`;
    requestOptions.params.imageSR = `${wkid}`;
  }
  // // Note: validate where "extent" and "layer" are coming from in the old ember code,
  // // check if they are still applicable here
  // else {
  //   const coords = this.args.model.extent;
  //   requestOptions.params.bbox = `${coords[0][0]},${coords[0][1]},${coords[1][0]},${coords[1][1]}`;
  //   requestOptions.params.bboxSR = '4326';
  //   requestOptions.params.imageSR = '4326';
  // }

  // const { maxImageHeight, maxImageWidth } = this.args.model.layer || {};
  // if (maxImageWidth && maxImageHeight) {
  //   requestOptions.params.size = `${maxImageWidth},${maxImageHeight}`;
  // }

  const { href } = await request(`${entity.url}/exportImage`, requestOptions);
  return href;
}
