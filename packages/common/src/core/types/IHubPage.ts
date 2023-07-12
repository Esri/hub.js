import { IHubItemEntity } from "./IHubItemEntity";
import { IWithLayout, IWithPermissions, IWithSlug } from "../traits";
/**
 * DRAFT: Under development and more properties will likely be added
 * @internal
 */
export interface IHubPage
  extends IHubItemEntity,
    IWithLayout,
    IWithPermissions,
    IWithSlug {}
