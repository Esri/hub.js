import {
  discussionsApiRequest,
  discussionsApiRequestV2,
} from "../discussions-api-request";
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
 * @deprecated replace with createSettingV2 for v2 discussions
 * @export
 * @param {ICreateSettingParams} options
 * @return {*} {Promise<IEntitySetting>}
 */
export function createSetting(
  options: ICreateSettingParams
): Promise<IEntitySetting> {
  options.httpMethod = "POST";
  return discussionsApiRequest(`/settings`, options);
}

/**
 * fetch setting
 *
 * @deprecated replace with fetchSettingV2 for v2 discussions
 * @export
 * @param {IFetchSettingParams} options
 * @return {*} {Promise<IEntitySetting>}
 */
export function fetchSetting(
  options: IFetchSettingParams
): Promise<IEntitySetting> {
  options.httpMethod = "GET";
  return discussionsApiRequest(`/settings/${options.id}`, options);
}

/**
 * update setting
 *
 * @deprecated replace with updateSettingV2 for v2 discussions
 * @export
 * @param {IUpdateSettingParams} options
 * @return {*} {Promise<IEntitySetting>}
 */
export function updateSetting(
  options: IUpdateSettingParams
): Promise<IEntitySetting> {
  options.httpMethod = "PATCH";
  return discussionsApiRequest(`/settings/${options.id}`, options);
}

/**
 * remove setting
 *
 * @deprecated replace with removeSettingV2 for v2 discussions
 * @export
 * @param {IRemoveSettingParams} options
 * @return {*} {Promise<IRemoveSettingResponse>}
 */
export function removeSetting(
  options: IRemoveSettingParams
): Promise<IRemoveSettingResponse> {
  options.httpMethod = "DELETE";
  return discussionsApiRequest(`/settings/${options.id}`, options);
}

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
