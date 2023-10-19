import { IWithEntitySettings } from "./IWithEntitySettings";
import { IDiscussionsSettings } from "../../discussions";

/**
 * Discussions-related entity settings
 */
export interface IWithDiscussionsSettings extends IWithEntitySettings {
  discussionSettings: IDiscussionsSettings;
}
