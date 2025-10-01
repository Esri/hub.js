import { IGroup, IItem, IUser } from "@esri/arcgis-rest-portal";
import { HubFamily, IHubGeography } from "../../hub-types";
import { IOgcItem } from "../_internal/hubSearchItemsHelpers/interfaces";
import { IChannel, IPost } from "../../discussions/api/types";
import { IEvent, IRegistration } from "../../events/api/orval/api/orval-events";
import { IHubLocation } from "../../core/types/IHubLocation";
import { AccessLevel } from "../../core/types/types";
import { IHubEntityBase } from "../../core/types/IHubEntityBase";

/**
 * Standardized light-weight search result structure, applicable to all
 * types of search results - users, groups, content, events etc
 */
export interface IHubSearchResult extends IHubEntityBase {
  /**
   * Access level of the backing entity
   */
  access: AccessLevel;

  /**
   * Hub Family
   */
  family: HubFamily;

  /**
   * Owner; Applies to Items and Groups
   */
  owner?: string;

  /**
   * Tags; Applies to Items
   */
  tags?: string[];

  /**
   * Categories; Applies to Items
   */
  categories?: string[];

  /**
   * TypeKeywords; Applies to Items
   */
  typeKeywords?: string[];

  /**
   * @deprecated geometry is being dropped and replaced
   * with 'location' for all location specific information
   * on a search result
   *
   * Geometry connected to this entity
   * For items, it will default to the extent,
   * but may be derived from a boundary resource
   * or the extent of a layer
   */
  geometry?: IHubGeography;

  /**
   * Custom location defined on the item
   * properties (item.properties.location),
   * typically created in details pane of entity
   * workspace.
   */
  location?: IHubLocation;

  /**
   * Raw result object returned from the search.
   * This allows downstream processing to access
   * additional properties that may not be
   * explicitly defined in this interface
   * Note: We will need to cast to the approproate type
   * in order to access the properties
   */
  rawResult?:
    | IItem
    | IGroup
    | IUser
    | IOgcItem
    | IChannel
    | IEvent
    | IRegistration
    | IPost;

  /** Allow any additional properties to be added */
  [key: string]: any;
}
