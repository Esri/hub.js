import { EXPORT_ITEM_FORMATS, IDynamicDownloadFormat } from "../types";

/**
 * @private
 * Returns all the download formats that are available via the Portal API's item /export endpoint.
 */
export function getAllExportItemFormats(): IDynamicDownloadFormat[] {
  return EXPORT_ITEM_FORMATS.map((format) => ({
    type: "dynamic",
    format,
  }));
}
