import { vi, afterEach, describe, it, expect } from "vitest";
import {
  AclCategory,
  IChannel,
  IDiscussionsUser,
  Role,
} from "../../../../../src/discussions/api/types";
import { ChannelPermission } from "../../../../../src/discussions/api/utils/channel-permission";
import { canCreateReplyV2 } from "../../../../../src/discussions/api/utils/posts/can-create-reply-v2";
import * as portalPrivModule from "../../../../../src/discussions/api/utils/portal-privilege";

describe("canCreateReplyV2", () => {
  afterEach(() => vi.restoreAllMocks());

  describe("With Org Admin", () => {
    it("return true if hasOrgAdminUpdateRights returns true", () => {
      const hasOrgAdminUpdateRightsSpy = vi.spyOn(
        portalPrivModule,
        "hasOrgAdminUpdateRights"
      );
      const canPostToChannelSpy = vi.spyOn(
        ChannelPermission.prototype,
        "canPostToChannel"
      );
      hasOrgAdminUpdateRightsSpy.mockImplementation(() => true);
      canPostToChannelSpy.mockImplementation(() => false);

      const user = {} as IDiscussionsUser;
      const channel = { orgId: "aaa", allowReply: false } as IChannel;

      expect(canCreateReplyV2(channel, user)).toBe(true);

      expect(hasOrgAdminUpdateRightsSpy).toHaveBeenCalledTimes(1);
      const [arg1, arg2] = hasOrgAdminUpdateRightsSpy.mock.calls[0]; // args for 1st call
      expect(arg1).toBe(user);
      expect(arg2).toBe(channel.orgId);

      expect(canPostToChannelSpy).toHaveBeenCalledTimes(0);
    });
  });

  describe("with channelAcl", () => {
    it("throws error if channel.channelAcl is undefined", async () => {
      const hasOrgAdminUpdateRightsSpy = vi.spyOn(
        portalPrivModule,
        "hasOrgAdminUpdateRights"
      );
      hasOrgAdminUpdateRightsSpy.mockImplementation(() => false);
      const user = {} as IDiscussionsUser;
      const channel = {
        allowReply: true,
        channelAcl: undefined,
      } as IChannel;

      expect(() => canCreateReplyV2(channel, user)).toThrow(
        new Error("channel.channelAcl is required for ChannelPermission checks")
      );
    });

    it("return true if channelPermission.canPostToChannel is true", () => {
      const hasOrgAdminUpdateRightsSpy = vi.spyOn(
        portalPrivModule,
        "hasOrgAdminUpdateRights"
      );
      const canPostToChannelSpy = vi.spyOn(
        ChannelPermission.prototype,
        "canPostToChannel"
      );
      hasOrgAdminUpdateRightsSpy.mockImplementation(() => false);
      canPostToChannelSpy.mockImplementation(() => true);

      const user = {} as IDiscussionsUser;
      const channel = {
        allowReply: true,
        channelAcl: [{ category: AclCategory.ANONYMOUS_USER, role: Role.READ }],
      } as IChannel;

      expect(canCreateReplyV2(channel, user)).toBe(true);

      expect(hasOrgAdminUpdateRightsSpy).toHaveBeenCalledTimes(1);

      expect(canPostToChannelSpy).toHaveBeenCalledTimes(1);
      const [arg] = canPostToChannelSpy.mock.calls[0]; // arg for 1st call
      expect(arg).toBe(user);
    });

    it("return false if channelPermission.canPostToChannel is false", () => {
      const hasOrgAdminUpdateRightsSpy = vi.spyOn(
        portalPrivModule,
        "hasOrgAdminUpdateRights"
      );
      const canPostToChannelSpy = vi.spyOn(
        ChannelPermission.prototype,
        "canPostToChannel"
      );
      hasOrgAdminUpdateRightsSpy.mockImplementation(() => false);
      canPostToChannelSpy.mockImplementation(() => false);

      const user = {} as IDiscussionsUser;
      const channel = {
        allowReply: true,
        channelAcl: [{ category: AclCategory.ANONYMOUS_USER, role: Role.READ }],
      } as IChannel;

      expect(canCreateReplyV2(channel, user)).toBe(false);

      expect(hasOrgAdminUpdateRightsSpy).toHaveBeenCalledTimes(1);

      expect(canPostToChannelSpy).toHaveBeenCalledTimes(1);
      const [arg] = canPostToChannelSpy.mock.calls[0]; // arg for 1st call
      expect(arg).toBe(user);
    });

    it("return false if user is undefined", () => {
      const hasOrgAdminUpdateRightsSpy = vi.spyOn(
        portalPrivModule,
        "hasOrgAdminUpdateRights"
      );
      const canPostToChannelSpy = vi.spyOn(
        ChannelPermission.prototype,
        "canPostToChannel"
      );
      hasOrgAdminUpdateRightsSpy.mockImplementation(() => false);
      canPostToChannelSpy.mockImplementation(() => false);

      const user = undefined as IDiscussionsUser;
      const channel = {
        allowReply: true,
        channelAcl: [{ category: AclCategory.ANONYMOUS_USER, role: Role.READ }],
      } as IChannel;

      expect(canCreateReplyV2(channel, user)).toBe(false);

      expect(hasOrgAdminUpdateRightsSpy).toHaveBeenCalledTimes(1);

      expect(canPostToChannelSpy).toHaveBeenCalledTimes(1);
      const [arg] = canPostToChannelSpy.mock.calls[0]; // arg for 1st call
      expect(arg).toEqual({});
    });

    it("return false if channel.allowReply is false", () => {
      const hasOrgAdminUpdateRightsSpy = vi.spyOn(
        portalPrivModule,
        "hasOrgAdminUpdateRights"
      );
      const canPostToChannelSpy = vi.spyOn(
        ChannelPermission.prototype,
        "canPostToChannel"
      );
      hasOrgAdminUpdateRightsSpy.mockImplementation(() => false);
      canPostToChannelSpy.mockImplementation(() => true);

      const user = {} as IDiscussionsUser;
      const channel = {
        allowReply: false,
        channelAcl: [{ category: AclCategory.ANONYMOUS_USER, role: Role.READ }],
      } as IChannel;

      expect(canCreateReplyV2(channel, user)).toBe(false);

      expect(hasOrgAdminUpdateRightsSpy).toHaveBeenCalledTimes(1);

      expect(canPostToChannelSpy).toHaveBeenCalledTimes(0);
    });
  });
});
