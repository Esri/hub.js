import { IHubTimeline } from ".";
import { IHubEntityItemBase, IWithLayout, IWithSlug } from "..";

/**
 * Defines the properties of a Hub Project object
 */
export interface IHubProject
  extends IHubEntityItemBase,
    IWithSlug,
    IWithLayout {
  /**
   * Timeline for the project
   */
  timeline?: IHubTimeline;
  /**
   * Project Status
   */
  status: "inactive" | "active";
}
