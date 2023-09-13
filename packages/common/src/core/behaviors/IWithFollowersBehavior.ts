import { IGroup } from "@esri/arcgis-rest-types";
import { SettableAccessLevel } from "../types";

/**
 * Followers behavior for Item-Backed Entities
 */
export interface IWithFollowersBehavior {
  /**
   * Get the access level of the followers group
   */
  getFollowers(id: string): Promise<IGroup>;
  /**
   * Set the access level of the followers group
   */
  setFollowersAccess(access: SettableAccessLevel): Promise<void>;
}
