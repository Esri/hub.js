import { IHubChannel } from "../core/types/IHubChannel";
import { ChannelRelation } from "../discussions";
import { fetchChannelV2 } from "../discussions/api/channels/channels";
import { IArcGISContext } from "../types";
import { transformChannelToEntity } from "./_internal/transformChannelToEntity";

/**
 * Fetches a Channel for the given channelId
 * @param channelId The ID of the channel to fetch
 * @param context ArcGIS context
 * @returns a promise that resolves an IHubChannel for the given channelId
 */
export async function fetchHubChannel(
  channelId: string,
  context: IArcGISContext
): Promise<IHubChannel> {
  const channel = await fetchChannelV2({
    channelId,
    data: { relations: [ChannelRelation.CHANNEL_ACL] },
    ...context.hubRequestOptions,
  });
  return transformChannelToEntity(channel, context.currentUser);
}
