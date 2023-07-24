import { request } from "../request";
import {
  ICreateChannelParams,
  IFetchChannelParams,
  IUpdateChannelParams,
  IRemoveChannelParams,
  IChannel,
  IRemoveChannelResponse,
  IFetchChannelNotificationOptOutParams,
  ICreateChannelNotificationOptOutParams,
  IRemoveChannelNotificationOptOutParams,
  IRemoveChannelActivityParams,
  IRemoveChannelNotificationOptOutResult,
  IRemoveChannelActivityResult,
  IChannelNotificationOptOut,
} from "../types";

export { searchChannels } from "@esri/hub-common";

/**
 * create channel
 *
 * @export
 * @param {ICreateChannelParams} options
 * @return {*}  {Promise<IChannel>}
 */
export function createChannel(
  options: ICreateChannelParams
): Promise<IChannel> {
  options.httpMethod = "POST";
  return request(`/channels`, options);
}

/**
 * fetch channel
 *
 * @export
 * @param {IFetchChannelParams} options
 * @return {*}  {Promise<IChannel>}
 */
export function fetchChannel(options: IFetchChannelParams): Promise<IChannel> {
  options.httpMethod = "GET";
  return request(`/channels/${options.channelId}`, options);
}

/**
 * update channel
 * NOTE: only updates channel settings properties and access (softDelete, allowedReactions, etc). A Channel's
 * groups cannot be updated.
 *
 * @export
 * @param {IUpdateChannelParams} options
 * @return {*}  {Promise<IChannel>}
 */
export function updateChannel(
  options: IUpdateChannelParams
): Promise<IChannel> {
  options.httpMethod = "PATCH";
  return request(`/channels/${options.channelId}`, options);
}

/**
 * remove channel
 *
 * @export
 * @param {IRemoveChannelParams} options
 * @return {*}
 */
export function removeChannel(
  options: IRemoveChannelParams
): Promise<IRemoveChannelResponse> {
  options.httpMethod = "DELETE";
  return request(`/channels/${options.channelId}`, options);
}

/**
 * get channel opt out status
 *
 * @export
 * @param {IFetchChannelNotificationOptOutParams} options
 * @return {*}
 */
export function fetchChannelNotifcationOptOut(
  options: IFetchChannelNotificationOptOutParams
): Promise<IChannelNotificationOptOut> {
  options.httpMethod = "GET";
  return request(
    `/channels/${options.channelId}/notifications/opt-out`,
    options
  );
}

/**
 * opt out of channel notifs
 *
 * @export
 * @param {ICreateChannelNotificationOptOutParams} options
 * @return {*}
 */
export function createChannelNotificationOptOut(
  options: ICreateChannelNotificationOptOutParams
): Promise<IChannelNotificationOptOut> {
  options.httpMethod = "POST";
  return request(
    `/channels/${options.channelId}/notifications/opt-out`,
    options
  );
}

/**
 * opt in to channel notifs
 *
 * @export
 * @param {IRemoveChannelNotificationOptOutParams} options
 * @return {*}
 */
export function removeChannelNotificationOptOut(
  options: IRemoveChannelNotificationOptOutParams
): Promise<IRemoveChannelNotificationOptOutResult> {
  options.httpMethod = "DELETE";
  return request(
    `/channels/${options.channelId}/notifications/opt-out`,
    options
  );
}

/**
 * remove all posts in a channel
 *
 * @export
 * @param {IRemoveChannelActivityParams} options
 * @return {*}
 */
export function removeChannelActivity(
  options: IRemoveChannelActivityParams
): Promise<IRemoveChannelActivityResult> {
  options.httpMethod = "DELETE";
  return request(`/channels/${options.channelId}/activity`, options);
}
