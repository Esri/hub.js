import type { IUser } from "../../../../../src/rest/types";
import {
  AclCategory,
  IChannel,
  IDiscussionsUser,
  Role,
} from "../../../../../src/discussions/api//types";
import { canDeleteChannelV2 } from "../../../../../src/discussions/api//utils/channels";
import { ChannelPermission } from "../../../../../src/discussions/api//utils/channel-permission";
import * as portalPrivModule from "../../../../../src/discussions/api//utils/portal-privilege";

describe("canDeleteChannelV2", () => {
  let hasOrgAdminDeleteRightsSpy: jasmine.Spy;
  let canDeleteChannelSpy: jasmine.Spy;

  beforeAll(() => {
    hasOrgAdminDeleteRightsSpy = spyOn(
      portalPrivModule,
      "hasOrgAdminDeleteRights"
    );
    canDeleteChannelSpy = spyOn(
      ChannelPermission.prototype,
      "canDeleteChannel"
    );
  });

  beforeEach(() => {
    hasOrgAdminDeleteRightsSpy.calls.reset();
    canDeleteChannelSpy.calls.reset();
  });

  describe("With Org Admin", () => {
    it("return true if hasOrgAdminDeleteRights returns true", () => {
      hasOrgAdminDeleteRightsSpy.and.callFake(() => true);
      const user = {} as IDiscussionsUser;
      const channel = { orgId: "aaa" } as IChannel;

      expect(canDeleteChannelV2(channel, user)).toBe(true);

      expect(hasOrgAdminDeleteRightsSpy.calls.count()).toBe(1);
      const [arg1, arg2] = hasOrgAdminDeleteRightsSpy.calls.allArgs()[0]; // args for 1st call
      expect(arg1).toBe(user);
      expect(arg2).toBe(channel.orgId);

      expect(canDeleteChannelSpy.calls.count()).toBe(0);
    });
  });

  describe("With channelAcl Permissions", () => {
    it("throws error if channel.channelAcl is undefined", async () => {
      hasOrgAdminDeleteRightsSpy.and.callFake(() => false);

      const user = {} as IDiscussionsUser;
      const channel = {
        channelAcl: undefined,
      } as IChannel;

      expect(() => canDeleteChannelV2(channel, user)).toThrow(
        new Error("channel.channelAcl is required for ChannelPermission checks")
      );
    });

    it("return true if channelPermission.canModerateChannel is true", () => {
      hasOrgAdminDeleteRightsSpy.and.callFake(() => false);
      canDeleteChannelSpy.and.callFake(() => true);

      const user = {} as IDiscussionsUser;
      const channel = {
        channelAcl: [{ category: AclCategory.GROUP, role: Role.MANAGE }],
        creator: "john",
      } as IChannel;

      expect(canDeleteChannelV2(channel, user)).toBe(true);

      expect(canDeleteChannelSpy.calls.count()).toBe(1);
      const [arg1] = canDeleteChannelSpy.calls.allArgs()[0]; // args for 1st call
      expect(arg1).toBe(user);
    });

    it("return false if channelPermission.canModerateChannel is false", () => {
      hasOrgAdminDeleteRightsSpy.and.callFake(() => false);
      canDeleteChannelSpy.and.callFake(() => false);

      const user = {} as IDiscussionsUser;
      const channel = {
        channelAcl: [{ category: AclCategory.ANONYMOUS_USER, role: Role.READ }],
        creator: "john",
      } as IChannel;

      expect(canDeleteChannelV2(channel, user)).toBe(false);

      expect(canDeleteChannelSpy.calls.count()).toBe(1);
      const [arg1] = canDeleteChannelSpy.calls.allArgs()[0]; // args for 1st call
      expect(arg1).toBe(user);
    });

    it("return false if channelPermission.canModerateChannel is false and user is undefined", () => {
      hasOrgAdminDeleteRightsSpy.and.callFake(() => false);
      canDeleteChannelSpy.and.callFake(() => false);

      const user = undefined as unknown as IUser;
      const channel = {
        channelAcl: [{ category: AclCategory.ANONYMOUS_USER, role: Role.READ }],
        creator: "john",
      } as IChannel;

      expect(canDeleteChannelV2(channel, user)).toBe(false);

      expect(canDeleteChannelSpy.calls.count()).toBe(1);
      const [arg1] = canDeleteChannelSpy.calls.allArgs()[0]; // args for 1st call
      expect(arg1).toEqual({});
    });
  });
});
