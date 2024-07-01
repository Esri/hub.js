import { IWithCatalog, IWithCatalogs } from "../traits/IWithCatalog";
import { IWithLayout } from "../traits/IWithLayout";
import { IWithMetrics } from "../traits/IWithMetrics";
import { IWithPermissions } from "../traits/IWithPermissions";
import { IWithSlug } from "../traits/IWithSlug";
import { IWithStatus } from "../traits/IWithStatus";
import { IWithContent, IWithEvents } from "../traits/ICapabilityConfig";

import { IHubItemEntity, IHubItemEntityEditor } from "./IHubItemEntity";

/**
 * Defines the properties of a Hub Project object
 */
export interface IHubProject
  extends IHubItemEntity,
    IWithSlug,
    IWithCatalog, // DEPRECATED: Use IWithCatalogs instead
    IWithCatalogs,
    IWithLayout,
    IWithMetrics,
    IWithPermissions,
    // IWithEvents,
    // IWithContent,
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
