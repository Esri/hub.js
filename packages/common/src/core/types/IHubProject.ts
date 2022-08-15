import { IHubTimeline, IHubItemEntity } from "./index";
import {
  IWithLayout,
  IWithPermissionDefinition,
  IWithSlug,
} from "../traits/index";
import { IWithCatalogDefinition } from "../traits/IWithCatalogDefinition";

/**
 * Defines the properties of a Hub Project object
 */
export interface IHubProject
  extends IHubItemEntity,
    IWithSlug,
    IWithCatalogDefinition,
    IWithLayout,
    IWithPermissionDefinition {
  /**
   * Timeline for the project
   */
  timeline?: IHubTimeline;
  /**
   * Project Status
   */
  status: "inactive" | "active";
}
