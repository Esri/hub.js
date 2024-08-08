import { ServiceDownloadFormat } from "../types";

/**
 * Formats supported by the /exportImage endpoint of Image Services.
 * Listed in the default order of appearance in the UI.
 */
export const EXPORT_IMAGE_FORMATS = [
  // Temporary exclusion until we hammer out the details of how to support it.
  // Unlike jpg or png, tiff downloads require exact geospatial parameters to be set.
  // ServiceDownloadFormat.TIFF,

  ServiceDownloadFormat.JPG,
  ServiceDownloadFormat.PNG,
  ServiceDownloadFormat.PNG8,
  ServiceDownloadFormat.PNG24,
  ServiceDownloadFormat.PNG32, // 10.2+

  // Used mainly by the JS API. Has bespoke behavior that users may not expect, could be added later.
  // ServiceDownloadFormat.JPG_PNG,

  // Difficult to support due to complexities of image services, could be added later
  // ServiceDownloadFormat.BIP, // 10.3+
  // ServiceDownloadFormat.BMP,
  // ServiceDownloadFormat.BSQ, // 10.3+
  // ServiceDownloadFormat.GIF,
  // ServiceDownloadFormat.LERC,
] as const;
export type ExportImageFormat = (typeof EXPORT_IMAGE_FORMATS)[number];

/**
 * Formats supported by the paging operation endpoint of the Hub Download API.
 * Listed in the default order of appearance in the UI.
 */
export const HUB_PAGING_JOB_FORMATS = [
  ServiceDownloadFormat.CSV,
  ServiceDownloadFormat.SHAPEFILE,
  ServiceDownloadFormat.GEOJSON,
  ServiceDownloadFormat.KML,
] as const;
export type HubPagingJobFormat = (typeof HUB_PAGING_JOB_FORMATS)[number];

/**
 * Known formats supported by the /createReplica endpoint of the Hub Download API.
 * Listed in the default order of appearance in the UI.
 * NOTE: this is may be incomplete and should be updated as needed.
 */
export const CREATE_REPLICA_FORMATS = [
  ServiceDownloadFormat.CSV,
  ServiceDownloadFormat.SHAPEFILE,
  ServiceDownloadFormat.GEOJSON,
  ServiceDownloadFormat.KML,
  ServiceDownloadFormat.FILE_GDB,
  ServiceDownloadFormat.FEATURE_COLLECTION,
  ServiceDownloadFormat.EXCEL,
  ServiceDownloadFormat.GEO_PACKAGE,
  ServiceDownloadFormat.SQLITE,
  ServiceDownloadFormat.JSON,
] as const;
export type CreateReplicaFormat = (typeof CREATE_REPLICA_FORMATS)[number];
