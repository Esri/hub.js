import {
  IWithSlug,
  IWithLayout,
  IWithPermissions,
  IWithCatalog,
} from "../traits";
import {} from "../traits/IWithCatalog";
import { IWithMetrics } from "../traits/IWithMetrics";
import { IHubItemEntity } from "./IHubItemEntity";

/**
 * DRAFT: Under development and more properties will likely be added
 * @internal
 */
export interface IHubInitiative
  extends IHubItemEntity,
    IWithSlug,
    IWithCatalog,
    IWithMetrics,
    IWithPermissions {}

export type IHubInitiativeEditor = Omit<IHubInitiative, "extent"> & {
  /**
   * Thumbnail image. This is only used on the Editor and is
   * persisted in the fromEditor method on the Class
   */
  _thumbnail?: any;
};
