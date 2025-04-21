// TODO: make @esri/arcgis-rest-feature-service a restricted import
// see https://palantir.github.io/tslint/rules/import-blacklist/

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
  getAllLayersAndTables,
  parseServiceUrl,
} from "@esri/arcgis-rest-feature-service";

// re-export wrappers
export * from "./wrappers";
