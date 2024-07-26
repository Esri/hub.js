import { IArcGISContext } from "../ArcGISContext";
import { IHubEditableContent } from "../core/types/IHubEditableContent";

/**
 * This hash map was defined to support the previous implementation of the export item flow.
 * We are currently working on a new implementation that will replace this hash map, but we
 * need to keep this around for now to support the existing implementation.
 */
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
  // Do we want to support Scene Packages?
  // scenePackage: {
  //   name: "Scene Package",
  //   itemTypes: ["Scene Package"],
  //   supportsProjection: ???,
  // },
};

// Keys that the legacy implementation of the export item flow uses to identify the export format.
export type LegacyExportItemFormat = keyof typeof PORTAL_EXPORT_TYPES;

/**
 * Comprehensive enum of all the download formats that are supported by service-backed items across the ArcGIS platform.
 */
export enum ServiceDownloadFormat {
  // Image Service Formats
  BMP = "bmp",
  GIF = "gif",
  JPG = "jpg",
  JPG_PNG = "jpgpng",
  PNG = "png",
  PNG8 = "png8",
  PNG24 = "png24",
  TIFF = "tiff",
  PNG32 = "png32", // 10.2+
  BIP = "bip", // 10.3+
  BSQ = "bsq", // 10.3+
  LERC = "lerc", // 10.3+

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

/**
 * Represents a file format related to a content entity that can be downloaded.
 * Formats can either be dynamic (i.e., generated on-the-fly) or static (i.e., pre-generated)
 */
export interface IDownloadFormat {
  type: "static" | "dynamic";
}

/**
 * Represents a static download format that is pre-generated and available for download.
 * If the format is a service-backed format, the `format` property will be set to the corresponding
 * service format. If the format is to an arbitrary static file, the `format` property should be undefined.
 */
export interface IStaticDownloadFormat extends IDownloadFormat {
  type: "static";
  format?: ServiceDownloadFormat;
  label: string;
  url: string;
}

/**
 * Extends the typical static download format, and is used
 * by `toStaticFormat` in `packages/common/src/downloads/fetchDownloadFormats.ts`
 */
export interface IAdditionalResourceDownloadFormat
  extends IStaticDownloadFormat {
  isDataSource: boolean;
}

/**
 * Represents a dynamic download format that is generated on-the-fly when requested.
 * The `format` property will be set to the corresponding service format.
 */
export interface IDynamicDownloadFormat extends IDownloadFormat {
  type: "dynamic";
  format: ServiceDownloadFormat;
}

/**
 * A callback function that is invoked to report the progress of a download operation.
 */
export type downloadProgressCallback = (
  status: DownloadOperationStatus,
  percent?: number // integer between 0 and 100
) => void;

/**
 * Options for refining / filtering the results of the fetchDownloadFile operation.
 */
export interface IFetchDownloadFileOptions {
  entity: IHubEditableContent;
  format: ServiceDownloadFormat;
  context: IArcGISContext;
  layers?: number[]; // layers to download; when not specified, all layers will be downloaded
  geometry?: __esri.Geometry; // geometry to filter results by
  where?: string; // where clause to filter results by
  progressCallback?: downloadProgressCallback;
  pollInterval?: number; // interval in milliseconds to poll for job completion
}

export type IFetchDownloadFileResponse =
  | IFetchDownloadFileBlobResponse
  | IFetchDownloadFileUrlResponse;

interface IBaseFetchDownloadFileResponse {
  type: "blob" | "url";
}

export interface IFetchDownloadFileBlobResponse
  extends IBaseFetchDownloadFileResponse {
  type: "blob";
  blob: Blob;
  filename: string;
}

export interface IFetchDownloadFileUrlResponse
  extends IBaseFetchDownloadFileResponse {
  type: "url";
  href: string;
}

/**
 * Human-readable status of a download operation. Operation specific statuses
 * should be converted to one of these statuses before being reported to the user.
 */
export enum DownloadOperationStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  CONVERTING = "converting",
  COMPLETED = "completed",
  FAILED = "failed",
}

/**
 * Options for fetching download formats for an entity.
 */
export interface IFetchDownloadFormatsOptions {
  entity: IHubEditableContent;
  context: IArcGISContext;
  layers?: number[];
}

/**
 * Options for instantiating an ArcgisHubDownloadError object.
 */
interface IArcgisHubDownloadErrorOptions {
  rawMessage: string; // raw error message
  messageId?: string; // well-known error message ID
  operation?: string; // operation that the error occurred in
}

/**
 * Error class for reporting well-known download errors that occur during the download process.
 */
export class ArcgisHubDownloadError extends Error {
  public messageId?: string; // well-known error message ID

  public operation?: string; // operation that the error occurred in

  constructor(options: IArcgisHubDownloadErrorOptions) {
    super(options.rawMessage);
    this.name = "ArcgisHubDownloadError";
    this.message = options.rawMessage;
    this.messageId = options.messageId;
    this.operation = options.operation;
  }
}
