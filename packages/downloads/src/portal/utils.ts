import { IItem } from "@esri/arcgis-rest-types";
import { getProp } from "@esri/hub-common";
import { DownloadFormat } from "../download-format";

/**
 * @private
 */
export function isDownloadEnabled(
  item: IItem,
  format: DownloadFormat
): boolean {
  const lowercasedFormat = format ? format.toLowerCase() : "";
  const isItemLevelDownloadEnabled =
    getProp(item, "properties.downloadsConfig.enabled") !== false;
  const formats = getProp(item, "properties.downloadsConfig.formats") || {};
  const isFormatDownloadEnabled =
    !formats[lowercasedFormat] || formats[lowercasedFormat].enabled !== false;
  return isItemLevelDownloadEnabled ? isFormatDownloadEnabled : false;
}
