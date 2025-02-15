import {
  discussionsApiRequest,
  discussionsApiRequestV2,
} from "../discussions-api-request";
import {
  IChannel,
  IChannelV2,
  IPagedResponse,
  ISearchChannelsParams,
} from "../types";

/**
 * Search for Channels in the Discussions API.  Channels define the capabilities,
 * permissions, and configuration for Discussion posts.
 *
 * @export
 * @param {ISearchChannelsParams} options
 * @return {*}  {Promise<IPagedResponse<IChannel>>}
 */
export function searchChannels(
  options: ISearchChannelsParams
): Promise<IPagedResponse<IChannel>> {
  options.httpMethod = "GET";
  return discussionsApiRequest(`/channels`, options);
}

/**
 * Search for Channels in the Discussions API.  Channels define the capabilities,
 * permissions, and configuration for Discussion posts.
 *
 * @export
 * @param {ISearchChannelsParams} options
 * @return {*}  {Promise<IPagedResponse<IChannelV2>>}
 */
export function searchChannelsV2(
  options: ISearchChannelsParams
): Promise<IPagedResponse<IChannelV2>> {
  options.httpMethod = "GET";
  return discussionsApiRequestV2(`/channels`, options);
}
