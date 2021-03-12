import { request } from "./request";
import {
  IQueryChannelsOptions,
  ICreateChannelOptions,
  IGetChannelOptions,
  IUpdateChannelOptions,
  IDeleteChannelOptions,
  IChannel,
  IPagedResponse,
  IDeleteChannelResponse
} from "./types";

/**
 * search channels
 *
 * @export
 * @param {IQueryChannelsOptions} options
 * @return {*}  {Promise<IPagedResponse<IChannel>>}
 */
export function searchChannels(
  options: IQueryChannelsOptions
): Promise<IPagedResponse<IChannel>> {
  options.method = "GET";
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
  options.method = "POST";
  return request(`/channels`, options);
}

/**
 * get channel
 *
 * @export
 * @param {IGetChannelOptions} options
 * @return {*}  {Promise<IChannel>}
 */
export function getChannel(options: IGetChannelOptions): Promise<IChannel> {
  options.method = "GET";
  return request(`/channels/${options.params.channelId}`, options);
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
  options.method = "PATCH";
  return request(`/channels/${options.params.channelId}`, options);
}

/**
 * delete channel
 *
 * @export
 * @param {IDeleteChannelOptions} options
 * @return {*}
 */
export function deleteChannel(
  options: IDeleteChannelOptions
): Promise<IDeleteChannelResponse> {
  options.method = "DELETE";
  return request(`/channels/${options.params.channelId}`, options);
}
