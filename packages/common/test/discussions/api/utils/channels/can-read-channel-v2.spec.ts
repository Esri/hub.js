import { vi, afterEach, describe, it, expect } from "vitest";
import {
  AclCategory,
  IChannel,
  IDiscussionsUser,
  Role,
} from "../../../../../src/discussions/api/types";
import { ChannelPermission } from "../../../../../src/discussions/api/utils/channel-permission";
import { canReadChannelV2 } from "../../../../../src/discussions/api/utils/channels/can-read-channel-v2";
import * as portalPrivModule from "../../../../../src/discussions/api/utils/portal-privilege";

describe("canReadChannelV2", () => {
  afterEach(() => vi.restoreAllMocks());

  describe("With Org Admin", () => {
    it("return true if hasOrgAdminUpdateRights returns true", () => {
      const hasOrgAdminViewRightsSpy = vi.spyOn(
        portalPrivModule,
        "hasOrgAdminViewRights"
      );
      const canReadChannelSpy = vi.spyOn(
        ChannelPermission.prototype,
        "canReadChannel"
      );
      hasOrgAdminViewRightsSpy.mockImplementation(() => true);
      const user = {} as IDiscussionsUser;
      const channel = { orgId: "aaa" } as IChannel;

      expect(canReadChannelV2(channel, user)).toBe(true);

      expect(hasOrgAdminViewRightsSpy).toHaveBeenCalledTimes(1);
      const [arg1, arg2] = hasOrgAdminViewRightsSpy.mock.calls[0]; // args for 1st call
      expect(arg1).toBe(user);
      expect(arg2).toBe(channel.orgId);

      expect(canReadChannelSpy).toHaveBeenCalledTimes(0);
    });
  });

  describe("with channelAcl", () => {
    it("throws error if channel.channelAcl is undefined", async () => {
      const hasOrgAdminViewRightsSpy = vi.spyOn(
        portalPrivModule,
        "hasOrgAdminViewRights"
      );
      hasOrgAdminViewRightsSpy.mockImplementation(() => false);

      const user = {} as IDiscussionsUser;
      const channel = {
        channelAcl: undefined,
      } as IChannel;

      expect(() => canReadChannelV2(channel, user)).toThrow(
        new Error("channel.channelAcl is required for ChannelPermission checks")
      );
    });

    it("return true if channelPermission.canReadChannel is true", () => {
      const hasOrgAdminViewRightsSpy = vi.spyOn(
        portalPrivModule,
        "hasOrgAdminViewRights"
      );
      const canReadChannelSpy = vi.spyOn(
        ChannelPermission.prototype,
        "canReadChannel"
      );
      hasOrgAdminViewRightsSpy.mockImplementation(() => false);
      canReadChannelSpy.mockImplementation(() => true);

      const user = {} as IDiscussionsUser;
      const channel = {
        channelAcl: [{ category: AclCategory.ANONYMOUS_USER, role: Role.READ }],
      } as IChannel;

      expect(canReadChannelV2(channel, user)).toBe(true);

      expect(canReadChannelSpy).toHaveBeenCalledTimes(1);
      const [arg] = canReadChannelSpy.mock.calls[0]; // arg for 1st call
      expect(arg).toBe(user);
    });

    it("return false if channelPermission.canReadChannel is false", () => {
      const hasOrgAdminViewRightsSpy = vi.spyOn(
        portalPrivModule,
        "hasOrgAdminViewRights"
      );
      const canReadChannelSpy = vi.spyOn(
        ChannelPermission.prototype,
        "canReadChannel"
      );
      hasOrgAdminViewRightsSpy.mockImplementation(() => false);
      canReadChannelSpy.mockImplementation(() => false);

      const user = {} as IDiscussionsUser;
      const channel = {
        channelAcl: [
          { category: AclCategory.ANONYMOUS_USER, role: Role.WRITE },
        ],
      } as IChannel;

      expect(canReadChannelV2(channel, user)).toBe(false);

      expect(canReadChannelSpy).toHaveBeenCalledTimes(1);
      const [arg] = canReadChannelSpy.mock.calls[0]; // arg for 1st call
      expect(arg).toBe(user);
    });

    it("return false if user is undefined", () => {
      const hasOrgAdminViewRightsSpy = vi.spyOn(
        portalPrivModule,
        "hasOrgAdminViewRights"
      );
      const canReadChannelSpy = vi.spyOn(
        ChannelPermission.prototype,
        "canReadChannel"
      );
      hasOrgAdminViewRightsSpy.mockImplementation(() => false);
      canReadChannelSpy.mockImplementation(() => false);

      const user = undefined as IDiscussionsUser;
      const channel = {
        channelAcl: [
          { category: AclCategory.ANONYMOUS_USER, role: Role.WRITE },
        ],
      } as IChannel;

      expect(canReadChannelV2(channel, user)).toBe(false);

      expect(canReadChannelSpy).toHaveBeenCalledTimes(1);
      const [arg] = canReadChannelSpy.mock.calls[0]; // arg for 1st call
      expect(arg).toEqual({});
    });
  });
});
