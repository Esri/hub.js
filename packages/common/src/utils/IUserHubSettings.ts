import { IHubHistory } from "../core/hubHistory";

/**
 * Hub Level Settings
 */

export interface IUserHubSettings {
  schemaVersion: number;
  username?: string;
  updated?: number;
  /**
   * Track notices the user has dismissed
   * stored as an object so we can add more types in the future
   */
  notices?: {
    /**
     * Ids of notices the user has dismissed
     */
    dismissed?: string[];
  };

  /**
   * Allow features to be opted in or out of
   */
  features?: {
    workspace?: boolean;
  };
  /**
   * Optional history of sites/content the user has visited
   */
  history?: IHubHistory;
}
