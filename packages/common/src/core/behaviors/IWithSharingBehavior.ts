import { IGetItemGroupsResponse, IGroup } from "@esri/arcgis-rest-portal";
import { AccessLevel } from "../types";

/**
 * Sharing behavior for Item-Backed Entities
 */
export interface IWithSharingBehavior {
  /**
   * Share the item with the specified group
   * @param groupId
   */
  shareWithGroup(groupId: string): Promise<void>;
  /**
   * Unshare the item with the specified group
   * @param groupId
   */
  unshareWithGroup(groupId: string): Promise<void>;
  /**
   * Set the access level for the item
   * @param access
   */
  setAccess(access: AccessLevel): Promise<void>;
  /**
   * Get the list of groups that the item is shared to.
   * Limited to Groups that the user has access to
   */
  sharedWith(useCache: boolean): Promise<IGroup[]>;
}
