import { IHubTimeline } from ".";
import { IHubItemEntity, IWithLayout, IWithSlug } from "..";

/**
 * Defines the properties of a Hub Project object
 */
export interface IHubProject extends IHubItemEntity, IWithSlug, IWithLayout {
  /**
   * Timeline for the project
   */
  timeline?: IHubTimeline;
  /**
   * Project Status
   */
  status: "inactive" | "active";
}
