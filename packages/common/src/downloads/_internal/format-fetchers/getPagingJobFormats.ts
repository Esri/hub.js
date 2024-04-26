import { IDynamicDownloadFormat } from "../../types";
import { HUB_PAGING_JOB_FORMATS } from "../_types";

/**
 * @private
 * Returns all the download formats that are available for the Hub Download API's paging job operation.
 * @returns available download formats for the paging job operation
 */
export function getPagingJobFormats(): IDynamicDownloadFormat[] {
  return HUB_PAGING_JOB_FORMATS.map((format) => ({ type: "dynamic", format }));
}
