import { vi, afterEach, describe, it, expect } from "vitest";
import {
  IChannel,
  IDiscussionsUser,
} from "../../../../../src/discussions/api/types";
import { canEditPostStatusV2 } from "../../../../../src/discussions/api/utils/posts/can-edit-post-status-v2";
import { ChannelPermission } from "../../../../../src/discussions/api/utils/channel-permission";
import * as portalPrivModule from "../../../../../src/discussions/api/utils/portal-privilege";
import { AclCategory } from "../../../../../src/discussions/api/enums/aclCategory";
import { Role } from "../../../../../src/discussions/api/enums/role";

describe("canEditPostStatusV2", () => {
  describe("With channelAcl Permissions", () => {
    afterEach(() => vi.restoreAllMocks());

    it("return true if user is org_admin", () => {
      const hasOrgAdminUpdateRightsSpy = vi.spyOn(
        portalPrivModule,
        "hasOrgAdminUpdateRights"
      );
      const canModerateChannelSpy = vi.spyOn(
        ChannelPermission.prototype,
        "canModerateChannel"
      );
      hasOrgAdminUpdateRightsSpy.mockImplementation(() => true);
      canModerateChannelSpy.mockImplementation(() => false);

      const user = {} as IDiscussionsUser;
      const channel = {
        channelAcl: [{ category: AclCategory.ANONYMOUS_USER, role: Role.READ }],
        creator: "john",
      } as IChannel;

      expect(canEditPostStatusV2(channel, user)).toBe(true);

      expect(hasOrgAdminUpdateRightsSpy).toHaveBeenCalledTimes(1);
      const [arg1, arg2] = hasOrgAdminUpdateRightsSpy.mock.calls[0]; // args for 1st call
      expect(arg1).toBe(user);
      expect(arg2).toBe(channel.orgId);

      expect(canModerateChannelSpy).toHaveBeenCalledTimes(0);
    });

    it("return false if user is undefined", () => {
      const hasOrgAdminUpdateRightsSpy = vi.spyOn(
        portalPrivModule,
        "hasOrgAdminUpdateRights"
      );
      const canModerateChannelSpy = vi.spyOn(
        ChannelPermission.prototype,
        "canModerateChannel"
      );
      hasOrgAdminUpdateRightsSpy.mockImplementation(() => false);
      canModerateChannelSpy.mockImplementation(() => false);

      const user = undefined as IDiscussionsUser;
      const channel = {
        channelAcl: [{ category: AclCategory.ANONYMOUS_USER, role: Role.READ }],
        creator: "john",
        orgId: "aaa",
      } as IChannel;

      expect(canEditPostStatusV2(channel, user)).toBe(false);

      expect(hasOrgAdminUpdateRightsSpy).toHaveBeenCalledTimes(1);
      const [arg1, arg2] = hasOrgAdminUpdateRightsSpy.mock.calls[0]; // args for 1st call
      expect(arg1).toEqual({});
      expect(arg2).toBe(channel.orgId);

      expect(canModerateChannelSpy).toHaveBeenCalledTimes(1);
      const [canModerateArg1] = canModerateChannelSpy.mock.calls[0]; // args for 1st call
      expect(canModerateArg1).toEqual({});
    });

    it("return true if channelPermission.canEditPostStatus is true", () => {
      const hasOrgAdminUpdateRightsSpy = vi.spyOn(
        portalPrivModule,
        "hasOrgAdminUpdateRights"
      );
      const canModerateChannelSpy = vi.spyOn(
        ChannelPermission.prototype,
        "canModerateChannel"
      );
      hasOrgAdminUpdateRightsSpy.mockImplementation(() => false);
      canModerateChannelSpy.mockImplementation(() => true);

      const user = {} as IDiscussionsUser;
      const channel = {
        channelAcl: [{ category: AclCategory.ANONYMOUS_USER, role: Role.READ }],
        creator: "john",
      } as IChannel;

      expect(canEditPostStatusV2(channel, user)).toBe(true);

      expect(hasOrgAdminUpdateRightsSpy).toHaveBeenCalledTimes(1);
      const [arg1, arg2] = hasOrgAdminUpdateRightsSpy.mock.calls[0]; // args for 1st call
      expect(arg1).toBe(user);
      expect(arg2).toBe(channel.orgId);

      expect(canModerateChannelSpy).toHaveBeenCalledTimes(1);
      const [canModerateArg1] = canModerateChannelSpy.mock.calls[0]; // args for 1st call
      expect(canModerateArg1).toBe(user);
    });

    it("return false if channelPermission.canEditPostStatus is false", () => {
      const hasOrgAdminUpdateRightsSpy = vi.spyOn(
        portalPrivModule,
        "hasOrgAdminUpdateRights"
      );
      const canModerateChannelSpy = vi.spyOn(
        ChannelPermission.prototype,
        "canModerateChannel"
      );
      hasOrgAdminUpdateRightsSpy.mockImplementation(() => false);
      canModerateChannelSpy.mockImplementation(() => false);

      const user = {} as IDiscussionsUser;
      const channel = {
        channelAcl: [{ category: AclCategory.ANONYMOUS_USER, role: Role.READ }],
        creator: "john",
      } as IChannel;

      expect(canEditPostStatusV2(channel, user)).toBe(false);

      expect(hasOrgAdminUpdateRightsSpy).toHaveBeenCalledTimes(1);
      const [arg1, arg2] = hasOrgAdminUpdateRightsSpy.mock.calls[0]; // args for 1st call
      expect(arg1).toBe(user);
      expect(arg2).toBe(channel.orgId);

      expect(canModerateChannelSpy).toHaveBeenCalledTimes(1);
      const [canModerateArg1] = canModerateChannelSpy.mock.calls[0]; // args for 1st call
      expect(canModerateArg1).toBe(user);
    });
  });
});
