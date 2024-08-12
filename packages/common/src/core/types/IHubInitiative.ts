import { IWithCatalog, IWithCatalogs } from "../traits/IWithCatalog";
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
    IWithCatalog, // DEPRECATED: Use IWithCatalogs instead
    IWithCatalogs,
    IWithMetrics,
    IWithPermissions,
    IWithStatus {}

export type IHubInitiativeEditor = IHubItemEntityEditor<IHubInitiative> & {};
