import { IWithPermissions, IWithSlug } from "../traits";
import { IHubItemEntity, IHubItemEntityEditor } from "./IHubItemEntity";

/**
 * DRAFT: Under development and more properties will likely be added
 * @internal
 */
export interface IHubDiscussion
  extends IHubItemEntity,
    IWithSlug,
    IWithPermissions {}

export type IHubDiscussionEditor = IHubItemEntityEditor<IHubDiscussion> & {};
