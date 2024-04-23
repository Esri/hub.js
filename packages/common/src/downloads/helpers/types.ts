import { IArcGISContext } from "../../ArcGISContext";
import { IHubEditableContent } from "../../core/types/IHubEditableContent";

// ugh, where was this originally? I would love to change this to align better with the other formats.
export const PORTAL_EXPORT_TYPES = {
  csv: {
    name: "CSV",
    itemTypes: ["CSV", "CSV Collection"],
    supportsProjection: true,
  },
  kml: {
    name: "KML",
    itemTypes: ["KML", "KML Collection"],
    supportsProjection: false,
  },
  shapefile: {
    name: "Shapefile",
    itemTypes: ["Shapefile"],
    supportsProjection: true,
  },
  fileGeodatabase: {
    name: "File Geodatabase",
    itemTypes: ["File Geodatabase"],
    supportsProjection: true,
  },
  geojson: {
    name: "GeoJson",
    itemTypes: ["GeoJson"],
    supportsProjection: false,
  },
  excel: {
    name: "Excel",
    itemTypes: ["Microsoft Excel"],
    supportsProjection: true,
  },
  featureCollection: {
    name: "Feature Collection",
    itemTypes: ["Feature Collection"],
    supportsProjection: true,
  },
  // Do we want to support these?
  // scenePackage: {
  //   name: "Scene Package",
  //   itemTypes: ["Scene Package"],
  //   supportsProjection: ???,
  // },
};
export type LegacyExportItemFormat = keyof typeof PORTAL_EXPORT_TYPES;

export enum ServiceDownloadFormat {
  // Image Service Formats
  BIP = "bip", // 10.3+
  BMP = "bmp",
  BSQ = "bsq", // 10.3+
  GIF = "gif",
  JPG = "jpg",
  JPG_PNG = "jpgpng",
  LERC = "lerc", // 10.3+
  PNG = "png",
  PNG8 = "png8",
  PNG24 = "png24",
  PNG32 = "png32", // 10.2+
  TIFF = "tiff",

  // Map & Feature Service Formats
  CSV = "csv",
  EXCEL = "excel",
  FEATURE_COLLECTION = "featureCollection",
  FILE_GDB = "filegdb",
  GEOJSON = "geojson",
  GEO_PACKAGE = "geoPackage",
  JSON = "json",
  KML = "kml",
  SHAPEFILE = "shapefile",
  SQLITE = "sqlite",
}

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

export const HUB_PAGING_JOB_FORMATS = [
  ServiceDownloadFormat.CSV,
  ServiceDownloadFormat.GEOJSON,
  ServiceDownloadFormat.KML,
  ServiceDownloadFormat.SHAPEFILE,
] as const;

export type HubPagingJobFormat = (typeof HUB_PAGING_JOB_FORMATS)[number];

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

export interface IDownloadFormat {
  type: "static" | "dynamic";
}

export interface IStaticDownloadFormat extends IDownloadFormat {
  type: "static";
  format?: ServiceDownloadFormat;
  label: string;
  url: string;
}

export interface IDynamicDownloadFormat extends IDownloadFormat {
  type: "dynamic";
  format: ServiceDownloadFormat;
}

export type downloadProgressCallback = (
  status: DownloadOperationStatus,
  percent?: number // integer between 0 and 100
) => void;

export interface IFetchDownloadFileUrlOptions {
  entity: IHubEditableContent;
  format: ServiceDownloadFormat;
  context: IArcGISContext;
  layers?: number[]; // layers to download; when not specified, all layers will be downloaded
  geometry?: any; // geometry to filter results by
  where?: string; // where clause to filter results by
  progressCallback?: downloadProgressCallback;
}

export enum DownloadOperationStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  CREATING = "creating",
  COMPLETED = "completed",
  FAILED = "failed",
}

export interface IFetchDownloadFormatsOptions {
  entity: IHubEditableContent;
  context: IArcGISContext;
  layers?: number[];
}

export interface IArcgisHubDownloadErrorOptions {
  rawMessage: string;
  messageId?: string;
  operation?: string;
}

export class ArcgisHubDownloadError extends Error {
  public messageId?: string;

  public operation?: string;

  constructor(options: IArcgisHubDownloadErrorOptions) {
    super(options.rawMessage);
    this.name = "ArcgisHubDownloadError";
    this.messageId = options.messageId;
    this.operation = options.operation;
  }
}
