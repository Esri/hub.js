import {
  IWithLayout,
  IWithPermissions,
  IWithSlug,
  IWithCatalog,
} from "../traits/index";
import { IHubItemEntity } from "./IHubItemEntity";
import { IHubTimeline } from "./IHubTimeline";

/**
 * Defines the properties of a Hub Project object
 */
export interface IHubProject
  extends IHubItemEntity,
    IWithSlug,
    IWithCatalog,
    IWithLayout,
    IWithPermissions {
  status: PROJECT_STATUSES;
}

export enum PROJECT_STATUSES {
  notStarted = "notStarted",
  inProgress = "inProgress",
  complete = "complete",
}
