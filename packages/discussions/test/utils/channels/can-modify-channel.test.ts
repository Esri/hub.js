import {
  AclCategory,
  IChannel,
  IDiscussionsUser,
  Role,
  SharingAccess,
} from "../../../src/types";
import { canModifyChannel } from "../../../src/utils/channels";
import { ChannelPermission } from "../../../src/utils/channel-permission";
import * as isAuthorizedToModifyChannelByLegacyPermissionsModule from "../../../src/utils/channels/is-authorized-to-modify-channel-by-legacy-permissions";
import { IUser } from "@esri/arcgis-rest-request";

describe("canModifyChannel", () => {
  let canModerateChannelSpy: jasmine.Spy;
  let isAuthorizedToModifyChannelByLegacyPermissionsSpy: jasmine.Spy;

  beforeAll(() => {
    canModerateChannelSpy = spyOn(
      ChannelPermission.prototype,
      "canModerateChannel"
    );
    isAuthorizedToModifyChannelByLegacyPermissionsSpy = spyOn(
      isAuthorizedToModifyChannelByLegacyPermissionsModule,
      "isAuthorizedToModifyChannelByLegacyPermissions"
    );
  });

  beforeEach(() => {
    isAuthorizedToModifyChannelByLegacyPermissionsSpy.calls.reset();
    canModerateChannelSpy.calls.reset();
  });

  describe("With Org Admin", () => {
    it("return true if user is org_admin in the channel org", () => {
      const user = { orgId: "aaa", role: "org_admin" } as IDiscussionsUser;
      const channel = { orgId: "aaa" } as IChannel;

      expect(canModifyChannel(channel, user)).toBe(true);

      expect(canModerateChannelSpy.calls.count()).toBe(0);
      expect(
        isAuthorizedToModifyChannelByLegacyPermissionsSpy.calls.count()
      ).toBe(0);
    });
  });

  describe("With channelAcl Permissions", () => {
    it("return true if channelPermission.canModerateChannel is true", () => {
      canModerateChannelSpy.and.callFake(() => true);

      const user = {} as IDiscussionsUser;
      const channel = {
        channelAcl: [{ category: AclCategory.GROUP, role: Role.MANAGE }],
        creator: "john",
      } as IChannel;

      expect(canModifyChannel(channel, user)).toBe(true);

      expect(canModerateChannelSpy.calls.count()).toBe(1);
      const [arg1] = canModerateChannelSpy.calls.allArgs()[0]; // args for 1st call
      expect(arg1).toBe(user);

      expect(
        isAuthorizedToModifyChannelByLegacyPermissionsSpy.calls.count()
      ).toBe(0);
    });

    it("return false if channelPermission.canModerateChannel is false", () => {
      canModerateChannelSpy.and.callFake(() => false);

      const user = {} as IDiscussionsUser;
      const channel = {
        channelAcl: [{ category: AclCategory.ANONYMOUS_USER, role: Role.READ }],
        creator: "john",
      } as IChannel;

      expect(canModifyChannel(channel, user)).toBe(false);

      expect(canModerateChannelSpy.calls.count()).toBe(1);
      const [arg1] = canModerateChannelSpy.calls.allArgs()[0]; // args for 1st call
      expect(arg1).toBe(user);

      expect(
        isAuthorizedToModifyChannelByLegacyPermissionsSpy.calls.count()
      ).toBe(0);
    });

    it("return false if channelPermission.canModerateChannel is false and user is undefined", () => {
      canModerateChannelSpy.and.callFake(() => false);

      const user = undefined as unknown as IUser;
      const channel = {
        channelAcl: [{ category: AclCategory.ANONYMOUS_USER, role: Role.READ }],
        creator: "john",
      } as IChannel;

      expect(canModifyChannel(channel, user)).toBe(false);

      expect(canModerateChannelSpy.calls.count()).toBe(1);
      const [arg1] = canModerateChannelSpy.calls.allArgs()[0]; // args for 1st call
      expect(arg1).toEqual({});

      expect(
        isAuthorizedToModifyChannelByLegacyPermissionsSpy.calls.count()
      ).toBe(0);
    });

    it("return true if user is org_admin, but not in the channel org, and channelPermission.canModerateChannel is true", () => {
      canModerateChannelSpy.and.callFake(() => true);

      const user = { orgId: "aaa", role: "org_admin" } as IDiscussionsUser;
      const channel = {
        channelAcl: [{ category: AclCategory.GROUP, role: Role.MANAGE }],
        creator: "john",
        orgId: "zzz", // user not in this org
      } as IChannel;

      expect(canModifyChannel(channel, user)).toBe(true);

      expect(canModerateChannelSpy.calls.count()).toBe(1);
      const [arg1] = canModerateChannelSpy.calls.allArgs()[0]; // args for 1st call
      expect(arg1).toBe(user);

      expect(
        isAuthorizedToModifyChannelByLegacyPermissionsSpy.calls.count()
      ).toBe(0);
    });
  });

  describe("With Legacy Permissions", () => {
    it("returns true if isAuthorizedToModifyChannelByLegacyPermissions returns true", () => {
      isAuthorizedToModifyChannelByLegacyPermissionsSpy.and.callFake(
        () => true
      );
      const user = {} as IDiscussionsUser;
      const channel = { access: SharingAccess.PUBLIC } as IChannel;

      expect(canModifyChannel(channel, user)).toBe(true);

      expect(canModerateChannelSpy.calls.count()).toBe(0);

      expect(
        isAuthorizedToModifyChannelByLegacyPermissionsSpy.calls.count()
      ).toBe(1);
      const [arg1, arg2] =
        isAuthorizedToModifyChannelByLegacyPermissionsSpy.calls.allArgs()[0]; // args for 1st call
      expect(arg1).toBe(user);
      expect(arg2).toBe(channel);
    });

    it("returns false if isAuthorizedToModifyChannelByLegacyPermissions returns false", () => {
      isAuthorizedToModifyChannelByLegacyPermissionsSpy.and.callFake(
        () => false
      );
      const user = {} as IDiscussionsUser;
      const channel = { access: SharingAccess.PUBLIC } as IChannel;

      expect(canModifyChannel(channel, user)).toBe(false);

      expect(canModerateChannelSpy.calls.count()).toBe(0);

      expect(
        isAuthorizedToModifyChannelByLegacyPermissionsSpy.calls.count()
      ).toBe(1);
      const [arg1, arg2] =
        isAuthorizedToModifyChannelByLegacyPermissionsSpy.calls.allArgs()[0]; // args for 1st call
      expect(arg1).toBe(user);
      expect(arg2).toBe(channel);
    });
  });
});
