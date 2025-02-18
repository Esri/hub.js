import {
  AclCategory,
  IChannelV2,
  IDiscussionsUser,
  Role,
} from "../../../src/types";
import { ChannelPermission } from "../../../src/utils/channel-permission";
import { canReadChannelV2 } from "../../../src/utils/channels";
import * as portalPrivModule from "../../../src/utils/portal-privilege";

describe("canReadChannelV2", () => {
  let canReadChannelSpy: jasmine.Spy;
  let hasOrgAdminViewRightsSpy: jasmine.Spy;

  beforeAll(() => {
    hasOrgAdminViewRightsSpy = spyOn(portalPrivModule, "hasOrgAdminViewRights");
    canReadChannelSpy = spyOn(ChannelPermission.prototype, "canReadChannel");
  });

  beforeEach(() => {
    hasOrgAdminViewRightsSpy.calls.reset();
    canReadChannelSpy.calls.reset();
  });

  describe("With Org Admin", () => {
    it("return true if hasOrgAdminUpdateRights returns true", () => {
      hasOrgAdminViewRightsSpy.and.callFake(() => true);
      const user = {} as IDiscussionsUser;
      const channel = { orgId: "aaa" } as IChannelV2;

      expect(canReadChannelV2(channel, user)).toBe(true);

      expect(hasOrgAdminViewRightsSpy.calls.count()).toBe(1);
      const [arg1, arg2] = hasOrgAdminViewRightsSpy.calls.allArgs()[0]; // args for 1st call
      expect(arg1).toBe(user);
      expect(arg2).toBe(channel.orgId);

      expect(canReadChannelSpy.calls.count()).toBe(0);
    });
  });

  describe("with channelAcl", () => {
    it("throws error if channel.channelAcl is undefined", async () => {
      hasOrgAdminViewRightsSpy.and.callFake(() => false);

      const user = {} as IDiscussionsUser;
      const channel = {
        channelAcl: undefined,
      } as IChannelV2;

      expect(() => canReadChannelV2(channel, user)).toThrow(
        new Error("channel.channelAcl is required for ChannelPermission checks")
      );
    });

    it("return true if channelPermission.canReadChannel is true", () => {
      hasOrgAdminViewRightsSpy.and.callFake(() => false);
      canReadChannelSpy.and.callFake(() => true);

      const user = {} as IDiscussionsUser;
      const channel = {
        channelAcl: [{ category: AclCategory.ANONYMOUS_USER, role: Role.READ }],
      } as IChannelV2;

      expect(canReadChannelV2(channel, user)).toBe(true);

      expect(canReadChannelSpy.calls.count()).toBe(1);
      const [arg] = canReadChannelSpy.calls.allArgs()[0]; // arg for 1st call
      expect(arg).toBe(user);
    });

    it("return false if channelPermission.canReadChannel is false", () => {
      hasOrgAdminViewRightsSpy.and.callFake(() => false);
      canReadChannelSpy.and.callFake(() => false);

      const user = {} as IDiscussionsUser;
      const channel = {
        channelAcl: [
          { category: AclCategory.ANONYMOUS_USER, role: Role.WRITE },
        ],
      } as IChannelV2;

      expect(canReadChannelV2(channel, user)).toBe(false);

      expect(canReadChannelSpy.calls.count()).toBe(1);
      const [arg] = canReadChannelSpy.calls.allArgs()[0]; // arg for 1st call
      expect(arg).toBe(user);
    });

    it("return false if user is undefined", () => {
      hasOrgAdminViewRightsSpy.and.callFake(() => false);
      canReadChannelSpy.and.callFake(() => false);

      const user = undefined as IDiscussionsUser;
      const channel = {
        channelAcl: [
          { category: AclCategory.ANONYMOUS_USER, role: Role.WRITE },
        ],
      } as IChannelV2;

      expect(canReadChannelV2(channel, user)).toBe(false);

      expect(canReadChannelSpy.calls.count()).toBe(1);
      const [arg] = canReadChannelSpy.calls.allArgs()[0]; // arg for 1st call
      expect(arg).toEqual({});
    });
  });
});
