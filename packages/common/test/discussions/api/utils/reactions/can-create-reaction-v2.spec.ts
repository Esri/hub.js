import type { IUser } from "@esri/arcgis-rest-portal";
import { canCreateReactionV2 } from "../../../../../src/discussions/api/utils/reactions/can-create-reaction-v2";
import {
  PostReaction,
  IChannel,
} from "../../../../../src/discussions/api/types";
import * as canReadChannelV2Module from "../../../../../src/discussions/api/utils/channels/can-read-channel-v2";
import { vi, afterEach, describe, it, expect } from "vitest";

describe("canCreateReactionV2", () => {
  afterEach(() => vi.restoreAllMocks());
  const user: IUser = { username: "bob" } as IUser;

  it("returns true if channel allows all reactions and canReadChannel returns true", () => {
    const canReadChannelV2Spy = vi.spyOn(
      canReadChannelV2Module,
      "canReadChannelV2"
    );
    canReadChannelV2Spy.mockReturnValue(true);

    const channel = {
      allowReaction: true,
      allowedReactions: null,
    } as unknown as IChannel;

    expect(canCreateReactionV2(channel, PostReaction.THUMBS_UP, user)).toBe(
      true
    );
    expect(canReadChannelV2Spy).toHaveBeenCalledTimes(1);
    expect(canReadChannelV2Spy).toHaveBeenCalledWith(channel, user);
  });

  it("returns true if user is undefined, channel allows all reactions, and canReadChannel returns true", () => {
    const canReadChannelV2Spy = vi.spyOn(
      canReadChannelV2Module,
      "canReadChannelV2"
    );
    canReadChannelV2Spy.mockReturnValue(true);

    const channel = {
      allowReaction: true,
      allowedReactions: null,
    } as unknown as IChannel;

    expect(canCreateReactionV2(channel, PostReaction.THUMBS_UP)).toBe(true);
    expect(canReadChannelV2Spy).toHaveBeenCalledTimes(1);
    expect(canReadChannelV2Spy).toHaveBeenCalledWith(channel, {});
  });

  it("returns false if channel allows all reactions and canReadChannel returns false", () => {
    const canReadChannelV2Spy = vi.spyOn(
      canReadChannelV2Module,
      "canReadChannelV2"
    );
    canReadChannelV2Spy.mockReturnValue(false);

    const channel = {
      allowReaction: true,
      allowedReactions: null,
    } as unknown as IChannel;

    expect(canCreateReactionV2(channel, PostReaction.THUMBS_UP, user)).toBe(
      false
    );
    expect(canReadChannelV2Spy).toHaveBeenCalledTimes(1);
    expect(canReadChannelV2Spy).toHaveBeenCalledWith(channel, user);
  });

  it("returns true if channel allows reaction, value included in allowed reactions, and canReadChannel returns true", () => {
    const canReadChannelV2Spy = vi.spyOn(
      canReadChannelV2Module,
      "canReadChannelV2"
    );
    canReadChannelV2Spy.mockReturnValue(true);

    const channel = {
      allowReaction: true,
      allowedReactions: ["thumbs_up"],
    } as IChannel;

    expect(canCreateReactionV2(channel, PostReaction.THUMBS_UP, user)).toBe(
      true
    );
    expect(canReadChannelV2Spy).toHaveBeenCalledTimes(1);
    expect(canReadChannelV2Spy).toHaveBeenCalledWith(channel, user);
  });

  it("returns false if channel allows reaction and value not included in allowed reactions", () => {
    const canReadChannelV2Spy = vi.spyOn(
      canReadChannelV2Module,
      "canReadChannelV2"
    );
    canReadChannelV2Spy.mockReturnValue(true);

    const channel = {
      allowReaction: true,
      allowedReactions: ["thumbs_up"],
    } as IChannel;

    expect(canCreateReactionV2(channel, PostReaction.THUMBS_DOWN, user)).toBe(
      false
    );
    expect(canReadChannelV2Spy).not.toHaveBeenCalled();
  });

  it("returns false if channel does not allow reaction", () => {
    const canReadChannelV2Spy = vi.spyOn(
      canReadChannelV2Module,
      "canReadChannelV2"
    );
    canReadChannelV2Spy.mockReturnValue(true);

    const channel = { allowReaction: false } as IChannel;

    expect(canCreateReactionV2(channel, PostReaction.THUMBS_DOWN, user)).toBe(
      false
    );
    expect(canReadChannelV2Spy).not.toHaveBeenCalled();
  });
});
