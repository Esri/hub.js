import { IDynamicDownloadFormat } from "../../types";
import { HUB_FGDB_JOB_FORMATS } from "../_types";

/**
 * @private
 * Returns all the download formats that are available for the Hub Download API's fgdb job operation.
 * @returns available download formats for the fgdb job operation
 */
export function getFgdbJobFormats(): IDynamicDownloadFormat[] {
  return HUB_FGDB_JOB_FORMATS.map((format) => ({ type: "dynamic", format }));
}
