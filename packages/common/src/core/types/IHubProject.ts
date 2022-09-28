import { IHubTimeline, IHubItemEntity } from "./index";
import { IWithLayout, IWithPermissions, IWithSlug } from "../traits/index";
import { IWithCatalog } from "../traits/IWithCatalog";

/**
 * Defines the properties of a Hub Project object
 */
export interface IHubProject
  extends IHubItemEntity,
    IWithSlug,
    IWithCatalog,
    IWithLayout,
    IWithPermissions {
  /**
   * Timeline for the project
   */
  timeline?: IHubTimeline;
  /**
   * Project Status
   */
  status: "notStarted" | "inProgress" | "complete";
}
