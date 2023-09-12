import { AccessLevel, SettableAccessLevel } from "../types";

/**
 * Followers behavior for Item-Backed Entities
 */
export interface IWithFollowersBehavior {
  /**
   * Get the access level of the followers group
   */
  getFollowersGroupAccess(id: string): Promise<AccessLevel>;
  /**
   * Set the access level of the followers group
   */
  setFollowersGroupAccess(access: SettableAccessLevel): Promise<void>;
}
