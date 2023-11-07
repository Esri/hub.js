import { HubEntityStatus } from "../../types";
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
  status: HubEntityStatus;
}

export type IHubInitiativeEditor = IHubItemEntityEditor<IHubInitiative> & {};
