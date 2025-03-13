import { IHubChannel } from "../core";
import {
  removeChannelV2,
  updateChannelV2,
  createChannelV2,
} from "../discussions/api/channels/channels";
import { ICreateChannelV2, IUpdateChannelV2 } from "../discussions/api/types";
import { IArcGISContext } from "../types";
import { transformChannelToEntity } from "./_internal/transformChannelToEntity";
import { transformEntityToChannelData } from "./_internal/transformEntityToChannelData";

/**
 * Creates a new Channel from the given IHubChannel object
 * @param entity An IHubChannel object
 * @param context ArcGIS context
 * @returns a promise that resolves an IHubChannel representing the newly created channel
 */
export async function createHubChannel(
  entity: IHubChannel,
  context: IArcGISContext
): Promise<IHubChannel> {
  const channelData = transformEntityToChannelData<ICreateChannelV2>(entity);
  const createdChannel = await createChannelV2({
    data: channelData,
    ...context.hubRequestOptions,
  });
  return transformChannelToEntity(createdChannel, context.currentUser);
}

/**
 * Updates an existing Channel from the given IHubChannel object
 * @param entity An IHubChannel object
 * @param context ArcGIS context
 * @returns a promise that resolves an IHubChannel representing the updated channel
 */
export async function updateHubChannel(
  entity: IHubChannel,
  context: IArcGISContext
): Promise<IHubChannel> {
  const updatedChannelData =
    transformEntityToChannelData<IUpdateChannelV2>(entity);
  const updatedChannel = await updateChannelV2({
    channelId: entity.id,
    data: updatedChannelData,
    ...context.hubRequestOptions,
  });
  return transformChannelToEntity(updatedChannel, context.currentUser);
}

/**
 * Updates an existing Channel from the given IHubChannel object
 * @param channelId The ID of the channel to delete
 * @param context ArcGIS context
 * @returns a promise
 */
export async function deleteHubChannel(
  channelId: string,
  context: IArcGISContext
): Promise<void> {
  await removeChannelV2({
    channelId,
    ...context.hubRequestOptions,
  });
}
