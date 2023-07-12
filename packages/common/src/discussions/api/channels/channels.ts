import { request } from "../request";
import { IChannel, IPagedResponse, ISearchChannelsParams } from "../types";

/**
 * search channels
 *
 * @export
 * @param {ISearchChannelsParams} options
 * @return {*}  {Promise<IPagedResponse<IChannel>>}
 */
export function searchChannels(
  options: ISearchChannelsParams
): Promise<IPagedResponse<IChannel>> {
  options.httpMethod = "GET";
  return request(`/channels`, options);
}
