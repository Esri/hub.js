import { IHubItemEntity } from "./IHubItemEntity";
// import { IWithVersioningBehavior } from "../behaviors";
import {
  IWithLayout,
  // IWithPermissions,
  IWithSlug,
} from "../traits/index";
/**
 * DRAFT: Under development and more properties will likely be added
 * @internal
 */
export interface IHubPage
  extends IHubItemEntity,
    IWithLayout,
    // IWithPermissions,
    // IWithVersioningBehavior
    IWithSlug {}
