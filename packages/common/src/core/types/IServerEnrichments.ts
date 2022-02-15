import {
  IFeatureServiceDefinition,
  ILayerDefinition,
} from "@esri/arcgis-rest-feature-layer";

export interface IServerEnrichments {
  /** Information about the service referenced by this content (currentVersion, capabilities, maxRecordCount etc) */
  server?: Partial<IFeatureServiceDefinition>;

  /** Detailed information about the service's layers (geometryType, fields, etc) for related layers in the service */
  layers?: Array<Partial<ILayerDefinition>>;

  /** The count of records for the layer referenced by this content */
  recordCount?: number;
}

// DEPRECATED: remove this alias at the next breaking change
// tslint:disable-next-line
export interface IContentEnrichments extends IServerEnrichments {}
