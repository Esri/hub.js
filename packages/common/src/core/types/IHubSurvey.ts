import { IWithPermissions } from "../traits";
import { IHubItemEntity, IHubItemEntityEditor } from "./IHubItemEntity";

/**
 * Defines properties of Hub Survey object
 * @internal
 */
export interface IHubSurvey extends IHubItemEntity, IWithPermissions {}

export type IHubSurveyEditor = IHubItemEntityEditor<IHubSurvey> & {};
