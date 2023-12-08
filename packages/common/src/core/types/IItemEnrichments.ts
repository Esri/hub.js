import { IUser, IPortal, IItem } from "@esri/arcgis-rest-portal";
import { IEnrichmentErrorInfo } from "../../types";

export interface IItemEnrichments {
  /**
   * Enable the item to be re-fetched so we get more props
   */
  item?: IItem;
  /** The portal item's data (if any) */
  data?: {
    [propName: string]: any;
  };

  /** The content's formal metadata */
  metadata?: any;

  /** The ids of any groups that the item belongs to */
  groupIds?: string[];

  /** The user that owns the item */
  ownerUser?: IUser;

  /**
   * The owner's organization (portal) details (id, name, extent, etc)
   */
  org?: Partial<IPortal>;

  /**
   * Any errors encountered when fetching enrichments
   * see https://github.com/ArcGIS/hub-indexer/blob/master/docs/errors.md#response-formatting-for-errors
   */
  errors?: IEnrichmentErrorInfo[];
}
