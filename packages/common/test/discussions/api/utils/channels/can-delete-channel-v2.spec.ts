import { vi, beforeEach, afterEach, describe, it, expect } from "vitest";
import type { IUser } from "@esri/arcgis-rest-portal";
import {
  AclCategory,
  IChannel,
  IDiscussionsUser,
  Role,
} from "../../../../../src/discussions/api//types";
import { canDeleteChannelV2 } from "../../../../../src/discussions/api//utils/channels/can-delete-channel-v2";
import { ChannelPermission } from "../../../../../src/discussions/api//utils/channel-permission";
import * as portalPrivModule from "../../../../../src/discussions/api//utils/portal-privilege";

describe("canDeleteChannelV2", () => {
  let hasOrgAdminDeleteRightsSpy: any;
  let canDeleteChannelSpy: any;

  beforeEach(() => {
    hasOrgAdminDeleteRightsSpy = vi.spyOn(
      portalPrivModule,
      "hasOrgAdminDeleteRights"
    );
    canDeleteChannelSpy = vi.spyOn(
      ChannelPermission.prototype,
      "canDeleteChannel"
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("With Org Admin", () => {
    it("return true if hasOrgAdminDeleteRights returns true", () => {
      hasOrgAdminDeleteRightsSpy.mockImplementation(() => true);
      const user = {} as IDiscussionsUser;
      const channel = { orgId: "aaa" } as IChannel;

      expect(canDeleteChannelV2(channel, user)).toBe(true);

      expect(hasOrgAdminDeleteRightsSpy).toHaveBeenCalledTimes(1);
      const [arg1, arg2] = hasOrgAdminDeleteRightsSpy.mock.calls[0]; // args for 1st call
      expect(arg1).toBe(user);
      expect(arg2).toBe(channel.orgId);

      expect(canDeleteChannelSpy).toHaveBeenCalledTimes(0);
    });
  });

  describe("With channelAcl Permissions", () => {
    it("throws error if channel.channelAcl is undefined", async () => {
      hasOrgAdminDeleteRightsSpy.mockImplementation(() => false);
      const user = {} as IDiscussionsUser;
      const channel = {
        channelAcl: undefined,
      } as IChannel;

      expect(() => canDeleteChannelV2(channel, user)).toThrow(
        new Error("channel.channelAcl is required for ChannelPermission checks")
      );
    });

    it("return true if channelPermission.canModerateChannel is true", () => {
      hasOrgAdminDeleteRightsSpy.mockImplementation(() => false);
      canDeleteChannelSpy.mockImplementation(() => true);

      const user = {} as IDiscussionsUser;
      const channel = {
        channelAcl: [{ category: AclCategory.GROUP, role: Role.MANAGE }],
        creator: "john",
      } as IChannel;

      expect(canDeleteChannelV2(channel, user)).toBe(true);

      expect(canDeleteChannelSpy).toHaveBeenCalledTimes(1);
      const [arg1] = canDeleteChannelSpy.mock.calls[0]; // args for 1st call
      expect(arg1).toBe(user);
    });

    it("return false if channelPermission.canModerateChannel is false", () => {
      hasOrgAdminDeleteRightsSpy.mockImplementation(() => false);
      canDeleteChannelSpy.mockImplementation(() => false);

      const user = {} as IDiscussionsUser;
      const channel = {
        channelAcl: [{ category: AclCategory.ANONYMOUS_USER, role: Role.READ }],
        creator: "john",
      } as IChannel;

      expect(canDeleteChannelV2(channel, user)).toBe(false);

      expect(canDeleteChannelSpy).toHaveBeenCalledTimes(1);
      const [arg1] = canDeleteChannelSpy.mock.calls[0]; // args for 1st call
      expect(arg1).toBe(user);
    });

    it("return false if channelPermission.canModerateChannel is false and user is undefined", () => {
      hasOrgAdminDeleteRightsSpy.mockImplementation(() => false);
      canDeleteChannelSpy.mockImplementation(() => false);

      const user = undefined as unknown as IUser;
      const channel = {
        channelAcl: [{ category: AclCategory.ANONYMOUS_USER, role: Role.READ }],
        creator: "john",
      } as IChannel;

      expect(canDeleteChannelV2(channel, user)).toBe(false);

      expect(canDeleteChannelSpy).toHaveBeenCalledTimes(1);
      const [arg1] = canDeleteChannelSpy.mock.calls[0]; // args for 1st call
      expect(arg1).toEqual({});
    });
  });
});
