import { IGroup } from "@esri/arcgis-rest-types";
import {
  AclCategory,
  IChannel,
  IDiscussionsUser,
  Role,
} from "../../../src/types";
import { canEditPostStatusV2 } from "../../../src/utils/posts";
import { ChannelPermission } from "../../../src/utils/channel-permission";
import * as portalPrivModule from "../../../src/utils/portal-privilege";

describe("canEditPostStatusV2", () => {
  describe("With channelAcl Permissions", () => {
    let hasOrgAdminUpdateRightsSpy: jasmine.Spy;
    let canModerateChannelSpy: jasmine.Spy;

    beforeAll(() => {
      hasOrgAdminUpdateRightsSpy = spyOn(
        portalPrivModule,
        "hasOrgAdminUpdateRights"
      );
      canModerateChannelSpy = spyOn(
        ChannelPermission.prototype,
        "canModerateChannel"
      );
    });

    beforeEach(() => {
      hasOrgAdminUpdateRightsSpy.calls.reset();
      canModerateChannelSpy.calls.reset();
    });

    it("return true if user is org_admin", () => {
      hasOrgAdminUpdateRightsSpy.and.callFake(() => true);
      canModerateChannelSpy.and.callFake(() => false);

      const user = {} as IDiscussionsUser;
      const channel = {
        channelAcl: [{ category: AclCategory.ANONYMOUS_USER, role: Role.READ }],
        creator: "john",
      } as IChannel;

      expect(canEditPostStatusV2(channel, user)).toBe(true);

      expect(hasOrgAdminUpdateRightsSpy.calls.count()).toBe(1);
      const [arg1, arg2] = hasOrgAdminUpdateRightsSpy.calls.allArgs()[0]; // args for 1st call
      expect(arg1).toBe(user);
      expect(arg2).toBe(channel.orgId);

      expect(canModerateChannelSpy.calls.count()).toBe(0);
    });

    it("return false if user is undefined", () => {
      hasOrgAdminUpdateRightsSpy.and.callFake(() => false);
      canModerateChannelSpy.and.callFake(() => false);

      const user = undefined as IDiscussionsUser;
      const channel = {
        channelAcl: [{ category: AclCategory.ANONYMOUS_USER, role: Role.READ }],
        creator: "john",
        orgId: "aaa",
      } as IChannel;

      expect(canEditPostStatusV2(channel, user)).toBe(false);

      expect(hasOrgAdminUpdateRightsSpy.calls.count()).toBe(1);
      const [arg1, arg2] = hasOrgAdminUpdateRightsSpy.calls.allArgs()[0]; // args for 1st call
      expect(arg1).toEqual({});
      expect(arg2).toBe(channel.orgId);

      expect(canModerateChannelSpy.calls.count()).toBe(1);
      const [canModerateArg1] = canModerateChannelSpy.calls.allArgs()[0]; // args for 1st call
      expect(canModerateArg1).toEqual({});
    });

    it("return true if channelPermission.canEditPostStatus is true", () => {
      hasOrgAdminUpdateRightsSpy.and.callFake(() => false);
      canModerateChannelSpy.and.callFake(() => true);

      const user = {} as IDiscussionsUser;
      const channel = {
        channelAcl: [{ category: AclCategory.ANONYMOUS_USER, role: Role.READ }],
        creator: "john",
      } as IChannel;

      expect(canEditPostStatusV2(channel, user)).toBe(true);

      expect(hasOrgAdminUpdateRightsSpy.calls.count()).toBe(1);
      const [arg1, arg2] = hasOrgAdminUpdateRightsSpy.calls.allArgs()[0]; // args for 1st call
      expect(arg1).toBe(user);
      expect(arg2).toBe(channel.orgId);

      expect(canModerateChannelSpy.calls.count()).toBe(1);
      const [canModerateArg1] = canModerateChannelSpy.calls.allArgs()[0]; // args for 1st call
      expect(canModerateArg1).toBe(user);
    });

    it("return false if channelPermission.canEditPostStatus is false", () => {
      hasOrgAdminUpdateRightsSpy.and.callFake(() => false);
      canModerateChannelSpy.and.callFake(() => false);

      const user = {} as IDiscussionsUser;
      const channel = {
        channelAcl: [{ category: AclCategory.ANONYMOUS_USER, role: Role.READ }],
        creator: "john",
      } as IChannel;

      expect(canEditPostStatusV2(channel, user)).toBe(false);

      expect(hasOrgAdminUpdateRightsSpy.calls.count()).toBe(1);
      const [arg1, arg2] = hasOrgAdminUpdateRightsSpy.calls.allArgs()[0]; // args for 1st call
      expect(arg1).toBe(user);
      expect(arg2).toBe(channel.orgId);

      expect(canModerateChannelSpy.calls.count()).toBe(1);
      const [canModerateArg1] = canModerateChannelSpy.calls.allArgs()[0]; // args for 1st call
      expect(canModerateArg1).toBe(user);
    });
  });
});
