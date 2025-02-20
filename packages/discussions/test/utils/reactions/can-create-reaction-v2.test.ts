import { IUser } from "@esri/arcgis-rest-auth";
import { canCreateReactionV2 } from "../../../src/utils/reactions";
import { PostReaction, IChannel } from "../../../src/types";
import * as canReadChannelV2Module from "../../../src/utils/channels/can-read-channel-v2";

describe("canCreateReactionV2", () => {
  let canReadChannelV2Spy: jasmine.Spy;
  const user: IUser = { username: "bob" };

  beforeAll(() => {
    canReadChannelV2Spy = spyOn(canReadChannelV2Module, "canReadChannelV2");
  });

  beforeEach(() => {
    canReadChannelV2Spy.calls.reset();
  });

  it("returns true if channel allows all reactions and canReadChannel returns true", () => {
    canReadChannelV2Spy.and.returnValue(true);

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
    canReadChannelV2Spy.and.returnValue(true);

    const channel = {
      allowReaction: true,
      allowedReactions: null,
    } as unknown as IChannel;

    expect(canCreateReactionV2(channel, PostReaction.THUMBS_UP)).toBe(true);
    expect(canReadChannelV2Spy).toHaveBeenCalledTimes(1);
    expect(canReadChannelV2Spy).toHaveBeenCalledWith(channel, {});
  });

  it("returns false if channel allows all reactions and canReadChannel returns false", () => {
    canReadChannelV2Spy.and.returnValue(false);

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
    canReadChannelV2Spy.and.returnValue(true);

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
    canReadChannelV2Spy.and.returnValue(true);

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
    canReadChannelV2Spy.and.returnValue(true);

    const channel = { allowReaction: false } as IChannel;

    expect(canCreateReactionV2(channel, PostReaction.THUMBS_DOWN, user)).toBe(
      false
    );
    expect(canReadChannelV2Spy).not.toHaveBeenCalled();
  });
});
