import { IHubTimeline, IHubItemEntity } from "./index";
import {
  IWithLayout,
  IWithPermissions,
  IWithSlug,
  IWithCatalog,
  IWithContent,
} from "../traits/index";
import { IGallerySelection } from "../../search";

/**
 * Defines the properties of a Hub Project object
 */
export interface IHubProject
  extends IHubItemEntity,
    IWithSlug,
    IWithCatalog,
    IWithContent,
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

  content: IGallerySelection;
}

export enum PROJECT_STATUSES {
  notStarted = "notStarted",
  inProgress = "inProgress",
  complete = "complete",
}
