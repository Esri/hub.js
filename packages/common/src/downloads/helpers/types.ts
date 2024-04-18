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
// Should these all be enums?
export type ExportItemFormat = keyof typeof PORTAL_EXPORT_TYPES;

export type ExportImageFormat =
  | "jpgpng"
  | "png"
  | "png8"
  | "png24"
  | "jpg"
  | "bmp"
  | "gif"
  | "tiff"
  | "png32"
  | "bip"
  | "bsq"
  | "lerc";

export type HubPagingJobFormat = "csv" | "shapefile" | "kml" | "geojson";

// This is an incomplete list from the docs
export type CreateReplicaFormat =
  | "sqlite"
  | "filegdb"
  | "shapefile"
  | "json"
  | "csv"
  | "geojson"
  | string;

export interface IDownloadFormat {
  type: "static" | "dynamic";
}

export interface IStaticDownloadFormat extends IDownloadFormat {
  type: "static";
  format?: string;
  label: string;
  url: string;
}

export interface IDynamicDownloadFormat extends IDownloadFormat {
  type: "dynamic";
  format: string;
}

export type downloadProgressCallback = (
  status: DownloadOperationStatus,
  percent?: number
) => void;

export interface IFetchDownloadFileUrlOptions {
  entity: IHubEditableContent;
  format: string;
  context: IArcGISContext;
  layers?: number[]; // layers to download; when not specified, all layers will be downloaded
  geometry?: any; // geometry to filter results by
  where?: string; // where clause to filter results by
  progressCallback?: downloadProgressCallback;
}

// TODO: Should this be an enum?
export type DownloadOperationStatus =
  | "pending"
  | "processing"
  | "creating"
  | "completed"
  | "failed";

export interface IFetchDownloadFormatsOptions {
  entity: IHubEditableContent;
  context: IArcGISContext;
  layers?: number[];
}
