import { vi, beforeEach, afterEach, describe, it, expect } from "vitest";
import {
  AclCategory,
  IChannel,
  IDiscussionsUser,
  IUpdateChannelV2,
  Role,
} from "../../../../../src/discussions/api/types";
import { canEditChannelV2 } from "../../../../../src/discussions/api/utils/channels/can-edit-channel-v2";
import { ChannelPermission } from "../../../../../src/discussions/api/utils/channel-permission";
import * as portalPrivModule from "../../../../../src/discussions/api/utils/portal-privilege";

describe("canEditChannelV2", () => {
  let hasOrgAdminUpdateRightsSpy: any;
  let canModerateChannelSpy: any;
  let canUpdatePropertiesSpy: any;

  beforeEach(() => {
    hasOrgAdminUpdateRightsSpy = vi.spyOn(
      portalPrivModule,
      "hasOrgAdminUpdateRights"
    );
    canModerateChannelSpy = vi.spyOn(
      ChannelPermission.prototype,
      "canModerateChannel"
    );
    canUpdatePropertiesSpy = vi.spyOn(
      ChannelPermission.prototype,
      "canUpdateProperties"
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("With Org Admin", () => {
    it("return true if hasOrgAdminUpdateRights returns true", () => {
      hasOrgAdminUpdateRightsSpy.mockImplementation(() => true);
      const user = {} as IDiscussionsUser;
      const channel = { orgId: "aaa" } as IChannel;
      const updateData = { allowPost: false } as IUpdateChannelV2;

      expect(canEditChannelV2(channel, user, updateData)).toBe(true);

      expect(hasOrgAdminUpdateRightsSpy).toHaveBeenCalledTimes(1);
      const [arg1, arg2] = hasOrgAdminUpdateRightsSpy.mock.calls[0]; // args for 1st call
      expect(arg1).toBe(user);
      expect(arg2).toBe(channel.orgId);

      expect(canModerateChannelSpy).toHaveBeenCalledTimes(0);
      expect(canUpdatePropertiesSpy).toHaveBeenCalledTimes(0);
    });
  });

  describe("With channelAcl Permissions", () => {
    it("throws error if channel.channelAcl is undefined", async () => {
      hasOrgAdminUpdateRightsSpy.mockImplementation(() => false);

      const user = {} as IDiscussionsUser;
      const channel = {
        channelAcl: undefined,
      } as IChannel;
      const updateData = { allowPost: false } as IUpdateChannelV2;

      expect(() => canEditChannelV2(channel, user, updateData)).toThrow(
        new Error("channel.channelAcl is required for ChannelPermission checks")
      );
    });

    it("return true if channelPermission.canModerateChannel and channelPermission.canUpdateProperties is true", () => {
      hasOrgAdminUpdateRightsSpy.mockImplementation(() => false);
      canModerateChannelSpy.mockImplementation(() => true);
      canUpdatePropertiesSpy.mockImplementation(() => true);

      const user = {} as IDiscussionsUser;
      const channel = {
        channelAcl: [{ category: AclCategory.GROUP, role: Role.MANAGE }],
        creator: "john",
      } as IChannel;
      const updateData = { allowPost: false } as IUpdateChannelV2;

      expect(canEditChannelV2(channel, user, updateData)).toBe(true);

      expect(canModerateChannelSpy).toHaveBeenCalledTimes(1);
      const [arg1] = canModerateChannelSpy.mock.calls[0]; // args for 1st call
      expect(arg1).toBe(user);

      expect(canUpdatePropertiesSpy).toHaveBeenCalledTimes(1);
      const [updateArg1, updateArg2] = canUpdatePropertiesSpy.mock.calls[0]; // args for 1st call
      expect(updateArg1).toEqual(user);
      expect(updateArg2).toEqual(updateData);
    });

    it("return false if channelPermission.canModerateChannel is false", () => {
      hasOrgAdminUpdateRightsSpy.mockImplementation(() => false);
      canModerateChannelSpy.mockImplementation(() => false);
      canUpdatePropertiesSpy.mockImplementation(() => true);

      const user = {} as IDiscussionsUser;
      const channel = {
        channelAcl: [{ category: AclCategory.ANONYMOUS_USER, role: Role.READ }],
        creator: "john",
      } as IChannel;
      const updateData = { allowPost: false } as IUpdateChannelV2;

      expect(canEditChannelV2(channel, user, updateData)).toBe(false);

      expect(canModerateChannelSpy).toHaveBeenCalledTimes(1);
      const [arg1] = canModerateChannelSpy.mock.calls[0]; // args for 1st call
      expect(arg1).toBe(user);

      expect(canUpdatePropertiesSpy).toHaveBeenCalledTimes(0);
    });

    it("return false if channelPermission.canModerateChannel is true and channelPermission.canUpdateProperties is false", () => {
      hasOrgAdminUpdateRightsSpy.mockImplementation(() => false);
      canModerateChannelSpy.mockImplementation(() => true);
      canUpdatePropertiesSpy.mockImplementation(() => false);

      const user = {} as IDiscussionsUser;
      const channel = {
        channelAcl: [{ category: AclCategory.ANONYMOUS_USER, role: Role.READ }],
        creator: "john",
      } as IChannel;
      const updateData = { allowPost: false } as IUpdateChannelV2;

      expect(canEditChannelV2(channel, user, updateData)).toBe(false);

      expect(canModerateChannelSpy).toHaveBeenCalledTimes(1);
      const [arg1] = canModerateChannelSpy.mock.calls[0]; // args for 1st call
      expect(arg1).toEqual(user);

      expect(canUpdatePropertiesSpy).toHaveBeenCalledTimes(1);
      const [updateArg1, updateArg2] = canUpdatePropertiesSpy.mock.calls[0]; // args for 1st call
      expect(updateArg1).toEqual(user);
      expect(updateArg2).toEqual(updateData);
    });

    it("return false if user is undefined", () => {
      hasOrgAdminUpdateRightsSpy.mockImplementation(() => false);
      canModerateChannelSpy.mockImplementation(() => false);
      canUpdatePropertiesSpy.mockImplementation(() => false);

      const user = undefined as IDiscussionsUser;
      const channel = {
        channelAcl: [{ category: AclCategory.ANONYMOUS_USER, role: Role.READ }],
        creator: "john",
      } as IChannel;
      const updateData = { allowPost: false } as IUpdateChannelV2;

      expect(canEditChannelV2(channel, user, updateData)).toBe(false);

      expect(canModerateChannelSpy).toHaveBeenCalledTimes(1);
      const [arg1] = canModerateChannelSpy.mock.calls[0]; // args for 1st call
      expect(arg1).toEqual({});

      expect(canUpdatePropertiesSpy).toHaveBeenCalledTimes(0);
    });
  });
});
