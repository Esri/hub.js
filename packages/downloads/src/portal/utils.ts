import { DownloadTarget } from "../download-target";

const DOWNLOADS_LOCK_MS = 10 * 60 * 1000;

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
