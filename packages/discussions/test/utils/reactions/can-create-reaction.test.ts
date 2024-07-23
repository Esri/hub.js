import { IUser } from "@esri/arcgis-rest-auth";
import { canCreateReaction } from "../../../src/utils/reactions";
import { PostReaction, IChannel } from "../../../src/types";
import * as canReadChannelModule from "../../../src/utils/channels/can-read-channel";

describe("Util: canCreateReaction", () => {
  const user: IUser = { username: "bob" };

  it("returns true if channel allows all reactions and canReadChannel returns true", () => {
    const canReadChannelSpy = spyOn(
      canReadChannelModule,
      "canReadChannel"
    ).and.returnValue(true);
    const channel = {
      allowReaction: true,
      allowedReactions: null,
    } as unknown as IChannel;

    expect(canCreateReaction(channel, PostReaction.THUMBS_UP)).toBe(true);
    // expect(canCreateReaction(channel, PostReaction.THUMBS_UP, user)).toBe(true);
    // expect(canReadChannelSpy).toHaveBeenCalledTimes(1);
    // expect(canReadChannelSpy).toHaveBeenCalledWith(channel, user);
  });

  // it("returns true if user is undefined, channel allows all reactions, and canReadChannel returns true", () => {
  //   const canReadChannelSpy = spyOn(
  //     canReadChannelModule,
  //     "canReadChannel"
  //   ).and.returnValue(true);
  //   const channel = {
  //     allowReaction: true,
  //     allowedReactions: null,
  //   } as unknown as IChannel;

  //   expect(canCreateReaction(channel, PostReaction.THUMBS_UP)).toBe(true);
  //   // expect(canCreateReaction(channel, PostReaction.THUMBS_UP)).toBe(true);
  //   // expect(canReadChannelSpy).toHaveBeenCalledTimes(1);
  //   // expect(canReadChannelSpy).toHaveBeenCalledWith(channel, {});
  // });

  // it("returns false if channel allows all reactions and canReadChannel returns false", () => {
  //   const canReadChannelSpy = spyOn(
  //     canReadChannelModule,
  //     "canReadChannel"
  //   ).and.returnValue(false);
  //   const channel = {
  //     allowReaction: true,
  //     allowedReactions: null,
  //   } as unknown as IChannel;

  //   expect(canCreateReaction(channel, PostReaction.THUMBS_UP)).toBe(
  //   // expect(canCreateReaction(channel, PostReaction.THUMBS_UP, user)).toBe(
  //     false
  //   );
  //   // expect(canReadChannelSpy).toHaveBeenCalledTimes(1);
  //   // expect(canReadChannelSpy).toHaveBeenCalledWith(channel, user);
  // });

  it("returns true if channel allows reaction, value included in allowed reactions, and canReadChannel returns true", () => {
    const canReadChannelSpy = spyOn(
      canReadChannelModule,
      "canReadChannel"
    ).and.returnValue(true);
    const channel = {
      allowReaction: true,
      allowedReactions: ["thumbs_up"],
    } as IChannel;

    expect(canCreateReaction(channel, PostReaction.THUMBS_UP)).toBe(true);
    // expect(canCreateReaction(channel, PostReaction.THUMBS_UP, user)).toBe(true);
    // expect(canReadChannelSpy).toHaveBeenCalledTimes(1);
    // expect(canReadChannelSpy).toHaveBeenCalledWith(channel, user);
  });

  it("returns false if channel allows reaction and value not included in allowed reactions", () => {
    const canReadChannelSpy = spyOn(
      canReadChannelModule,
      "canReadChannel"
    ).and.returnValue(true);
    const channel = {
      allowReaction: true,
      allowedReactions: ["thumbs_up"],
    } as IChannel;

    expect(canCreateReaction(channel, PostReaction.THUMBS_DOWN)).toBe(
      // expect(canCreateReaction(channel, PostReaction.THUMBS_DOWN, user)).toBe(
      false
    );
    // expect(canReadChannelSpy).not.toHaveBeenCalled();
  });

  it("returns false if channel does not allow reaction", () => {
    const canReadChannelSpy = spyOn(
      canReadChannelModule,
      "canReadChannel"
    ).and.returnValue(true);
    const channel = { allowReaction: false } as IChannel;

    expect(canCreateReaction(channel, PostReaction.THUMBS_DOWN)).toBe(
      // expect(canCreateReaction(channel, PostReaction.THUMBS_DOWN, user)).toBe(
      false
    );
    // expect(canReadChannelSpy).not.toHaveBeenCalled();
  });
});
