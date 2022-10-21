import { request } from "./request";
import {
  ISearchChannelsOptions,
  ICreateChannelOptions,
  IFetchChannelOptions,
  IUpdateChannelOptions,
  IRemoveChannelOptions,
  IChannel,
  IPagedResponse,
  IRemoveChannelResponse,
  IFetchOptOutOptions,
  ICreateOptOutOptions,
  IRemoveOptOutOptions,
  IRemoveActivityOptions,
  IDeleteChannelNotificationOptOutResponse,
  IDeleteChannelActivityResponse,
  IChannelNotificationOptOutResponse,
} from "./types";

/**
 * search channels
 *
 * @export
 * @param {ISearchChannelsOptions} options
 * @return {*}  {Promise<IPagedResponse<IChannel>>}
 */
export function searchChannels(
  options: ISearchChannelsOptions
): Promise<IPagedResponse<IChannel>> {
  options.httpMethod = "GET";
  return request(`/channels`, options);
}

/**
 * create channel
 *
 * @export
 * @param {ICreateChannelOptions} options
 * @return {*}  {Promise<IChannel>}
 */
export function createChannel(
  options: ICreateChannelOptions
): Promise<IChannel> {
  options.httpMethod = "POST";
  return request(`/channels`, options);
}

/**
 * fetch channel
 *
 * @export
 * @param {IFetchChannelOptions} options
 * @return {*}  {Promise<IChannel>}
 */
export function fetchChannel(options: IFetchChannelOptions): Promise<IChannel> {
  options.httpMethod = "GET";
  return request(`/channels/${options.channelId}`, options);
}

/**
 * update channel
 * NOTE: only updates channel settings properties (softDelete, allowedReactions, etc). A Channel's
 * access and groups cannot be updated.
 *
 * @export
 * @param {IUpdateChannelOptions} options
 * @return {*}  {Promise<IChannel>}
 */
export function updateChannel(
  options: IUpdateChannelOptions
): Promise<IChannel> {
  options.httpMethod = "PATCH";
  return request(`/channels/${options.channelId}`, options);
}

/**
 * remove channel
 *
 * @export
 * @param {IRemoveChannelOptions} options
 * @return {*}
 */
export function removeChannel(
  options: IRemoveChannelOptions
): Promise<IRemoveChannelResponse> {
  options.httpMethod = "DELETE";
  return request(`/channels/${options.channelId}`, options);
}

/**
 * get channel opt out status
 *
 * @export
 * @param {IFetchOptOutOptions} options
 * @return {*}
 */
export function fetchOptOut(
  options: IFetchOptOutOptions
): Promise<IChannelNotificationOptOutResponse> {
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
 * @param {ICreateOptOutOptions} options
 * @return {*}
 */
export function createOptOut(
  options: ICreateOptOutOptions
): Promise<IChannelNotificationOptOutResponse> {
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
 * @param {IRemoveOptOutOptions} options
 * @return {*}
 */
export function removeOptOut(
  options: IRemoveOptOutOptions
): Promise<IDeleteChannelNotificationOptOutResponse> {
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
 * @param {IRemoveActivityOptions} options
 * @return {*}
 */
export function removeActivity(
  options: IRemoveActivityOptions
): Promise<IDeleteChannelActivityResponse> {
  options.httpMethod = "DELETE";
  return request(`/channels/${options.channelId}/activity`, options);
}
