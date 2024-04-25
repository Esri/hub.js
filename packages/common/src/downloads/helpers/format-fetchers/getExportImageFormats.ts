import { IDynamicDownloadFormat } from "../types";

/**
 * @private
 * Returns all the download formats that are exposed by Image Services via the /exportImage operation.
 *
 * NOTE: This function is a work-in-progress. Various permissions and logic branches are not yet implemented.
 */
export function getExportImageDownloadFormats(): IDynamicDownloadFormat[] {
  throw new Error("Not implemented");
  // return EXPORT_IMAGE_FORMATS.map((format) => ({ type: "dynamic", format }));
}
