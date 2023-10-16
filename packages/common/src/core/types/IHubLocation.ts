import { ISpatialReference } from "@esri/arcgis-rest-types";
import { IHubLocationType } from "./types";
import { HubEntityType } from "./HubEntityType";

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

  // array of geometries representing the location
  // NOTE: we use partial here b/c __esri.Geometry
  // is the type for instances and includes methods, etc
  // but we want to be able to pass around POJOs as well as instances
  // instead, we might want to use __esri.GeometryProperties or
  // a discriminated union of the point, line, polygon, and extent _property_ types
  // but for now it is a non-breaking change to relax __esri.Geometry w/ a partial
  geometries?: Array<Partial<__esri.Geometry>>;

  // DEPRECATED: the following will be removed at next breaking version
  provenance?: "none" | "custom" | "existing";
  center?: number[];
  orgSpatialReference?: ISpatialReference;
  graphic?: any;
  geoJson?: any;
}

/**
 * Location options for the location picker
 */
export interface IHubLocationOption {
  /** Whether or not this option is selected initially */
  selected?: boolean;
  // The label that appears in the calcite-list
  label: string;
  // The description that appears in the calcite-list
  description?: string;
  // The location
  location: IHubLocation;
  // What type of entity is it?
  // used for alert box in the location picker
  entityType?: HubEntityType;
}
