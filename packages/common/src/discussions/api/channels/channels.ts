/* tslint:disable unified-signatures */
import { discussionsApiRequestV2 } from "../discussions-api-request";
import {
  IChannel,
  IChannelNotificationOptOut,
  ICreateChannelNotificationOptOutParams,
  ICreateChannelParamsV2,
  IFetchChannelNotificationOptOutParams,
  IFetchChannelParams,
  IPagedResponse,
  IRemoveChannelActivityParams,
  IRemoveChannelActivityResult,
  IRemoveChannelNotificationOptOutParams,
  IRemoveChannelNotificationOptOutResult,
  IRemoveChannelParams,
  IRemoveChannelResponse,
  ISearchChannelsParams,
  IUpdateChannelParamsV2,
} from "../types";

/**
 * Search for Channels in the Discussions API.  Channels define the capabilities,
 * permissions, and configuration for Discussion posts.
 *
 * @export
 * @param {ISearchChannelsParams} options
 * @return {*}  {Promise<IPagedResponse<IChannel>>}
 */
export function searchChannelsV2(
  options: ISearchChannelsParams
): Promise<IPagedResponse<IChannel>> {
  options.httpMethod = "GET";
  return discussionsApiRequestV2(`/channels`, options);
}

/*******************************
 * V2
 *******************************/

/**
 * create channel v2
 *
 * @export
 * @param {ICreateChannelParamsV2} options
 * @return {*}  {Promise<IChannel>}
 */
export function createChannelV2(
  options: ICreateChannelParamsV2
): Promise<IChannel> {
  options.httpMethod = "POST";
  return discussionsApiRequestV2(`/channels`, options);
}

/**
 * fetch channel V2
 *
 * @export
 * @param {IFetchChannelParams} options
 * @return {*}  {Promise<IChannel>}
 */
export function fetchChannelV2(
  options: IFetchChannelParams
): Promise<IChannel> {
  options.httpMethod = "GET";
  return discussionsApiRequestV2(`/channels/${options.channelId}`, options);
}

/**
 * update channel V2
 *
 * @export
 * @param {IUpdateChannelParamsV2} options
 * @return {*}  {Promise<IChannel>}
 */
export function updateChannelV2(
  options: IUpdateChannelParamsV2
): Promise<IChannel> {
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
