import { FeatureLayerStyle } from "../enums/featureLayerStyle";

/**
 * Interface for Hub Map settings.  Used to configure the map for an entity.
 */
export interface IHubMapSettings {
  // the item id for the map or scene
  // this is an array to support integration with the gallery picker
  baseViewItemId: string[];
  // the feature layer style to use when rendering the data on a map
  featureLayerStyle?: FeatureLayerStyle;
}
