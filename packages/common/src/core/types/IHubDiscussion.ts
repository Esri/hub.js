import { IWithPermissions, IWithSlug } from "../traits";
import { IHubItemEntity } from "./IHubItemEntity";

/**
 * DRAFT: Under development and more properties will likely be added
 * @internal
 */
export interface IHubDiscussion
  extends IHubItemEntity,
    IWithSlug,
    IWithPermissions {}

export type IHubDiscussionEditor = Omit<IHubDiscussion, "extent"> & {
  /**
   * Thumbnail image. This is only used on the Editor and is
   * persisted in the fromEditor method on the Class
   */
  _thumbnail?: any;
};
