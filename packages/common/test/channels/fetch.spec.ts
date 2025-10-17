import { ChannelRelation, IChannel } from "../../src/discussions/api/types";
import * as fetchChannelV2Module from "../../src/discussions/api/channels/channels";
import * as transformChannelToEntityModule from "../../src/channels/_internal/transformChannelToEntity";
import { IHubChannel } from "../../src/core/types/IHubChannel";
import { fetchHubChannel } from "../../src/channels/fetch";
import { IArcGISContext } from "../../src/types/IArcGISContext";

import { describe, it, expect, vi, afterEach } from "vitest";

describe("fetchHubChannel", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should call fetchChannelV2 and resolve an IHubChannel object", async () => {
    const context: IArcGISContext = {
      hubRequestOptions: { portal: "https://some.portal" },
      currentUser: { id: "userId1" },
    } as unknown as IArcGISContext;
    const channel: IChannel = {
      id: "channelId1",
      name: "My channel",
      channelAcl: [],
    } as IChannel;
    const entity: IHubChannel = {
      id: "channelId1",
      name: "My channel",
      permissions: [],
    } as IHubChannel;
    const fetchChannelV2Spy = vi
      .spyOn(fetchChannelV2Module, "fetchChannelV2")
      .mockResolvedValue(channel as any);
    const transformChannelToEntitySpy = vi
      .spyOn(transformChannelToEntityModule, "transformChannelToEntity")
      .mockResolvedValue(entity as any);
    const result = await fetchHubChannel("channelId1", context);
    expect(result).toEqual(entity);
    expect(fetchChannelV2Spy).toHaveBeenCalledTimes(1);
    expect(fetchChannelV2Spy).toHaveBeenCalledWith({
      channelId: "channelId1",
      data: { relations: [ChannelRelation.CHANNEL_ACL] },
      ...context.hubRequestOptions,
    });
    expect(transformChannelToEntitySpy).toHaveBeenCalledTimes(1);
    expect(transformChannelToEntitySpy).toHaveBeenCalledWith(
      channel,
      context.currentUser
    );
  });
});
