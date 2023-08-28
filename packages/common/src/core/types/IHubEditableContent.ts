import { IWithPermissions, IWithSlug } from "../traits/index";
import { IHubItemEntity } from "./IHubItemEntity";

/**
 * Defines the properties of an editable Hub Content object
 */
export interface IHubEditableContent
  extends IHubItemEntity,
    IWithSlug,
    IWithPermissions {
  /**
   * TODO: add additional props, perhaps using Pick from IHubContent
   */
  urls: {
    // TODO: Should these all be optional
    relative?: string,
    portalHome?: string,
    portalApi?: string,
    portalData?: string,
    thumbnail?: string,
  }
}

export type IHubContentEditor = Omit<IHubEditableContent, "extent"> & {
  /**
   * Thumbnail image. This is only used on the Editor and is
   * persisted in the fromEditor method on the Class
   */
  _thumbnail?: any;
};
