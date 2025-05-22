import { ISpatialReferenceInstance } from "./ISpatialReferenceInstance.js";

// NOTE: we define our own interface for geometry b/c
// adding @arcgis/core just to get the Geometry type causes problems, for example:
// as of the 4.32 RC we see (non-fatal) TS errors when running karma tests
/**
 * An instance of the [Geometry](https://developers.arcgis.com/javascript/latest/api-reference/esri-geometry-Geometry.html) class
 *
 * NOTE: this interface only defines the properties needed by this package
 */
export interface IGeometryInstance {
  /**
   * The spatial reference of the geometry.
   *
   * @default SpatialReference.WGS84 // wkid: 4326
   *
   * [Read more...](https://developers.arcgis.com/javascript/latest/api-reference/esri-geometry-Geometry.html#spatialReference)
   */
  spatialReference: ISpatialReferenceInstance;
  /**
   * The geometry type.
   *
   * [Read more...](https://developers.arcgis.com/javascript/latest/api-reference/esri-geometry-Geometry.html#type)
   */
  readonly type:
    | "point"
    | "multipoint"
    | "polyline"
    | "polygon"
    | "extent"
    | "mesh";
  /**
   * Converts an instance of this class to its [ArcGIS portal JSON](https://developers.arcgis.com/documentation/common-data-types/geometry-objects.htm) representation.
   *
   * [Read more...](https://developers.arcgis.com/javascript/latest/api-reference/esri-core-JSONSupport.html#toJSON)
   */
  toJSON(): any;
}
