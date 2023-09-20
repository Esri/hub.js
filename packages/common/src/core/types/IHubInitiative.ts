import {
  IWithSlug,
  IWithLayout,
  IWithPermissions,
  IWithCatalog,
} from "../traits";
import {} from "../traits/IWithCatalog";
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
    IWithPermissions {}

export type IHubInitiativeEditor = IHubItemEntityEditor<IHubInitiative> & {};
