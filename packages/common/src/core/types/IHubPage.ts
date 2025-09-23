import { IWithLayout } from "../traits/IWithLayout";
import { IWithPermissions } from "../traits/IWithPermissions";
import { IWithSlug } from "../traits/IWithSlug";
import { IHubItemEntity, IHubItemEntityEditor } from "./IHubItemEntity";

/**
 * DRAFT: Under development and more properties will likely be added
 * @internal
 */
export interface IHubPage
  extends IHubItemEntity,
    IWithLayout,
    IWithPermissions,
    IWithSlug {}

export type IHubPageEditor = IHubItemEntityEditor<IHubPage> &
  Record<string, unknown>;
