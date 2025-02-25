import { IGroup } from "@esri/arcgis-rest-types";
import { SettableAccessLevel } from "../types";

/**
 * Followers behavior for Item-Backed Entities
 */
export interface IWithFollowersBehavior {
  /**
   * Get the followers group
   */
  getFollowersGroup(): Promise<IGroup>;
  /**
   * Set the access level of the followers group
   */
  setFollowersGroupAccess(access: SettableAccessLevel): Promise<void>;
  /**
   * Set whether or not the followers group is discussable
   */
  setFollowersGroupIsDiscussable(isDiscussable: boolean): Promise<void>;
}
