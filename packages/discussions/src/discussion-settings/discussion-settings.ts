import { request } from "../request";
import { ICreateDiscussionSettingParams, IDiscussionSetting } from "../types";

export function createDiscussionSetting(
  options: ICreateDiscussionSettingParams
): Promise<IDiscussionSetting> {
  options.httpMethod = "POST";
  return request(`/discussion_settings`, options);
}
