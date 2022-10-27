import { canCreateReaction } from "../../src/utils/reactions";
import { PostReaction } from "../../src/types";
import { IChannel } from "../../src/channels";

describe("Util: canCreateReaction", () => {
  it("returns true if channel allows all reactions", () => {
    const channel = {
      allowReaction: true,
      allowedReactions: null,
    } as unknown as IChannel;
    expect(canCreateReaction(channel, PostReaction.THUMBS_UP)).toBe(true);
  });

  it("returns true if channel allows reaction and value included in allowed reactions", () => {
    const channel = {
      allowReaction: true,
      allowedReactions: ["thumbs_up"],
    } as IChannel;
    expect(canCreateReaction(channel, PostReaction.THUMBS_UP)).toBe(true);
  });

  it("returns false if channel allows reaction and value not included in allowed reactions", () => {
    const channel = {
      allowReaction: true,
      allowedReactions: ["thumbs_up"],
    } as IChannel;
    expect(canCreateReaction(channel, PostReaction.THUMBS_DOWN)).toBe(false);
  });

  it("returns false if channel does not allow reaction", () => {
    const channel = { allowReaction: false } as IChannel;
    expect(canCreateReaction(channel, PostReaction.THUMBS_DOWN)).toBe(false);
  });
});
