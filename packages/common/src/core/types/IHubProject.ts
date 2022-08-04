import { IHubTimeline, IHubItemEntity } from "./index";
import { IWithLayout, IWithPermissions, IWithSlug } from "../traits/index";

/**
 * Defines the properties of a Hub Project object
 */
export interface IHubProject
  extends IHubItemEntity,
    IWithSlug,
    IWithLayout,
    IWithPermissions {
  /**
   * Timeline for the project
   */
  timeline?: IHubTimeline;
  /**
   * Project Status
   */
  status: "inactive" | "active";
}
