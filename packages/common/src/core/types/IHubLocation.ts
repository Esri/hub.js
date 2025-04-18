import type { ISpatialReference } from "../../rest/feature-service";
import { IHubLocationType } from "./types";
import { HubEntityType } from "./HubEntityType";
import { IGeometryInstance } from "../..";

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

  // NOTE: at next major release or breaking change we can probably remove the Partial here
  /** array of[geometries](https://developers.arcgis.com/javascript/latest/api-reference/esri-geometry-Geometry.html) representing the location */
  geometries?: Array<Partial<IGeometryInstance>>;

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
