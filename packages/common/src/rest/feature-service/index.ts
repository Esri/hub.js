/* tslint:disable:import-blacklist */
// add type re-exports here as needed
export type {
  IExtent,
  IFeature,
  IFeatureServiceDefinition,
  IGeometry,
  IGetLayerOptions,
  ISpatialReference,
  ILayerDefinition,
  IField,
  IStatisticDefinition,
  IQueryFeaturesOptions,
  IQueryFeaturesResponse,
  IQueryResponse,
} from "@esri/arcgis-rest-feature-service";

// add re-exports for functions that are not spied on here as needed
export {
  addAttachment,
  addFeatures,
  deleteAttachments,
  deleteFeatures,
  getAllLayersAndTables,
  getAttachments,
  getFeature,
  parseServiceUrl,
  updateAttachment,
  updateFeatures,
} from "@esri/arcgis-rest-feature-service";

// re-export wrappers
export * from "./wrappers";
