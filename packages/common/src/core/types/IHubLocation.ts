import { ISpatialReference } from "@esri/arcgis-rest-types";
import { IHubLocationType } from "./types";

/**
 * A location associated with an item and stored as a json resource.
 */
export interface IHubLocation {
  // Where did the location come from originally?
  // This is used in the location picker component to determine
  // what source was used
  type: IHubLocationType;

  // the spatial reference of the location usuually WGS84
  spatialReference?: ISpatialReference;

  // the extent of the location
  extent?: number[][];

  // An esri geometry: __esri.Geometry
  geometries?: __esri.Geometry[];

  // DEPRECATED: the following will be removed at next breaking version
  provenance?: "none" | "custom" | "existing";
  center?: number[];
  orgSpatialReference?: ISpatialReference;
  graphic?: any;
  geoJson?: any;
}
