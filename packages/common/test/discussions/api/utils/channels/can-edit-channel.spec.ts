import { vi, beforeEach, afterEach, describe, it, expect } from "vitest";
import {
  IChannel,
  IDiscussionsUser,
  SharingAccess,
} from "../../../../../src/discussions/api/types";
import { canEditChannel } from "../../../../../src/discussions/api/utils/channels/can-edit-channel";
import * as isAuthorizedToModifyChannelByLegacyPermissionsModule from "../../../../../src/discussions/api/utils/channels/is-authorized-to-modify-channel-by-legacy-permissions";
import * as portalPrivModule from "../../../../../src/discussions/api/utils/portal-privilege";

describe("canEditChannel", () => {
  let hasOrgAdminUpdateRightsSpy: any;
  let isAuthorizedToModifyChannelByLegacyPermissionsSpy: any;

  beforeEach(() => {
    hasOrgAdminUpdateRightsSpy = vi.spyOn(
      portalPrivModule,
      "hasOrgAdminUpdateRights"
    );
    isAuthorizedToModifyChannelByLegacyPermissionsSpy = vi.spyOn(
      isAuthorizedToModifyChannelByLegacyPermissionsModule,
      "isAuthorizedToModifyChannelByLegacyPermissions"
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("With Org Admin", () => {
    it("return true if hasOrgAdminUpdateRights returns true", () => {
      hasOrgAdminUpdateRightsSpy.mockImplementation(() => true);
      isAuthorizedToModifyChannelByLegacyPermissionsSpy.mockImplementation(
        () => false
      );
      const user = {} as IDiscussionsUser;
      const channel = { orgId: "aaa" } as IChannel;

      expect(canEditChannel(channel, user)).toBe(true);

      expect(hasOrgAdminUpdateRightsSpy).toHaveBeenCalledTimes(1);
      const [arg1, arg2] = hasOrgAdminUpdateRightsSpy.mock.calls[0]; // args for 1st call
      expect(arg1).toBe(user);
      expect(arg2).toBe(channel.orgId);

      expect(
        isAuthorizedToModifyChannelByLegacyPermissionsSpy
      ).toHaveBeenCalledTimes(0);
    });
  });

  describe("With Legacy Permissions", () => {
    it("returns true if isAuthorizedToModifyChannelByLegacyPermissions returns true", () => {
      hasOrgAdminUpdateRightsSpy.mockImplementation(() => false);
      isAuthorizedToModifyChannelByLegacyPermissionsSpy.mockImplementation(
        () => true
      );
      const user = {} as IDiscussionsUser;
      const channel = { access: SharingAccess.PUBLIC } as IChannel;

      expect(canEditChannel(channel, user)).toBe(true);

      expect(
        isAuthorizedToModifyChannelByLegacyPermissionsSpy
      ).toHaveBeenCalledTimes(1);
      const [arg1, arg2] =
        isAuthorizedToModifyChannelByLegacyPermissionsSpy.mock.calls[0]; // args for 1st call
      expect(arg1).toBe(user);
      expect(arg2).toBe(channel);
    });

    it("returns false if isAuthorizedToModifyChannelByLegacyPermissions returns false", () => {
      hasOrgAdminUpdateRightsSpy.mockImplementation(() => false);
      isAuthorizedToModifyChannelByLegacyPermissionsSpy.mockImplementation(
        () => false
      );
      const user = {} as IDiscussionsUser;
      const channel = { access: SharingAccess.PUBLIC } as IChannel;

      expect(canEditChannel(channel, user)).toBe(false);

      expect(
        isAuthorizedToModifyChannelByLegacyPermissionsSpy
      ).toHaveBeenCalledTimes(1);
      const [arg1, arg2] =
        isAuthorizedToModifyChannelByLegacyPermissionsSpy.mock.calls[0]; // args for 1st call
      expect(arg1).toBe(user);
      expect(arg2).toBe(channel);
    });

    it("returns false if user is undefined", () => {
      hasOrgAdminUpdateRightsSpy.mockImplementation(() => false);
      isAuthorizedToModifyChannelByLegacyPermissionsSpy.mockImplementation(
        () => false
      );
      const user = undefined as IDiscussionsUser;
      const channel = { access: SharingAccess.PUBLIC } as IChannel;

      expect(canEditChannel(channel, user)).toBe(false);

      expect(
        isAuthorizedToModifyChannelByLegacyPermissionsSpy
      ).toHaveBeenCalledTimes(1);
      const [arg1, arg2] =
        isAuthorizedToModifyChannelByLegacyPermissionsSpy.mock.calls[0]; // args for 1st call
      expect(arg1).toEqual({});
      expect(arg2).toBe(channel);
    });
  });
});
