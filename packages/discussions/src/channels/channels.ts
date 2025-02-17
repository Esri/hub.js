import {
  discussionsApiRequest,
  discussionsApiRequestV2,
} from "@esri/hub-common";
import {
  ICreateChannelParams,
  ICreateChannelParamsV2,
  IFetchChannelParams,
  IUpdateChannelParams,
  IUpdateChannelParamsV2,
  IRemoveChannelParams,
  IChannel,
  IChannelV2,
  IRemoveChannelResponse,
  IFetchChannelNotificationOptOutParams,
  ICreateChannelNotificationOptOutParams,
  IRemoveChannelNotificationOptOutParams,
  IRemoveChannelActivityParams,
  IRemoveChannelNotificationOptOutResult,
  IRemoveChannelActivityResult,
  IChannelNotificationOptOut,
} from "../types";

export { searchChannels, searchChannelsV2 } from "@esri/hub-common";

/**
 * create channel
 *
 * @deprecated replace with createChannelV2 for v2 discussions
 * @export
 * @param {ICreateChannelParams} options
 * @return {*}  {Promise<IChannel>}
 */
export function createChannel(
  options: ICreateChannelParams
): Promise<IChannel> {
  options.httpMethod = "POST";
  return discussionsApiRequest(`/channels`, options);
}

/**
 * fetch channel
 *
 * @deprecated replace with fetchChannelV2 for v2 discussions
 * @export
 * @param {IFetchChannelParams} options
 * @return {*}  {Promise<IChannel>}
 */
export function fetchChannel(options: IFetchChannelParams): Promise<IChannel> {
  options.httpMethod = "GET";
  return discussionsApiRequest(`/channels/${options.channelId}`, options);
}

/**
 * update channel
 *
 * @deprecated replace with updateChannelV2 for v2 discussions
 * @export
 * @param {IUpdateChannelParams} options
 * @return {*}  {Promise<IChannel>}
 */
export function updateChannel(
  options: IUpdateChannelParams
): Promise<IChannel> {
  options.httpMethod = "PATCH";
  return discussionsApiRequest(`/channels/${options.channelId}`, options);
}

/**
 * remove channel
 *
 * @deprecated replace with removeChannelV2 for v2 discussions
 * @export
 * @param {IRemoveChannelParams} options
 * @return {*}
 */
export function removeChannel(
  options: IRemoveChannelParams
): Promise<IRemoveChannelResponse> {
  options.httpMethod = "DELETE";
  return discussionsApiRequest(`/channels/${options.channelId}`, options);
}

/**
 * get channel opt out status
 *
 * @deprecated replace with fetchChannelNotifcationOptOutV2 for v2 discussions
 * @export
 * @param {IFetchChannelNotificationOptOutParams} options
 * @return {*}
 */
export function fetchChannelNotifcationOptOut(
  options: IFetchChannelNotificationOptOutParams
): Promise<IChannelNotificationOptOut> {
  options.httpMethod = "GET";
  return discussionsApiRequest(
    `/channels/${options.channelId}/notifications/opt-out`,
    options
  );
}

/**
 * opt out of channel notifs
 *
 * @deprecated replace with createChannelNotificationOptOutV2 for v2 discussions
 * @export
 * @param {ICreateChannelNotificationOptOutParams} options
 * @return {*}
 */
export function createChannelNotificationOptOut(
  options: ICreateChannelNotificationOptOutParams
): Promise<IChannelNotificationOptOut> {
  options.httpMethod = "POST";
  return discussionsApiRequest(
    `/channels/${options.channelId}/notifications/opt-out`,
    options
  );
}

/**
 * remove channel notifs
 *
 * @deprecated replace with removeChannelNotificationOptOutV2 for v2 discussions
 * @export
 * @param {IRemoveChannelNotificationOptOutParams} options
 * @return {*}
 */
export function removeChannelNotificationOptOut(
  options: IRemoveChannelNotificationOptOutParams
): Promise<IRemoveChannelNotificationOptOutResult> {
  options.httpMethod = "DELETE";
  return discussionsApiRequest(
    `/channels/${options.channelId}/notifications/opt-out`,
    options
  );
}

