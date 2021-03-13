import { getProp } from "@esri/hub-common";
import { DownloadFormat } from "../download-format";
import { DownloadTarget } from "../download-target";

const DOWNLOADS_LOCK_MS = 10 * 60 * 1000;
import { IItem } from "@esri/arcgis-rest-types";

/**
 * @private
 */
export function isRecentlyUpdated(
  target: DownloadTarget,
  lastEditDate: number
): boolean {
  return (
    target === "portal" &&
    lastEditDate &&
    new Date().getTime() - lastEditDate <= DOWNLOADS_LOCK_MS
  );
}

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
