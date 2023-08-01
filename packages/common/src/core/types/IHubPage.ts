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

export type IHubPageEditor = Omit<IHubPage, "extent"> & {
  /**
   * Thumbnail image. This is only used on the Editor and is
   * persisted in the fromEditor method on the Class
   */
  _thumbnail?: any;
};
