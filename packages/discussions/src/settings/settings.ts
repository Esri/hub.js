import { request } from "../request";
import {
  ICreateSettingParams,
  ISetting,
  IFetchSettingParams,
  IRemoveSettingParams,
  IRemoveSettingResponse,
  IUpdateSettingParams,
} from "../types";

/**
 * create setting
 *
 * @export
 * @param {ICreateSettingParams} options
 * @return {*} {Promise<ISetting>}
 */
export function createSetting(
  options: ICreateSettingParams
): Promise<ISetting> {
  options.httpMethod = "POST";
  return request(`/settings`, options);
}

/**
 * fetch setting
 *
 * @export
 * @param {IFetchSettingParams} options
 * @return {*} {Promise<ISetting>}
 */
export function fetchSetting(options: IFetchSettingParams): Promise<ISetting> {
  options.httpMethod = "GET";
  return request(`/settings/${options.id}`, options);
}

/**
 * update setting
 *
 * @export
 * @param {IUpdateSettingParams} options
 * @return {*} {Promise<ISetting>}
 */
export function updateSetting(
  options: IUpdateSettingParams
): Promise<ISetting> {
  options.httpMethod = "PATCH";
  return request(`/settings/${options.id}`, options);
}

/**
 * remove setting
 *
 * @export
 * @param {IRemoveSettingParams} options
 * @return {*} {Promise<IRemoveSettingResponse>}
 */
export function removeSetting(
  options: IRemoveSettingParams
): Promise<IRemoveSettingResponse> {
  options.httpMethod = "DELETE";
  return request(`/settings/${options.id}`, options);
}
