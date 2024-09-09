import { IDownloadFormatConfiguration } from "../../../core/types/IHubEditableContent";

/**
 * @private
 * Determines if the given download format configuration is for
 * an additional resource.
 *
 * @param config IDownloadFormatConfiguration
 * @returns boolean
 */
export function isAdditionalResourceConfiguration(
  config: IDownloadFormatConfiguration
): boolean {
  return config.key.startsWith("additionalResource::");
}

/**
 * @private
 * Get's the index of the additional resource from the given
 * download format configuration.
 *
 * @param config IDownloadFormatConfiguration
 * @returns number - The index of the additional resource
 */
export function getAdditionalResourceIndex(
  config: IDownloadFormatConfiguration
): number {
  return parseInt(config.key.split("::")[1], 10);
}
