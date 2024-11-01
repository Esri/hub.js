import { IWithCatalog } from "../traits/IWithCatalog";
import { IWithPermissions } from "../traits/IWithPermissions";
import { IWithSlug } from "../traits/IWithSlug";
import { IHubItemEntity, IHubItemEntityEditor } from "./IHubItemEntity";

/**
 * DRAFT: Under development and more properties will likely be added
 * @internal
 */
export interface IHubDiscussion
  extends IHubItemEntity,
    IWithSlug,
    IWithCatalog,
    IWithPermissions {}

export type IHubDiscussionEditor = IHubItemEntityEditor<IHubDiscussion> & {};
