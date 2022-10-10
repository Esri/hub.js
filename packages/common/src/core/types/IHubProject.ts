import { IHubTimeline, IHubItemEntity, IHubProjectView } from "./index";
import {
  IWithLayout,
  IWithPermissions,
  IWithSlug,
  IWithCatalog,
} from "../traits/index";

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
  status: PROJECT_STATUSES;
  /**
   * Project display properties
   */
  view?: IHubProjectView;
}

export enum PROJECT_STATUSES {
  notStarted = "notStarted",
  inProgress = "inProgress",
  complete = "complete",
}
