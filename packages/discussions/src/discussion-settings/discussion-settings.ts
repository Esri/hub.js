import { request } from "../request";
import {
  ICreateDiscussionSettingParams,
  IDiscussionSetting,
  IRemoveDiscussionSettingParams,
} from "../types";

/**
 * create discussion settings
 *
 * @export
 * @param {ICreateDiscussionSettingParams} options
 * @return {*} {Promise<IDiscussionSetting>}
 */
export function createDiscussionSetting(
  options: ICreateDiscussionSettingParams
): Promise<IDiscussionSetting> {
  options.httpMethod = "POST";
  return request(`/discussion_settings`, options);
}

/**
 * remove discussion settings
 *
 * @export
 * @param {IRemoveDiscussionSettingParams} options
 * @return {*} {Promise<IDiscussionSetting>}
 */
export function removeDiscussionSetting(
  options: IRemoveDiscussionSettingParams
): Promise<IDiscussionSetting> {
  options.httpMethod = "DELETE";
  return request(`/discussion_settings/${options.id}`, options);
}
