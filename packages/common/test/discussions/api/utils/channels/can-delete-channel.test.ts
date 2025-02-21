import {
  IChannel,
  IDiscussionsUser,
  SharingAccess,
} from "../../../../../src/discussions/api//types";
import { canDeleteChannel } from "../../../../../src/discussions/api//utils/channels";
import * as isAuthorizedToModifyChannelByLegacyPermissionsModule from "../../../../../src/discussions/api//utils/channels/is-authorized-to-modify-channel-by-legacy-permissions";
import * as portalPrivModule from "../../../../../src/discussions/api//utils/portal-privilege";

describe("canDeleteChannel", () => {
  let hasOrgAdminDeleteRightsSpy: jasmine.Spy;
  let isAuthorizedToModifyChannelByLegacyPermissionsSpy: jasmine.Spy;

  beforeAll(() => {
    hasOrgAdminDeleteRightsSpy = spyOn(
      portalPrivModule,
      "hasOrgAdminDeleteRights"
    );
    isAuthorizedToModifyChannelByLegacyPermissionsSpy = spyOn(
      isAuthorizedToModifyChannelByLegacyPermissionsModule,
      "isAuthorizedToModifyChannelByLegacyPermissions"
    );
  });

  beforeEach(() => {
    hasOrgAdminDeleteRightsSpy.calls.reset();
    isAuthorizedToModifyChannelByLegacyPermissionsSpy.calls.reset();
  });

  describe("With Org Admin", () => {
    it("return true if hasOrgAdminDeleteRights returns true", () => {
      hasOrgAdminDeleteRightsSpy.and.callFake(() => true);
      const user = {} as IDiscussionsUser;
      const channel = { orgId: "aaa" } as IChannel;

      expect(canDeleteChannel(channel, user)).toBe(true);

      expect(hasOrgAdminDeleteRightsSpy.calls.count()).toBe(1);
      const [arg1, arg2] = hasOrgAdminDeleteRightsSpy.calls.allArgs()[0]; // args for 1st call
      expect(arg1).toBe(user);
      expect(arg2).toBe(channel.orgId);
      expect(
        isAuthorizedToModifyChannelByLegacyPermissionsSpy.calls.count()
      ).toBe(0);
    });
  });

  describe("With Legacy Permissions", () => {
    it("returns true if isAuthorizedToModifyChannelByLegacyPermissions returns true", () => {
      hasOrgAdminDeleteRightsSpy.and.callFake(() => false);
      isAuthorizedToModifyChannelByLegacyPermissionsSpy.and.callFake(
        () => true
      );
      const user = {} as IDiscussionsUser;
      const channel = { access: SharingAccess.PUBLIC } as IChannel;

      expect(canDeleteChannel(channel, user)).toBe(true);

      expect(
        isAuthorizedToModifyChannelByLegacyPermissionsSpy.calls.count()
      ).toBe(1);
      const [arg1, arg2] =
        isAuthorizedToModifyChannelByLegacyPermissionsSpy.calls.allArgs()[0]; // args for 1st call
      expect(arg1).toBe(user);
      expect(arg2).toBe(channel);
    });

    it("returns false if isAuthorizedToModifyChannelByLegacyPermissions returns false", () => {
      hasOrgAdminDeleteRightsSpy.and.callFake(() => false);
      isAuthorizedToModifyChannelByLegacyPermissionsSpy.and.callFake(
        () => false
      );
      const user = {} as IDiscussionsUser;
      const channel = { access: SharingAccess.PUBLIC } as IChannel;

      expect(canDeleteChannel(channel, user)).toBe(false);

      expect(
        isAuthorizedToModifyChannelByLegacyPermissionsSpy.calls.count()
      ).toBe(1);
      const [arg1, arg2] =
        isAuthorizedToModifyChannelByLegacyPermissionsSpy.calls.allArgs()[0]; // args for 1st call
      expect(arg1).toBe(user);
      expect(arg2).toBe(channel);
    });

    it("returns false if user is undefined", () => {
      hasOrgAdminDeleteRightsSpy.and.callFake(() => false);
      isAuthorizedToModifyChannelByLegacyPermissionsSpy.and.callFake(
        () => false
      );
      const user = undefined as IDiscussionsUser;
      const channel = { access: SharingAccess.PUBLIC } as IChannel;

      expect(canDeleteChannel(channel, user)).toBe(false);

      expect(
        isAuthorizedToModifyChannelByLegacyPermissionsSpy.calls.count()
      ).toBe(1);
      const [arg1, arg2] =
        isAuthorizedToModifyChannelByLegacyPermissionsSpy.calls.allArgs()[0]; // args for 1st call
      expect(arg1).toEqual({});
      expect(arg2).toBe(channel);
    });
  });
});
