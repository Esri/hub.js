import { IGroup } from "@esri/arcgis-rest-types";
import {
  AclCategory,
  IChannel,
  IDiscussionsUser,
  Role,
  SharingAccess,
} from "../../../src/types";
import { canEditChannel } from "../../../src/utils/channels";
import { ChannelPermission } from "../../../src/utils/channel-permission";
import * as isAuthorizedToModifyChannelByLegacyPermissionsModule from "../../../src/utils/channels/is-authorized-to-modify-channel-by-legacy-permissions";
import * as portalPrivModule from "../../../src/utils/portal-privilege";

describe("canEditChannel", () => {
  let hasOrgAdminUpdateRightsSpy: jasmine.Spy;
  let canModerateChannelSpy: jasmine.Spy;
  let isAuthorizedToModifyChannelByLegacyPermissionsSpy: jasmine.Spy;

  beforeAll(() => {
    hasOrgAdminUpdateRightsSpy = spyOn(
      portalPrivModule,
      "hasOrgAdminUpdateRights"
    );
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
    hasOrgAdminUpdateRightsSpy.calls.reset();
    isAuthorizedToModifyChannelByLegacyPermissionsSpy.calls.reset();
    canModerateChannelSpy.calls.reset();
  });

  describe("With Org Admin", () => {
    it("return true if hasOrgAdminUpdateRights returns true", () => {
      hasOrgAdminUpdateRightsSpy.and.callFake(() => true);
      const user = {} as IDiscussionsUser;
      const channel = { orgId: "aaa" } as IChannel;

      expect(canEditChannel(channel, user)).toBe(true);

      expect(hasOrgAdminUpdateRightsSpy.calls.count()).toBe(1);
      const [arg1, arg2] = hasOrgAdminUpdateRightsSpy.calls.allArgs()[0]; // args for 1st call
      expect(arg1).toBe(user);
      expect(arg2).toBe(channel.orgId);

      expect(canModerateChannelSpy.calls.count()).toBe(0);
      expect(
        isAuthorizedToModifyChannelByLegacyPermissionsSpy.calls.count()
      ).toBe(0);
    });
  });

  describe("With channelAcl Permissions", () => {
    it("return true if channelPermission.canModerateChannel is true", () => {
      hasOrgAdminUpdateRightsSpy.and.callFake(() => false);
      canModerateChannelSpy.and.callFake(() => true);

      const user = {} as IDiscussionsUser;
      const channel = {
        channelAcl: [{ category: AclCategory.GROUP, role: Role.MANAGE }],
        creator: "john",
      } as IChannel;

      expect(canEditChannel(channel, user)).toBe(true);

      expect(canModerateChannelSpy.calls.count()).toBe(1);
      const [arg1] = canModerateChannelSpy.calls.allArgs()[0]; // args for 1st call
      expect(arg1).toBe(user);

      expect(
        isAuthorizedToModifyChannelByLegacyPermissionsSpy.calls.count()
      ).toBe(0);
    });

    it("return false if channelPermission.canModerateChannel is false", () => {
      hasOrgAdminUpdateRightsSpy.and.callFake(() => false);
      canModerateChannelSpy.and.callFake(() => false);

      const user = {} as IDiscussionsUser;
      const channel = {
        channelAcl: [{ category: AclCategory.ANONYMOUS_USER, role: Role.READ }],
        creator: "john",
      } as IChannel;

      expect(canEditChannel(channel, user)).toBe(false);

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
      hasOrgAdminUpdateRightsSpy.and.callFake(() => false);
      isAuthorizedToModifyChannelByLegacyPermissionsSpy.and.callFake(
        () => true
      );
      const user = {} as IDiscussionsUser;
      const channel = { access: SharingAccess.PUBLIC } as IChannel;

      expect(canEditChannel(channel, user)).toBe(true);

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
      hasOrgAdminUpdateRightsSpy.and.callFake(() => false);
      isAuthorizedToModifyChannelByLegacyPermissionsSpy.and.callFake(
        () => false
      );
      const user = {} as IDiscussionsUser;
      const channel = { access: SharingAccess.PUBLIC } as IChannel;

      expect(canEditChannel(channel, user)).toBe(false);

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
