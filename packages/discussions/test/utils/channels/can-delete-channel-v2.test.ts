import { IGroup, IUser } from "@esri/arcgis-rest-types";
import {
  AclCategory,
  IChannelV2,
  IDiscussionsUser,
  Role,
} from "../../../src/types";
import { canDeleteChannelV2 } from "../../../src/utils/channels";
import { ChannelPermission } from "../../../src/utils/channel-permission";
import * as portalPrivModule from "../../../src/utils/portal-privilege";

describe("canDeleteChannelV2", () => {
  let hasOrgAdminDeleteRightsSpy: jasmine.Spy;
  let canModerateChannelSpy: jasmine.Spy;

  beforeAll(() => {
    hasOrgAdminDeleteRightsSpy = spyOn(
      portalPrivModule,
      "hasOrgAdminDeleteRights"
    );
    canModerateChannelSpy = spyOn(
      ChannelPermission.prototype,
      "canModerateChannel"
    );
  });

  beforeEach(() => {
    hasOrgAdminDeleteRightsSpy.calls.reset();
    canModerateChannelSpy.calls.reset();
  });

  describe("With Org Admin", () => {
    it("return true if hasOrgAdminDeleteRights returns true", () => {
      hasOrgAdminDeleteRightsSpy.and.callFake(() => true);
      const user = {} as IDiscussionsUser;
      const channel = { orgId: "aaa" } as IChannelV2;

      expect(canDeleteChannelV2(channel, user)).toBe(true);

      expect(hasOrgAdminDeleteRightsSpy.calls.count()).toBe(1);
      const [arg1, arg2] = hasOrgAdminDeleteRightsSpy.calls.allArgs()[0]; // args for 1st call
      expect(arg1).toBe(user);
      expect(arg2).toBe(channel.orgId);

      expect(canModerateChannelSpy.calls.count()).toBe(0);
    });
  });

  describe("With channelAcl Permissions", () => {
    it("throws error if channel.channelAcl is undefined", async () => {
      hasOrgAdminDeleteRightsSpy.and.callFake(() => false);

      const user = {} as IDiscussionsUser;
      const channel = {
        channelAcl: undefined,
      } as IChannelV2;

      expect(() => canDeleteChannelV2(channel, user)).toThrow(
        new Error("channel.channelAcl is required for ChannelPermission checks")
      );
    });

    it("return true if channelPermission.canModerateChannel is true", () => {
      hasOrgAdminDeleteRightsSpy.and.callFake(() => false);
      canModerateChannelSpy.and.callFake(() => true);

      const user = {} as IDiscussionsUser;
      const channel = {
        channelAcl: [{ category: AclCategory.GROUP, role: Role.MANAGE }],
        creator: "john",
      } as IChannelV2;

      expect(canDeleteChannelV2(channel, user)).toBe(true);

      expect(canModerateChannelSpy.calls.count()).toBe(1);
      const [arg1] = canModerateChannelSpy.calls.allArgs()[0]; // args for 1st call
      expect(arg1).toBe(user);
    });

    it("return false if channelPermission.canModerateChannel is false", () => {
      hasOrgAdminDeleteRightsSpy.and.callFake(() => false);
      canModerateChannelSpy.and.callFake(() => false);

      const user = {} as IDiscussionsUser;
      const channel = {
        channelAcl: [{ category: AclCategory.ANONYMOUS_USER, role: Role.READ }],
        creator: "john",
      } as IChannelV2;

      expect(canDeleteChannelV2(channel, user)).toBe(false);

      expect(canModerateChannelSpy.calls.count()).toBe(1);
      const [arg1] = canModerateChannelSpy.calls.allArgs()[0]; // args for 1st call
      expect(arg1).toBe(user);
    });

    it("return false if channelPermission.canModerateChannel is false and user is undefined", () => {
      hasOrgAdminDeleteRightsSpy.and.callFake(() => false);
      canModerateChannelSpy.and.callFake(() => false);

      const user = undefined as unknown as IUser;
      const channel = {
        channelAcl: [{ category: AclCategory.ANONYMOUS_USER, role: Role.READ }],
        creator: "john",
      } as IChannelV2;

      expect(canDeleteChannelV2(channel, undefined)).toBe(false);

      expect(canModerateChannelSpy.calls.count()).toBe(1);
      const [arg1] = canModerateChannelSpy.calls.allArgs()[0]; // args for 1st call
      expect(arg1).toEqual({});
    });
  });
});