/**
 * remove all posts in a channel
 *
 * @deprecated replace with removeChannelActivityV2 for v2 discussions
 * @export
 * @param {IRemoveChannelActivityParams} options
 * @return {*}
 */
export function removeChannelActivity(
  options: IRemoveChannelActivityParams
): Promise<IRemoveChannelActivityResult> {
  options.httpMethod = "DELETE";
  return discussionsApiRequest(
    `/channels/${options.channelId}/activity`,
    options
  );
}

/*******************************
 * V2
 *******************************/

/**
 * create channel v2
 *
 * @export
 * @param {ICreateChannelParamsV2} options
 * @return {*}  {Promise<IChannelV2>}
 */
export function createChannelV2(
  options: ICreateChannelParamsV2
): Promise<IChannelV2> {
  options.httpMethod = "POST";
  return discussionsApiRequestV2(`/channels`, options);
}

/**
 * fetch channel V2
 *
 * @export
 * @param {IFetchChannelParams} options
 * @return {*}  {Promise<IChannelV2>}
 */
export function fetchChannelV2(
  options: IFetchChannelParams
): Promise<IChannelV2> {
  options.httpMethod = "GET";
  return discussionsApiRequestV2(`/channels/${options.channelId}`, options);
}

/**
 * update channel V2
 *
 * @export
 * @param {IUpdateChannelParamsV2} options
 * @return {*}  {Promise<IChannelV2>}
 */
export function updateChannelV2(
  options: IUpdateChannelParamsV2
): Promise<IChannelV2> {
  options.httpMethod = "PATCH";
  return discussionsApiRequestV2(`/channels/${options.channelId}`, options);
}

/**
 * remove channel V2
 *
 * @export
 * @param {IRemoveChannelParams} options
 * @return {*}
 */
export function removeChannelV2(
  options: IRemoveChannelParams
): Promise<IRemoveChannelResponse> {
  options.httpMethod = "DELETE";
  return discussionsApiRequestV2(`/channels/${options.channelId}`, options);
}

/**
 * get channel opt out status V2
 *
 * @export
 * @param {IFetchChannelNotificationOptOutParams} options
 * @return {*}
 */
export function fetchChannelNotifcationOptOutV2(
  options: IFetchChannelNotificationOptOutParams
): Promise<IChannelNotificationOptOut> {
  options.httpMethod = "GET";
  return discussionsApiRequestV2(
    `/channels/${options.channelId}/notifications/opt-out`,
    options
  );
}

/**
 * opt out of channel notifs V2
 *
 * @export
 * @param {ICreateChannelNotificationOptOutParams} options
 * @return {*}
 */
export function createChannelNotificationOptOutV2(
  options: ICreateChannelNotificationOptOutParams
): Promise<IChannelNotificationOptOut> {
  options.httpMethod = "POST";
  return discussionsApiRequestV2(
    `/channels/${options.channelId}/notifications/opt-out`,
    options
  );
}

/**
 * remove channel notifs V2
 *
 * @export
 * @param {IRemoveChannelNotificationOptOutParams} options
 * @return {*}
 */
export function removeChannelNotificationOptOutV2(
  options: IRemoveChannelNotificationOptOutParams
): Promise<IRemoveChannelNotificationOptOutResult> {
  options.httpMethod = "DELETE";
  return discussionsApiRequestV2(
    `/channels/${options.channelId}/notifications/opt-out`,
    options
  );
}

/**
 * remove all posts in a channel V2
 *
 * @export
 * @param {IRemoveChannelActivityParams} options
 * @return {*}
 */
export function removeChannelActivityV2(
  options: IRemoveChannelActivityParams
): Promise<IRemoveChannelActivityResult> {
  options.httpMethod = "DELETE";
  return discussionsApiRequestV2(
    `/channels/${options.channelId}/activity`,
    options
  );
}
