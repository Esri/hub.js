import { IChannelV2, IDiscussionsUser, IPost } from "../../../src/types";
import { canEditPostV2 } from "../../../src/utils/posts";
import { ChannelPermission } from "../../../src/utils/channel-permission";

describe("canEditPostV2", () => {
  let canPostToChannelSpy: jasmine.Spy;

  beforeAll(() => {
    canPostToChannelSpy = spyOn(
      ChannelPermission.prototype,
      "canPostToChannel"
    );
  });

  beforeEach(() => {
    canPostToChannelSpy.calls.reset();
  });

  describe("POST", () => {
    it("returns false if the user did not create the post", () => {
      const post = { id: "postId", creator: "john" } as IPost;
      const user = { username: "notJohn" } as IDiscussionsUser;
      const channel = {
        allowPost: true,
        channelAcl: [],
      } as unknown as IChannelV2;

      const result = canEditPostV2(post, user, channel);
      expect(result).toBe(false);
      expect(canPostToChannelSpy.calls.count()).toBe(0);
    });

    it("returns false if the user is not logged in", () => {
      const post = { id: "postId" } as IPost; // asAnonymous post
      const user = {} as IDiscussionsUser;
      const channel = {
        allowPost: true,
        channelAcl: [],
      } as unknown as IChannelV2;

      const result = canEditPostV2(post, user, channel);
      expect(result).toBe(false);
      expect(canPostToChannelSpy.calls.count()).toBe(0);
    });

    it("returns false if the user undefined", () => {
      const post = { id: "postId" } as IPost; // asAnonymous post
      const user = undefined as unknown as IDiscussionsUser;
      const channel = {
        allowPost: true,
        channelAcl: [],
      } as unknown as IChannelV2;

      const result = canEditPostV2(post, user, channel);
      expect(result).toBe(false);
      expect(canPostToChannelSpy.calls.count()).toBe(0);
    });

    it("returns false if user created the post but channel.allowPost is false", () => {
      canPostToChannelSpy.and.callFake(() => true);

      const post = { id: "postId", creator: "john" } as IPost;
      const user = { username: "john" } as IDiscussionsUser;
      const channel = {
        allowPost: false,
        channelAcl: [],
      } as unknown as IChannelV2;

      const result = canEditPostV2(post, user, channel);
      expect(result).toBe(false);
      expect(canPostToChannelSpy.calls.count()).toBe(0);
    });

    it("returns false if the user created the post and canPostToChannel returns false", () => {
      canPostToChannelSpy.and.callFake(() => false);

      const post = { id: "postId", creator: "john" } as IPost;
      const user = { username: "john" } as IDiscussionsUser;
      const channel = {
        allowPost: true,
        channelAcl: [],
      } as unknown as IChannelV2;

      const result = canEditPostV2(post, user, channel);
      expect(result).toBe(false);
      expect(canPostToChannelSpy.calls.count()).toBe(1);
      const [arg] = canPostToChannelSpy.calls.allArgs()[0]; // arg for 1st call
      expect(arg).toBe(user);
    });

    it("returns true if the user created the post and canPostToChannel returns false", () => {
      canPostToChannelSpy.and.callFake(() => true);

      const post = { id: "postId", creator: "john" } as IPost;
      const user = { username: "john" } as IDiscussionsUser;
      const channel = {
        allowPost: true,
        channelAcl: [],
      } as unknown as IChannelV2;

      const result = canEditPostV2(post, user, channel);
      expect(result).toBe(true);

      expect(canPostToChannelSpy.calls.count()).toBe(1);
      const [arg] = canPostToChannelSpy.calls.allArgs()[0]; // arg for 1st call
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
      } as unknown as IChannelV2;

      const result = canEditPostV2(post, user, channel);
      expect(result).toBe(false);
      expect(canPostToChannelSpy.calls.count()).toBe(0);
    });

    it("returns false if the user is not logged in", () => {
      const post = { id: "postId", parentId: "aaa" } as IPost; // asAnonymous post
      const user = {} as IDiscussionsUser;
      const channel = {
        allowReply: true,
        channelAcl: [],
      } as unknown as IChannelV2;

      const result = canEditPostV2(post, user, channel);
      expect(result).toBe(false);
      expect(canPostToChannelSpy.calls.count()).toBe(0);
    });

    it("returns false if the user undefined", () => {
      const post = { id: "postId", parentId: "aaa" } as IPost; // asAnonymous post
      const user = undefined as unknown as IDiscussionsUser;
      const channel = {
        allowReply: true,
        channelAcl: [],
      } as unknown as IChannelV2;

      const result = canEditPostV2(post, user, channel);
      expect(result).toBe(false);
      expect(canPostToChannelSpy.calls.count()).toBe(0);
    });

    it("returns false if user created the reply but channel.allowReply is false", () => {
      canPostToChannelSpy.and.callFake(() => true);

      const post = { id: "postId", creator: "john", parentId: "aaa" } as IPost;
      const user = { username: "john" } as IDiscussionsUser;
      const channel = {
        allowReply: false,
        channelAcl: [],
      } as unknown as IChannelV2;

      const result = canEditPostV2(post, user, channel);
      expect(result).toBe(false);

      expect(canPostToChannelSpy.calls.count()).toBe(0);
    });

    it("returns false if the user created the reply and canPostToChannel returns false", () => {
      canPostToChannelSpy.and.callFake(() => false);

      const post = { id: "postId", creator: "john", parentId: "aaa" } as IPost;
      const user = { username: "john" } as IDiscussionsUser;
      const channel = {
        allowReply: true,
        channelAcl: [],
      } as unknown as IChannelV2;

      const result = canEditPostV2(post, user, channel);
      expect(result).toBe(false);

      expect(canPostToChannelSpy.calls.count()).toBe(1);
      const [arg] = canPostToChannelSpy.calls.allArgs()[0]; // arg for 1st call
      expect(arg).toBe(user);
    });

    it("returns true if the user created the reply and canPostToChannel returns true", () => {
      canPostToChannelSpy.and.callFake(() => true);

      const post = { id: "postId", creator: "john", parentId: "aaa" } as IPost;
      const user = { username: "john" } as IDiscussionsUser;
      const channel = {
        allowReply: true,
        channelAcl: [],
      } as unknown as IChannelV2;

      const result = canEditPostV2(post, user, channel);
      expect(result).toBe(true);

      expect(canPostToChannelSpy.calls.count()).toBe(1);
      const [arg] = canPostToChannelSpy.calls.allArgs()[0]; // arg for 1st call
      expect(arg).toBe(user);
    });
  });
});
