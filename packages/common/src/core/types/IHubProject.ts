import {
  IWithLayout,
  IWithPermissions,
  IWithSlug,
  IWithCatalog,
} from "../traits/index";
import { DynamicValueDefinition, DynamicValues } from "./DynamicValues";
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
  /**
   * Timeline for the project
   */
  timeline?: IHubTimeline;
  /**
   * Project Status
   */
  status: PROJECT_STATUSES;
  /**
   * Definition of any dynamic values that can be resolved
   */
  dynamicValues?: DynamicValueDefinition[];
  /**
   * Container for values that can be the source for other dynamic values
   */
  values?: DynamicValues;
}

export enum PROJECT_STATUSES {
  notStarted = "notStarted",
  inProgress = "inProgress",
  complete = "complete",
}
