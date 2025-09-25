import type { IExtent } from "@esri/arcgis-rest-feature-service";
import { request } from "@esri/arcgis-rest-request";
import {
  DownloadOperationStatus,
  IFetchDownloadFileOptions,
  IFetchDownloadFileResponse,
  ServiceDownloadFormat,
} from "../../types";
import HubError from "../../../HubError";
import { getProp } from "../../../objects/get-prop";
import { ExportImageFormat } from "../_types";
import { IHubEditableContent } from "../../../core/types/IHubEditableContent";
import { ISpatialReferenceInstance } from "../../../core/types/ISpatialReferenceInstance";

/**
 * Extent object with a spatial reference instance defined
 */
interface IExtentWithSpatialReference extends IExtent {
  spatialReference: ISpatialReferenceInstance;
}

/**
 * @private
 *
 * Fetches a download file url from an Image Service via the exportImage endpoint.
 *
 * @param options options for refining / filtering the resulting download file
 * @returns a blob containing the download file
 */
export async function fetchExportImageDownloadFile(
  options: IFetchDownloadFileOptions
): Promise<IFetchDownloadFileResponse> {
  validateOptions(options);

  const { entity, format, context, progressCallback } = options;
  progressCallback && progressCallback(DownloadOperationStatus.PENDING);

  const extent = getExportImageExtent(options);
  const { xmin, xmax, ymin, ymax } = extent;
  // TODO: do we need to handle latestWkid as well?
  const { wkid } = extent.spatialReference;

  const requestOptions = { ...context.requestOptions };
  requestOptions.httpMethod = "GET";
  requestOptions.params = {
    bbox: `${xmin},${ymin},${xmax},${ymax}`,
    bboxSR: `${wkid}`,
    f: "image",
    format,
    mosaicRule:
      '{"ascending":true,"mosaicMethod":"esriMosaicNorthwest","mosaicOperation":"MT_FIRST"}',
  };

  // TODO: Figure out whether we want to leverage the server's maxImageWidth and maxImageHeight.
  // While it results in higher quality images, it also creates a lot of variability in the result
  // when we filter an image by extent.
  //
  // const { maxImageHeight, maxImageWidth } =
  //   getProp(entity, "extendedProps.server") || {};
  // if (maxImageWidth && maxImageHeight) {
  //   requestOptions.params.size = `${maxImageWidth},${maxImageHeight}`;
  // }

  const blob: Blob = await request(`${entity.url}/exportImage`, requestOptions);
  return {
    type: "blob",
    blob,
    filename: getBlobFilename(entity, format as ExportImageFormat),
  };
}

function validateOptions(options: IFetchDownloadFileOptions) {
  const { geometry } = options;

  if (geometry && geometry.type !== "extent") {
    throw new HubError(
      "fetchExportImageDownloadFileUrl",
      "Only extent geometric filters are supported for this type of download"
    );
  }
}

function getExportImageExtent(options: IFetchDownloadFileOptions) {
  const { entity, geometry } = options;
  const serverExtent = getProp(
    entity,
    "extendedProps.server.extent"
  ) as IExtentWithSpatialReference;

  // TODO: Factor in entity.extent if it exists AND is a valid 4326 bbox
  let result: IExtentWithSpatialReference = null;
  if (geometry) {
    // NOTE: we already confirmed that geometry is an extent in validateOptions
    result = geometry as unknown as IExtentWithSpatialReference;
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

function getBlobFilename(
  entity: IHubEditableContent,
  format: ExportImageFormat
): string {
  const name =
    entity.name || (getProp(entity, "extendedProps.server.name") as string);
  const extension = format.includes(ServiceDownloadFormat.PNG)
    ? // NOTE: the png family of formats (png8, png24, etc.) share the same extension
      ServiceDownloadFormat.PNG
    : format;
  return `${name}.${extension}`;
}
