import { IDiscussionsSettings } from "../../discussions/api/types";
import { IWithEntitySettings } from "./IWithEntitySettings";

/**
 * Discussions-related properties
 */
export interface IWithDiscussions extends IWithEntitySettings {
  /**
   * If the item has discussions enabled
   */
  isDiscussable?: boolean;

  /**
   * The entity's discussion settings
   */
  discussionSettings?: IDiscussionsSettings;
}
