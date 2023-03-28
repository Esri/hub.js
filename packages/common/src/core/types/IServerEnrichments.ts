import {
  IFeatureServiceDefinition,
  ILayerDefinition,
} from "@esri/arcgis-rest-feature-layer";

export interface IServerEnrichments {
  /** Information about the service referenced by this content (currentVersion, capabilities, maxRecordCount etc) */
  server?: Partial<IFeatureServiceDefinition>;

  /** Detailed information about the service's layers (geometryType, fields, etc) for related layers in the service */
  layers?: Array<Partial<ILayerDefinition>>;

  // TODO: should we remove this once fetchContent() no longer fetches it?
  /** The count of records for the layer referenced by this content */
  recordCount?: number | null;

  /** If the server's services directory is disabled. See https://enterprise.arcgis.com/en/server/latest/administer/linux/disabling-the-services-directory.htm */
  servicesDirectoryDisabled?: boolean;
}
