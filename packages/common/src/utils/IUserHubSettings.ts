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
   * Features that are enabled for the user in preview mode
   */
  preview?: {
    /**
     * Enable the workspace feature
     */
    workspace: boolean;
  };
  /**
   * Optional history of sites/content the user has visited
   */
  history?: IHubHistory;
}
