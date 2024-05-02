import { ServiceDownloadFormat } from "../types";

/**
 * Formats supported by the /export endpoint of the Portal API.
 */
export const EXPORT_ITEM_FORMATS = [
  ServiceDownloadFormat.CSV,
  ServiceDownloadFormat.KML,
  ServiceDownloadFormat.SHAPEFILE,
  ServiceDownloadFormat.FILE_GDB,
  ServiceDownloadFormat.GEOJSON,
  ServiceDownloadFormat.EXCEL,
  ServiceDownloadFormat.FEATURE_COLLECTION,
] as const;

export type ExportItemFormat = (typeof EXPORT_ITEM_FORMATS)[number];

/**
 * Formats supported by the /exportImage endpoint of Image Services.
 */
export const EXPORT_IMAGE_FORMATS = [
  ServiceDownloadFormat.BIP,
  ServiceDownloadFormat.BMP,
  ServiceDownloadFormat.BSQ,
  ServiceDownloadFormat.GIF,
  ServiceDownloadFormat.JPG,
  ServiceDownloadFormat.JPG_PNG,
  ServiceDownloadFormat.LERC,
  ServiceDownloadFormat.PNG,
  ServiceDownloadFormat.PNG24,
  ServiceDownloadFormat.PNG32,
  ServiceDownloadFormat.PNG8,
  ServiceDownloadFormat.TIFF,
] as const;
export type ExportImageFormat = (typeof EXPORT_IMAGE_FORMATS)[number];

/**
 * Formats supported by the paging operation endpoint of the Hub Download API.
 */
export const HUB_PAGING_JOB_FORMATS = [
  ServiceDownloadFormat.CSV,
  ServiceDownloadFormat.GEOJSON,
  ServiceDownloadFormat.KML,
  ServiceDownloadFormat.SHAPEFILE,
] as const;
export type HubPagingJobFormat = (typeof HUB_PAGING_JOB_FORMATS)[number];

/**
 * Known formats supported by the /createReplica endpoint of the Hub Download API.
 * NOTE: this is may be incomplete and should be updated as needed.
 */
export const CREATE_REPLICA_FORMATS = [
  ServiceDownloadFormat.CSV,
  ServiceDownloadFormat.EXCEL,
  ServiceDownloadFormat.FEATURE_COLLECTION,
  ServiceDownloadFormat.FILE_GDB,
  ServiceDownloadFormat.GEOJSON,
  ServiceDownloadFormat.GEO_PACKAGE,
  ServiceDownloadFormat.JSON,
  ServiceDownloadFormat.SHAPEFILE,
  ServiceDownloadFormat.SQLITE,
] as const;
export type CreateReplicaFormat = (typeof CREATE_REPLICA_FORMATS)[number];
