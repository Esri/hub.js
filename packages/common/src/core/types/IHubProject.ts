import { IWithMetrics } from "../traits/IWithMetrics";
import { IWithStatus } from "../traits/IWithStatus";
import {
  IWithLayout,
  IWithPermissions,
  IWithSlug,
  IWithCatalog,
} from "../traits/index";
import { IHubItemEntity, IHubItemEntityEditor } from "./IHubItemEntity";

/**
 * Defines the properties of a Hub Project object
 */
export interface IHubProject
  extends IHubItemEntity,
    IWithSlug,
    IWithCatalog,
    IWithLayout,
    IWithMetrics,
    IWithPermissions,
    IWithStatus {}

/**
 * This type redefines the IHubProject interface in such a way
 * that it can be consumed by the entity editor.
 */
export type IHubProjectEditor = IHubItemEntityEditor<IHubProject> & {
  // Groups is an ephemeral property, so we prefix with _
  _groups?: string[];
};

/**
 * @internal
 * *** DEPRECATED ***
 * This is deprecated and will be removed during our next planned
 * breaking change. Please use HubEntityStatus instead
 */
export enum PROJECT_STATUSES {
  notStarted = "notStarted",
  inProgress = "inProgress",
  onHold = "onHold",
  complete = "complete",
}
