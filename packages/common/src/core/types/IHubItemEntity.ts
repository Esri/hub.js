import { IGeometry } from "@esri/arcgis-rest-types";
import { IHubEntityBase } from "./IHubEntityBase";

/**
 * Properties exposed by Entities that are backed by Items
 */
export interface IHubItemEntity extends IHubEntityBase {
  /**
   * Thumbnail Uril (read-only)
   */
  readonly thumbnailUrl: string;
  /**
   * Owner of the item (read-only)
   */
  readonly owner?: string;
  /**
   * Description for the item
   */
  description: string;
  /**
   * Boundary. Either the item's extent or an `IGeometry`
   * loaded from a resource
   */
  boundary?: number[][] | IGeometry;
  /**
   * Culture code of the content
   * i.e. `en-us`
   */
  culture?: string;

  /**
   * User configurable tags
   */
  tags?: string[];
  /**
   * System configurable typekeywords
   */
  typeKeywords?: string[];
  /**
   * Canonical Url for the Entity
   */
  url?: string;
}
