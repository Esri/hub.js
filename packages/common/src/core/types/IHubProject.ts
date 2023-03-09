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
   * Definition of any dynamic values that can be resolved from child entities, service queris or the portal
   */
  dynamicValues?: DynamicValueDefinition[];
  /**
   * Holds properties that are be the source dynamic values defined by a parent entity
   */
  values?: DynamicValues;
}

export enum PROJECT_STATUSES {
  notStarted = "notStarted",
  inProgress = "inProgress",
  complete = "complete",
}
