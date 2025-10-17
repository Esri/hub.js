import {
  IChannel,
  ICreateChannelV2,
  IUpdateChannelV2,
} from "../../src/discussions/api/types";
import { IHubChannel } from "../../src/core/types/IHubChannel";
import * as transformEntityToChannelDataModule from "../../src/channels/_internal/transformEntityToChannelData";
import * as channelsModule from "../../src/discussions/api/channels/channels";
import * as transformChannelToEntityModule from "../../src/channels/_internal/transformChannelToEntity";
import {
  createHubChannel,
  updateHubChannel,
  deleteHubChannel,
} from "../../src/channels/edit";
import { IArcGISContext } from "../../src/types/IArcGISContext";

import { describe, it, expect, vi, afterEach } from "vitest";

describe("edit", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("createHubChannel", () => {
    it("should call createChannelV2 and resolve an IHubChannel object", async () => {
      const context: IArcGISContext = {
        hubRequestOptions: { portal: "https://some.portal" },
        currentUser: { id: "42n" },
      } as unknown as IArcGISContext;
      const input: IHubChannel = {
        name: "My channel",
        allowAsAnonymous: true,
        blockWords: ["baad"],
      } as IHubChannel;
      const transformedChannel: ICreateChannelV2 = {
        name: "My channel",
        allowAsAnonymous: true,
        blockWords: ["baad"],
        channelAclDefinition: [],
      } as ICreateChannelV2;
      const channel: IChannel = {
        id: "31c",
        name: "My channel",
        allowAsAnonymous: true,
        blockWords: ["baad"],
        channelAcl: [],
      } as IChannel;
      const entity: IHubChannel = {
        ...input,
        id: "31c",
        createdDate: new Date(),
        blockWords: ["baad"],
        allowAsAnonymous: true,
      } as IHubChannel;
      const transformEntityToChannelDataSpy = vi
        .spyOn(
          transformEntityToChannelDataModule,
          "transformEntityToChannelData"
        )
        .mockReturnValue(transformedChannel);
      const createChannelV2Spy = vi
        .spyOn(channelsModule, "createChannelV2")
        .mockResolvedValue(channel as any);
      const transformChannelToEntitySpy = vi
        .spyOn(transformChannelToEntityModule, "transformChannelToEntity")
        .mockReturnValue(entity);
      const result = await createHubChannel(input, context);
      expect(result).toEqual(entity);
      expect(transformEntityToChannelDataSpy).toHaveBeenCalledTimes(1);
      expect(transformEntityToChannelDataSpy).toHaveBeenCalledWith(input);
      expect(createChannelV2Spy).toHaveBeenCalledTimes(1);
      expect(createChannelV2Spy).toHaveBeenCalledWith({
        data: transformedChannel,
        ...context.hubRequestOptions,
      });
      expect(transformChannelToEntitySpy).toHaveBeenCalledTimes(1);
      expect(transformChannelToEntitySpy).toHaveBeenCalledWith(
        channel,
        context.currentUser
      );
    });
  });
  describe("updateHubChannel", () => {
    it("should call updateChannelV2 and resolve an IHubChannel object", async () => {
      const context: IArcGISContext = {
        hubRequestOptions: { portal: "https://some.portal" },
        currentUser: { id: "42n" },
      } as unknown as IArcGISContext;
      const input: IHubChannel = {
        id: "31c",
        name: "My channel",
        allowAsAnonymous: true,
        blockWords: ["baad"],
      } as IHubChannel;
      const transformedChannel: IUpdateChannelV2 = {
        id: "31c",
        name: "My channel",
        allowAsAnonymous: true,
        blockWords: ["baad"],
        channelAclDefinition: [],
      } as IUpdateChannelV2;
      const channel: IChannel = {
        id: "31c",
        name: "My channel",
        allowAsAnonymous: true,
        blockWords: ["baad"],
        channelAcl: [],
      } as IChannel;
      const entity: IHubChannel = {
        ...input,
        id: "31c",
        createdDate: new Date(),
        blockWords: ["baad"],
        allowAsAnonymous: true,
      } as IHubChannel;
      const transformEntityToChannelDataSpy = vi
        .spyOn(
          transformEntityToChannelDataModule,
          "transformEntityToChannelData"
        )
        .mockReturnValue(transformedChannel);
      const updateChannelV2Spy = vi
        .spyOn(channelsModule, "updateChannelV2")
        .mockResolvedValue(channel as any);
      const transformChannelToEntitySpy = vi
        .spyOn(transformChannelToEntityModule, "transformChannelToEntity")
        .mockReturnValue(entity);
      const result = await updateHubChannel(input, context);
      expect(result).toEqual(entity);
      expect(transformEntityToChannelDataSpy).toHaveBeenCalledTimes(1);
      expect(transformEntityToChannelDataSpy).toHaveBeenCalledWith(input);
      expect(updateChannelV2Spy).toHaveBeenCalledTimes(1);
      expect(updateChannelV2Spy).toHaveBeenCalledWith({
        channelId: "31c",
        data: transformedChannel,
        ...context.hubRequestOptions,
      });
      expect(transformChannelToEntitySpy).toHaveBeenCalledTimes(1);
      expect(transformChannelToEntitySpy).toHaveBeenCalledWith(
        channel,
        context.currentUser
      );
    });
  });
  describe("deleteHubChannel", () => {
    it("should call removeChannelV2", async () => {
      const context: IArcGISContext = {
        hubRequestOptions: { portal: "https://some.portal" },
        currentUser: { id: "42n" },
      } as unknown as IArcGISContext;
      const removeChannelV2Spy = vi
        .spyOn(channelsModule, "removeChannelV2")
        .mockResolvedValue(undefined);
      await deleteHubChannel("channelId1", context);
      expect(removeChannelV2Spy).toHaveBeenCalledTimes(1);
      expect(removeChannelV2Spy).toHaveBeenCalledWith({
        channelId: "channelId1",
        ...context.hubRequestOptions,
      });
    });
  });
});
