import { IWithPermissions, IWithSlug } from "../traits";
import { IHubItemEntity, IHubItemEntityEditor } from "./IHubItemEntity";

/**
 * Defines properties of Hub Feedback object
 * @internal
 */
export interface IHubFeedback
  extends IHubItemEntity,
    IWithPermissions,
    IWithSlug {}

export type IHubFeedbackEditor = IHubItemEntityEditor<IHubFeedback> & {};
