import { ISpatialReference } from "@esri/arcgis-rest-types";

export interface IHubLocation {
  filename: string;
  // Where did the location come from originally?
  // This is used in the location picker component to determine
  // what source was used
  provenance: "none" | "custom" | "existing";

  // the center of the location
  center?: number[];

  // the spatial reference of the location usuually WGS84
  spatialReference?: ISpatialReference;

  // the org spatial reference in case we have some custom org once
  orgSpatialReference?: ISpatialReference;

  // the extent of the location
  extent?: number[][];

  // An esri graphics layer: __esri.GraphicsLayer
  graphic?: any;

  // GeoJSON, for hub api search purposes
  geoJson?: any;
}
