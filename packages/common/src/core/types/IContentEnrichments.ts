import {
  IFeatureServiceDefinition,
  ILayerDefinition,
} from "@esri/arcgis-rest-feature-layer";

import { IItemEnrichments } from "./IItemEnrichments";

export interface IContentEnrichments extends IItemEnrichments {
  /** Information about the service referenced by this content (currentVersion, capabilities, maxRecordCount etc) */
  server?: Partial<IFeatureServiceDefinition>;

  /** Detailed information about the service's layers (geometryType, fields, etc) for related layers in the service */
  layers?: Array<Partial<ILayerDefinition>>;

  /** The count of records for the layer referenced by this content */
  recordCount?: number;
}
