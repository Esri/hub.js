import {
  IWithLayout,
  IWithPermissions,
  IWithSlug,
  IWithCatalog,
  IWithMetrics,
} from "../traits/index";
import { IHubItemEntity } from "./IHubItemEntity";

/**
 * Defines the properties of a Hub Project object
 */
export interface IHubProject
  extends IHubItemEntity,
    IWithSlug,
    IWithCatalog,
    IWithLayout,
    IWithPermissions,
    IWithMetrics {
  status: PROJECT_STATUSES;
}

export enum PROJECT_STATUSES {
  notStarted = "notStarted",
  inProgress = "inProgress",
  complete = "complete",
}
