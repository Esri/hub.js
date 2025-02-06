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
  // NOTE: we use any here b/c it's silly to add @arcgis/core
  // just to get the Geometry type, which is basically an any anyway
  // and as of 4.32 next we see (non-fatal) TS errors when running karma tests
  // but for now it is a non-breaking change to relax Geometry to any
  geometries?: any[];

  /** The name of the location */
  name?: string;
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
