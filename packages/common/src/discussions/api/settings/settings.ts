import { discussionsApiRequestV2 } from "../discussions-api-request";
import {
  ICreateSettingParams,
  IEntitySetting,
  IFetchSettingParams,
  IRemoveSettingParams,
  IRemoveSettingResponse,
  IUpdateSettingParams,
} from "../types";

/*******************************
 * V2
 *******************************/

/**
 * create setting V2
 *
 * @export
 * @param {ICreateSettingParams} options
 * @return {*} {Promise<IEntitySetting>}
 */
export function createSettingV2(
  options: ICreateSettingParams
): Promise<IEntitySetting> {
  options.httpMethod = "POST";
  return discussionsApiRequestV2(`/settings`, options);
}

/**
 * fetch setting V2
 *
 * @export
 * @param {IFetchSettingParams} options
 * @return {*} {Promise<IEntitySetting>}
 */
export function fetchSettingV2(
  options: IFetchSettingParams
): Promise<IEntitySetting> {
  options.httpMethod = "GET";
  return discussionsApiRequestV2(`/settings/${options.id}`, options);
}

/**
 * update setting V2
 *
 * @export
 * @param {IUpdateSettingParams} options
 * @return {*} {Promise<IEntitySetting>}
 */
export function updateSettingV2(
  options: IUpdateSettingParams
): Promise<IEntitySetting> {
  options.httpMethod = "PATCH";
  return discussionsApiRequestV2(`/settings/${options.id}`, options);
}

/**
 * remove setting
 *
 * @export
 * @param {IRemoveSettingParams} options
 * @return {*} {Promise<IRemoveSettingResponse>}
 */
export function removeSettingV2(
  options: IRemoveSettingParams
): Promise<IRemoveSettingResponse> {
  options.httpMethod = "DELETE";
  return discussionsApiRequestV2(`/settings/${options.id}`, options);
}
