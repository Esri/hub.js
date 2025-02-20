import { IGroup, IUser } from "@esri/arcgis-rest-types";
import {
  AclCategory,
  IChannel,
  IDiscussionsUser,
  IUpdateChannelV2,
  Role,
} from "../../../src/types";
import { canEditChannelV2 } from "../../../src/utils/channels";
import { ChannelPermission } from "../../../src/utils/channel-permission";
import * as portalPrivModule from "../../../src/utils/portal-privilege";

describe("canEditChannelV2", () => {
  let hasOrgAdminUpdateRightsSpy: jasmine.Spy;
  let canModerateChannelSpy: jasmine.Spy;
  let canUpdatePropertiesSpy: jasmine.Spy;

  beforeAll(() => {
    hasOrgAdminUpdateRightsSpy = spyOn(
      portalPrivModule,
      "hasOrgAdminUpdateRights"
    );
    canModerateChannelSpy = spyOn(
      ChannelPermission.prototype,
      "canModerateChannel"
    );
    canUpdatePropertiesSpy = spyOn(
      ChannelPermission.prototype,
      "canUpdateProperties"
    );
  });

  beforeEach(() => {
    hasOrgAdminUpdateRightsSpy.calls.reset();
    canModerateChannelSpy.calls.reset();
    canUpdatePropertiesSpy.calls.reset();
  });

  describe("With Org Admin", () => {
    it("return true if hasOrgAdminUpdateRights returns true", () => {
      hasOrgAdminUpdateRightsSpy.and.callFake(() => true);
      const user = {} as IDiscussionsUser;
      const channel = { orgId: "aaa" } as IChannel;
      const updateData = { allowPost: false } as IUpdateChannelV2;

      expect(canEditChannelV2(channel, user, updateData)).toBe(true);

      expect(hasOrgAdminUpdateRightsSpy.calls.count()).toBe(1);
      const [arg1, arg2] = hasOrgAdminUpdateRightsSpy.calls.allArgs()[0]; // args for 1st call
      expect(arg1).toBe(user);
      expect(arg2).toBe(channel.orgId);

      expect(canModerateChannelSpy.calls.count()).toBe(0);
      expect(canUpdatePropertiesSpy.calls.count()).toBe(0);
    });
  });

  describe("With channelAcl Permissions", () => {
    it("throws error if channel.channelAcl is undefined", async () => {
      hasOrgAdminUpdateRightsSpy.and.callFake(() => false);

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
      hasOrgAdminUpdateRightsSpy.and.callFake(() => false);
      canModerateChannelSpy.and.callFake(() => true);
      canUpdatePropertiesSpy.and.callFake(() => true);

      const user = {} as IDiscussionsUser;
      const channel = {
        channelAcl: [{ category: AclCategory.GROUP, role: Role.MANAGE }],
        creator: "john",
      } as IChannel;
      const updateData = { allowPost: false } as IUpdateChannelV2;

      expect(canEditChannelV2(channel, user, updateData)).toBe(true);

      expect(canModerateChannelSpy.calls.count()).toBe(1);
      const [arg1] = canModerateChannelSpy.calls.allArgs()[0]; // args for 1st call
      expect(arg1).toBe(user);

      expect(canUpdatePropertiesSpy.calls.count()).toBe(1);
      const [updateArg1, updateArg2] =
        canUpdatePropertiesSpy.calls.allArgs()[0]; // args for 1st call
      expect(updateArg1).toEqual(user);
      expect(updateArg2).toEqual(updateData);
    });

    it("return false if channelPermission.canModerateChannel is false", () => {
      hasOrgAdminUpdateRightsSpy.and.callFake(() => false);
      canModerateChannelSpy.and.callFake(() => false);
      canUpdatePropertiesSpy.and.callFake(() => true);

      const user = {} as IDiscussionsUser;
      const channel = {
        channelAcl: [{ category: AclCategory.ANONYMOUS_USER, role: Role.READ }],
        creator: "john",
      } as IChannel;
      const updateData = { allowPost: false } as IUpdateChannelV2;

      expect(canEditChannelV2(channel, user, updateData)).toBe(false);

      expect(canModerateChannelSpy.calls.count()).toBe(1);
      const [arg1] = canModerateChannelSpy.calls.allArgs()[0]; // args for 1st call
      expect(arg1).toBe(user);

      expect(canUpdatePropertiesSpy.calls.count()).toBe(0);
    });

    it("return false if channelPermission.canModerateChannel is true and channelPermission.canUpdateProperties is false", () => {
      hasOrgAdminUpdateRightsSpy.and.callFake(() => false);
      canModerateChannelSpy.and.callFake(() => true);
      canUpdatePropertiesSpy.and.callFake(() => false);

      const user = {} as IDiscussionsUser;
      const channel = {
        channelAcl: [{ category: AclCategory.ANONYMOUS_USER, role: Role.READ }],
        creator: "john",
      } as IChannel;
      const updateData = { allowPost: false } as IUpdateChannelV2;

      expect(canEditChannelV2(channel, user, updateData)).toBe(false);

      expect(canModerateChannelSpy.calls.count()).toBe(1);
      const [arg1] = canModerateChannelSpy.calls.allArgs()[0]; // args for 1st call
      expect(arg1).toEqual(user);

      expect(canUpdatePropertiesSpy.calls.count()).toBe(1);
      const [updateArg1, updateArg2] =
        canUpdatePropertiesSpy.calls.allArgs()[0]; // args for 1st call
      expect(updateArg1).toEqual(user);
      expect(updateArg2).toEqual(updateData);
    });

    it("return false if user is undefined", () => {
      hasOrgAdminUpdateRightsSpy.and.callFake(() => false);
      canModerateChannelSpy.and.callFake(() => false);
      canUpdatePropertiesSpy.and.callFake(() => false);

      const user = undefined as IDiscussionsUser;
      const channel = {
        channelAcl: [{ category: AclCategory.ANONYMOUS_USER, role: Role.READ }],
        creator: "john",
      } as IChannel;
      const updateData = { allowPost: false } as IUpdateChannelV2;

      expect(canEditChannelV2(channel, user, updateData)).toBe(false);

      expect(canModerateChannelSpy.calls.count()).toBe(1);
      const [arg1] = canModerateChannelSpy.calls.allArgs()[0]; // args for 1st call
      expect(arg1).toEqual({});

      expect(canUpdatePropertiesSpy.calls.count()).toBe(0);
    });
  });
});
