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
   * Holds a hash of DynamicValues, keyed by the id of the parent for which the values
   * apply. These are the source values used when the parent resolves is own dynamic values.
   * e.g. `values.00c.funding = 1029` is the funding value for the parent with id `00c`
   */
  values?: Record<string, DynamicValues>;
}

export enum PROJECT_STATUSES {
  notStarted = "notStarted",
  inProgress = "inProgress",
  complete = "complete",
}
