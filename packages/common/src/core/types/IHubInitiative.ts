import {
  IWithSlug,
  IWithPermissions,
  IWithCatalog,
  IWithViewSettings,
} from "../traits";
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
    IWithStatus,
    IWithViewSettings {}

export type IHubInitiativeEditor = IHubItemEntityEditor<IHubInitiative> & {};
