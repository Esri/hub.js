import { request } from "../request";
import {
  ICreateSettingParams,
  IEntitySetting,
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
 * @return {*} {Promise<IEntitySetting>}
 */
export function createSetting(
  options: ICreateSettingParams
): Promise<IEntitySetting> {
  options.httpMethod = "POST";
  return request(`/settings`, options);
}

/**
 * fetch setting
 *
 * @export
 * @param {IFetchSettingParams} options
 * @return {*} {Promise<IEntitySetting>}
 */
export function fetchSetting(
  options: IFetchSettingParams
): Promise<IEntitySetting> {
  options.httpMethod = "GET";
  return request(`/settings/${options.id}`, options);
}

/**
 * update setting
 *
 * @export
 * @param {IUpdateSettingParams} options
 * @return {*} {Promise<IEntitySetting>}
 */
export function updateSetting(
  options: IUpdateSettingParams
): Promise<IEntitySetting> {
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
