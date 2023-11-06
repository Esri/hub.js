import { IWithSlug, IWithPermissions, IWithCatalog } from "../traits";
import { IWithMetrics } from "../traits/IWithMetrics";
import { IHubItemEntity, IHubItemEntityEditor } from "./IHubItemEntity";

/**
 * DRAFT: Under development and more properties will likely be added
 * @internal
 */
export interface IHubInitiative
  extends IHubItemEntity,
    IWithSlug,
    IWithCatalog,
    IWithMetrics,
    IWithPermissions {
  status: INITIATIVE_STATUSES;
}

export enum INITIATIVE_STATUSES {
  notStarted = "notStarted",
  inProgress = "inProgress",
  onHold = "onHold",
  complete = "complete",
}

export type IHubInitiativeEditor = IHubItemEntityEditor<IHubInitiative> & {};
