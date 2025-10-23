import {
  IChannel,
  IDiscussionsUser,
  IPost,
} from "../../../../../src/discussions/api/types";
import { canEditPostV2 } from "../../../../../src/discussions/api/utils/posts/can-edit-post-v2";
import { ChannelPermission } from "../../../../../src/discussions/api/utils/channel-permission";
import { vi, beforeEach, afterEach, describe, it, expect } from "vitest";

describe("canEditPostV2", () => {
  let canPostToChannelSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    canPostToChannelSpy = vi.spyOn(
      ChannelPermission.prototype,
      "canPostToChannel"
    );
  });

  afterEach(() => vi.restoreAllMocks());

  describe("POST", () => {
    it("returns false if the user did not create the post", () => {
      const post = { id: "postId", creator: "john" } as IPost;
      const user = { username: "notJohn" } as IDiscussionsUser;
      const channel = {
        allowPost: true,
        channelAcl: [],
      } as unknown as IChannel;

      const result = canEditPostV2(post, user, channel);
      expect(result).toBe(false);
      expect(canPostToChannelSpy.mock.calls.length).toBe(0);
    });

    it("returns false if the user is not logged in", () => {
      const post = { id: "postId" } as IPost; // asAnonymous post
      const user = {} as IDiscussionsUser;
      const channel = {
        allowPost: true,
        channelAcl: [],
      } as unknown as IChannel;

      const result = canEditPostV2(post, user, channel);
      expect(result).toBe(false);
      expect(canPostToChannelSpy.mock.calls.length).toBe(0);
    });

    it("returns false if the user undefined", () => {
      const post = { id: "postId" } as IPost; // asAnonymous post
      const user = undefined as unknown as IDiscussionsUser;
      const channel = {
        allowPost: true,
        channelAcl: [],
      } as unknown as IChannel;

      const result = canEditPostV2(post, user, channel);
      expect(result).toBe(false);
      expect(canPostToChannelSpy.mock.calls.length).toBe(0);
    });

    it("returns false if user created the post but channel.allowPost is false", () => {
      canPostToChannelSpy.mockImplementation(() => true);

      const post = { id: "postId", creator: "john" } as IPost;
      const user = { username: "john" } as IDiscussionsUser;
      const channel = {
        allowPost: false,
        channelAcl: [],
      } as unknown as IChannel;

      const result = canEditPostV2(post, user, channel);
      expect(result).toBe(false);
      expect(canPostToChannelSpy.mock.calls.length).toBe(0);
    });

    it("returns false if the user created the post and canPostToChannel returns false", () => {
      canPostToChannelSpy.mockImplementation(() => false);

      const post = { id: "postId", creator: "john" } as IPost;
      const user = { username: "john" } as IDiscussionsUser;
      const channel = {
        allowPost: true,
        channelAcl: [],
      } as unknown as IChannel;

      const result = canEditPostV2(post, user, channel);
      expect(result).toBe(false);
      expect(canPostToChannelSpy.mock.calls.length).toBe(1);
      const [arg] = canPostToChannelSpy.mock.calls[0]; // arg for 1st call
      expect(arg).toBe(user);
    });

    it("returns true if the user created the post and canPostToChannel returns false", () => {
      canPostToChannelSpy.mockImplementation(() => true);

      const post = { id: "postId", creator: "john" } as IPost;
      const user = { username: "john" } as IDiscussionsUser;
      const channel = {
        allowPost: true,
        channelAcl: [],
      } as unknown as IChannel;

      const result = canEditPostV2(post, user, channel);
      expect(result).toBe(true);

      expect(canPostToChannelSpy.mock.calls.length).toBe(1);
      const [arg] = canPostToChannelSpy.mock.calls[0]; // arg for 1st call
      expect(arg).toBe(user);
    });
  });

  describe("REPLY", () => {
    it("returns false if the user did not create the reply", () => {
      const post = { id: "postId", creator: "john", parentId: "aaa" } as IPost;
      const user = { username: "notJohn" } as IDiscussionsUser;
      const channel = {
        allowReply: true,
        channelAcl: [],
      } as unknown as IChannel;

      const result = canEditPostV2(post, user, channel);
      expect(result).toBe(false);
      expect(canPostToChannelSpy.mock.calls.length).toBe(0);
    });

    it("returns false if the user is not logged in", () => {
      const post = { id: "postId", parentId: "aaa" } as IPost; // asAnonymous post
      const user = {} as IDiscussionsUser;
      const channel = {
        allowReply: true,
        channelAcl: [],
      } as unknown as IChannel;

      const result = canEditPostV2(post, user, channel);
      expect(result).toBe(false);
      expect(canPostToChannelSpy.mock.calls.length).toBe(0);
    });

    it("returns false if the user undefined", () => {
      const post = { id: "postId", parentId: "aaa" } as IPost; // asAnonymous post
      const user = undefined as unknown as IDiscussionsUser;
      const channel = {
        allowReply: true,
        channelAcl: [],
      } as unknown as IChannel;

      const result = canEditPostV2(post, user, channel);
      expect(result).toBe(false);
      expect(canPostToChannelSpy.mock.calls.length).toBe(0);
    });

    it("returns false if user created the reply but channel.allowReply is false", () => {
      canPostToChannelSpy.mockImplementation(() => true);

      const post = { id: "postId", creator: "john", parentId: "aaa" } as IPost;
      const user = { username: "john" } as IDiscussionsUser;
      const channel = {
        allowReply: false,
        channelAcl: [],
      } as unknown as IChannel;

      const result = canEditPostV2(post, user, channel);
      expect(result).toBe(false);

      expect(canPostToChannelSpy.mock.calls.length).toBe(0);
    });

    it("returns false if the user created the reply and canPostToChannel returns false", () => {
      canPostToChannelSpy.mockImplementation(() => false);

      const post = { id: "postId", creator: "john", parentId: "aaa" } as IPost;
      const user = { username: "john" } as IDiscussionsUser;
      const channel = {
        allowReply: true,
        channelAcl: [],
      } as unknown as IChannel;

      const result = canEditPostV2(post, user, channel);
      expect(result).toBe(false);

      expect(canPostToChannelSpy.mock.calls.length).toBe(1);
      const [arg] = canPostToChannelSpy.mock.calls[0]; // arg for 1st call
      expect(arg).toBe(user);
    });

    it("returns true if the user created the reply and canPostToChannel returns true", () => {
      canPostToChannelSpy.mockImplementation(() => true);

      const post = { id: "postId", creator: "john", parentId: "aaa" } as IPost;
      const user = { username: "john" } as IDiscussionsUser;
      const channel = {
        allowReply: true,
        channelAcl: [],
      } as unknown as IChannel;

      const result = canEditPostV2(post, user, channel);
      expect(result).toBe(true);

      expect(canPostToChannelSpy.mock.calls.length).toBe(1);
      const [arg] = canPostToChannelSpy.mock.calls[0]; // arg for 1st call
      expect(arg).toBe(user);
    });
  });
});
