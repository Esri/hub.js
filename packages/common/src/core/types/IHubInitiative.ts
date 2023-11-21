import { HubEntityHero } from "../../types";
import { IWithSlug, IWithPermissions, IWithCatalog } from "../traits";
import { IWithMetrics } from "../traits/IWithMetrics";
import { IWithStatus } from "../traits/IWithStatus";
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
    IWithPermissions,
    IWithStatus {
  hero: HubEntityHero;
}

export type IHubInitiativeEditor = IHubItemEntityEditor<IHubInitiative> & {};
