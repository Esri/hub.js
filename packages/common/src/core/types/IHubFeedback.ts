import { IWithPermissions } from "../traits";
import { IHubItemEntity, IHubItemEntityEditor } from "./IHubItemEntity";

/**
 * Defines properties of Hub Feedback object
 * @internal
 */
export interface IHubFeedback extends IHubItemEntity, IWithPermissions {}

export type IHubFeedbackEditor = IHubItemEntityEditor<IHubFeedback> & {};
