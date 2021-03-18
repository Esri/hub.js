import { request } from "./request";
import {
  ISearchChannelsOptions,
  ICreateChannelOptions,
  IFetchChannelOptions,
  IUpdateChannelOptions,
  IRemoveChannelOptions,
  IChannel,
  IPagedResponse,
  IRemoveChannelResponse
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
 * NOTE: only updatable properies are channel setting properties. A Channel's
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
