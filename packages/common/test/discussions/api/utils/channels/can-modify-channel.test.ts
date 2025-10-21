import {
  IChannel,
  IDiscussionsUser,
} from "../../../../../src/discussions/api//types";
import { canModifyChannel } from "../../../../../src/discussions/api//utils/channels/can-modify-channel";
import * as isAuthorizedToModifyChannelByLegacyPermissionsModule from "../../../../../src/discussions/api//utils/channels/is-authorized-to-modify-channel-by-legacy-permissions";
import { SharingAccess } from "../../../../../src/discussions/api/enums/sharingAccess";

describe("canModifyChannel", () => {
  let isAuthorizedToModifyChannelByLegacyPermissionsSpy: jasmine.Spy;

  beforeAll(() => {
    isAuthorizedToModifyChannelByLegacyPermissionsSpy = spyOn(
      isAuthorizedToModifyChannelByLegacyPermissionsModule,
      "isAuthorizedToModifyChannelByLegacyPermissions"
    );
  });

  beforeEach(() => {
    isAuthorizedToModifyChannelByLegacyPermissionsSpy.calls.reset();
  });

  describe("With Org Admin", () => {
    it("return true if user is org_admin in the channel org", () => {
      const user = { orgId: "aaa", role: "org_admin" } as IDiscussionsUser;
      const channel = { orgId: "aaa" } as IChannel;

      expect(canModifyChannel(channel, user)).toBe(true);

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

      expect(
        isAuthorizedToModifyChannelByLegacyPermissionsSpy.calls.count()
      ).toBe(1);
      const [arg1, arg2] =
        isAuthorizedToModifyChannelByLegacyPermissionsSpy.calls.allArgs()[0]; // args for 1st call
      expect(arg1).toBe(user);
      expect(arg2).toBe(channel);
    });

    it("returns false if user is undefined", () => {
      isAuthorizedToModifyChannelByLegacyPermissionsSpy.and.callFake(
        () => false
      );
      const user = undefined as IDiscussionsUser;
      const channel = { access: SharingAccess.PUBLIC } as IChannel;

      expect(canModifyChannel(channel, user)).toBe(false);

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
