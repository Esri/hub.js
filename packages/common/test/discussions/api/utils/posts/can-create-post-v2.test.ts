import {
  IChannel,
  IDiscussionsUser,
} from "../../../../../src/discussions/api//types";
import { ChannelPermission } from "../../../../../src/discussions/api//utils/channel-permission";
import { canCreatePostV2 } from "../../../../../src/discussions/api//utils/posts/can-create-post-v2";
import * as portalPrivModule from "../../../../../src/discussions/api//utils/portal-privilege";
import { AclCategory } from "../../../../../src/discussions/api/enums/aclCategory";
import { Role } from "../../../../../src/discussions/api/enums/role";

describe("canCreatePostV2", () => {
  let canPostToChannelSpy: jasmine.Spy;
  let hasOrgAdminUpdateRightsSpy: jasmine.Spy;

  beforeAll(() => {
    hasOrgAdminUpdateRightsSpy = spyOn(
      portalPrivModule,
      "hasOrgAdminUpdateRights"
    );
    canPostToChannelSpy = spyOn(
      ChannelPermission.prototype,
      "canPostToChannel"
    );
  });

  beforeEach(() => {
    hasOrgAdminUpdateRightsSpy.calls.reset();
    canPostToChannelSpy.calls.reset();
  });

  describe("With Org Admin", () => {
    it("return true if hasOrgAdminUpdateRights returns true", () => {
      hasOrgAdminUpdateRightsSpy.and.callFake(() => true);
      canPostToChannelSpy.and.callFake(() => false);

      const user = {} as IDiscussionsUser;
      const channel = { orgId: "aaa", allowPost: false } as IChannel; // bypass channel setting check

      expect(canCreatePostV2(channel, user)).toBe(true);

      expect(hasOrgAdminUpdateRightsSpy.calls.count()).toBe(1);
      const [arg1, arg2] = hasOrgAdminUpdateRightsSpy.calls.allArgs()[0]; // args for 1st call
      expect(arg1).toBe(user);
      expect(arg2).toBe(channel.orgId);

      expect(canPostToChannelSpy.calls.count()).toBe(0);
    });
  });

  describe("with channelAcl", () => {
    it("throws error if channel.channelAcl is undefined", async () => {
      hasOrgAdminUpdateRightsSpy.and.callFake(() => false);
      const user = {} as IDiscussionsUser;
      const channel = {
        allowPost: true,
        channelAcl: undefined,
      } as IChannel;

      expect(() => canCreatePostV2(channel, user)).toThrow(
        new Error("channel.channelAcl is required for ChannelPermission checks")
      );
    });

    it("return false if channel.allowPost is false", () => {
      hasOrgAdminUpdateRightsSpy.and.callFake(() => false);
      canPostToChannelSpy.and.callFake(() => true);

      const user = {} as IDiscussionsUser;
      const channel = {
        allowPost: false,
        channelAcl: [{ category: AclCategory.ANONYMOUS_USER, role: Role.READ }],
      } as IChannel;

      expect(canCreatePostV2(channel, user)).toBe(false);

      expect(hasOrgAdminUpdateRightsSpy.calls.count()).toBe(1);

      expect(canPostToChannelSpy.calls.count()).toBe(0);
    });

    it("return false if user is undefined", () => {
      hasOrgAdminUpdateRightsSpy.and.callFake(() => false);
      canPostToChannelSpy.and.callFake(() => false);

      const user = undefined as IDiscussionsUser;
      const channel = {
        allowPost: true,
        channelAcl: [{ category: AclCategory.GROUP, role: Role.READWRITE }],
      } as IChannel;

      expect(canCreatePostV2(channel, user)).toBe(false);
      expect(hasOrgAdminUpdateRightsSpy.calls.count()).toBe(1);
      const [arg1, arg2] = hasOrgAdminUpdateRightsSpy.calls.allArgs()[0]; // args for 1st call
      expect(arg1).toEqual({});
      expect(arg2).toBe(channel.orgId);

      expect(canPostToChannelSpy.calls.count()).toBe(1);
      const [arg] = canPostToChannelSpy.calls.allArgs()[0]; // arg for 1st call
      expect(arg).toEqual({});
    });

    it("return true if channelPermission.canPostToChannel is true", () => {
      hasOrgAdminUpdateRightsSpy.and.callFake(() => false);
      canPostToChannelSpy.and.callFake(() => true);

      const user = {} as IDiscussionsUser;
      const channel = {
        allowPost: true,
        channelAcl: [{ category: AclCategory.ANONYMOUS_USER, role: Role.READ }],
      } as IChannel;

      expect(canCreatePostV2(channel, user)).toBe(true);

      expect(hasOrgAdminUpdateRightsSpy.calls.count()).toBe(1);

      expect(canPostToChannelSpy.calls.count()).toBe(1);
      const [arg] = canPostToChannelSpy.calls.allArgs()[0]; // arg for 1st call
      expect(arg).toBe(user);
    });

    it("return false if channelPermission.canPostToChannel is false", () => {
      hasOrgAdminUpdateRightsSpy.and.callFake(() => false);
      canPostToChannelSpy.and.callFake(() => false);

      const user = {} as IDiscussionsUser;
      const channel = {
        allowPost: true,
        channelAcl: [{ category: AclCategory.ANONYMOUS_USER, role: Role.READ }],
      } as IChannel;

      expect(canCreatePostV2(channel, user)).toBe(false);

      expect(hasOrgAdminUpdateRightsSpy.calls.count()).toBe(1);

      expect(canPostToChannelSpy.calls.count()).toBe(1);
      const [arg] = canPostToChannelSpy.calls.allArgs()[0]; // arg for 1st call
      expect(arg).toBe(user);
    });
  });
});
