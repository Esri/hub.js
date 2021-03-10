import { IPagedResponse } from "@esri/arcgis-rest-types";
import { request } from "./request";
import {
  IQueryChannelsOptions,
  ICreateChannelOptions,
  IGetChannelOptions,
  IUpdateChannelOptions,
  IDeleteChannelOptions,
  IChannelDTO,
  IPagedAPIResponse,
  INestDeleteResult
} from "./types";

/**
 * search channels
 *
 * @export
 * @param {IQueryChannelsOptions} options
 * @return {*}  {Promise<IPagedAPIResponse<IChannelDTO>>}
 */
export function searchChannels(
  options: IQueryChannelsOptions
): Promise<IPagedAPIResponse<IChannelDTO>> {
  options.method = "GET";
  return request(`/channels`, options);
}

/**
 * create channel
 *
 * @export
 * @param {ICreateChannelOptions} options
 * @return {*}  {Promise<IChannelDTO>}
 */
export function createChannel(
  options: ICreateChannelOptions
): Promise<IChannelDTO> {
  options.method = "POST";
  return request(`/channels`, options);
}

/**
 * get channel
 *
 * @export
 * @param {IGetChannelOptions} options
 * @return {*}  {Promise<IChannelDTO>}
 */
export function getChannel(options: IGetChannelOptions): Promise<IChannelDTO> {
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
 * @return {*}  {Promise<IChannelDTO>}
 */
export function updateChannel(
  options: IUpdateChannelOptions
): Promise<IChannelDTO> {
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
): Promise<INestDeleteResult> {
  options.method = "DELETE";
  return request(`/channels/${options.params.channelId}`, options);
}
