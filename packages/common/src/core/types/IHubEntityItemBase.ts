import { IGeometry } from "@esri/arcgis-rest-types";
import { IHubEntityBase } from "./IHubEntityBase";

// Things that are backed by items

export interface IHubEntityItemBase extends IHubEntityBase {
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
   * Url for the item
   */
  url?: string;
  /**
   * User configurable tags
   */
  tags?: string[];
  /**
   * System configurable typekeywords
   */
  typeKeywords?: string[];
}
