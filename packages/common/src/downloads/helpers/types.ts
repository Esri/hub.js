import { IArcGISContext } from "../../ArcGISContext";
import { IHubEditableContent } from "../../core/types/IHubEditableContent";

export interface IDownloadFormat {
  type: "static" | "dynamic";
}

export interface IStaticDownloadFormat extends IDownloadFormat {
  type: "static";
  label: string;
  url: string;
}

export interface IDynamicDownloadFormat extends IDownloadFormat {
  type: "dynamic";
  format: string;
}

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
};

export interface IFetchDownloadFileUrlOptions {
  entity: IHubEditableContent;
  format: string;
  context: IArcGISContext;
  layers?: number[]; // layers to download; when not specified, all layers will be downloaded
  geometry?: any; // geometry to filter results by
  where?: string; // where clause to filter results by
  progressCallback?: (state: DownloadOperationState, percent?: number) => void;
}

export type DownloadOperationState =
  | "pending"
  | "processing"
  | "creating"
  | "complete";
