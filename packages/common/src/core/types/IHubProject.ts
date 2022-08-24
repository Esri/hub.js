import { IHubTimeline, IHubItemEntity } from "./index";
import {
  IWithLayout,
  IWithPermissionDefinition,
  IWithSlug,
} from "../traits/index";
import { IWithCatalog } from "../traits/IWithCatalogDefinition";

/**
 * Defines the properties of a Hub Project object
 */
export interface IHubProject
  extends IHubItemEntity,
    IWithSlug,
    IWithCatalog,
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
