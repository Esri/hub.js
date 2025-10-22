import { IWithCatalog } from "../traits/IWithCatalog";
import { IWithMetrics } from "../traits/IWithMetrics";
import { IWithPermissions } from "../traits/IWithPermissions";
import { IWithSlug } from "../traits/IWithSlug";
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
    IWithStatus {}

export type IHubInitiativeEditor = IHubItemEntityEditor<IHubInitiative> &
  Record<string, unknown>;
