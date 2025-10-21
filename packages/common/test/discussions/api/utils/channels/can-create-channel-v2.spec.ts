import { vi, beforeEach, afterEach, describe, it, expect } from "vitest";
import type { IGroup } from "@esri/arcgis-rest-portal";
import {
  AclCategory,
  IChannel,
  IDiscussionsUser,
  Role,
} from "../../../../../src/discussions/api/types";
import { ChannelPermission } from "../../../../../src/discussions/api/utils/channel-permission";
import { canCreateChannelV2 } from "../../../../../src/discussions/api/utils/channels/can-create-channel-v2";

const orgId1 = "3ef";
const groupId1 = "aaa";
const groupId2 = "bbb";

function buildUser(overrides = {}): IDiscussionsUser {
  const defaultUser = {
    username: "john",
    orgId: orgId1,
    role: "org_user",
    groups: [buildGroup(groupId1, "member"), buildGroup(groupId2, "admin")],
  };

  return { ...defaultUser, ...overrides } as IDiscussionsUser;
}

function buildGroup(
  id: string,
  memberType: string,
  typeKeywords?: string[]
): IGroup {
  return {
    id,
    userMembership: { memberType },
    typeKeywords,
  } as any as IGroup;
}

describe("canCreateChannelV2", () => {
  describe("with channelAcl", () => {
    let canCreateChannelSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
      canCreateChannelSpy = vi.spyOn(
        ChannelPermission.prototype,
        "canCreateChannel"
      );
    });

    afterEach(() => {
      // restore any mocks to avoid cross-test leakage
      vi.restoreAllMocks();
    });

    it("throws error if channel.channelAcl is undefined", async () => {
      const user = buildUser();
      const channel = {
        channelAcl: undefined,
      } as IChannel;

      expect(() => canCreateChannelV2(channel, user)).toThrow(
        new Error("channel.channelAcl is required for ChannelPermission checks")
      );
    });

    it("return true if channelPermission.canCreateChannel is true", () => {
      canCreateChannelSpy.mockImplementation(() => true);

      const user = buildUser();
      const channel = {
        channelAcl: [{ category: AclCategory.ANONYMOUS_USER, role: Role.READ }],
      } as IChannel;

      expect(canCreateChannelV2(channel, user)).toBe(true);

      expect(canCreateChannelSpy).toHaveBeenCalledTimes(1);
      const [arg] = canCreateChannelSpy.mock.calls[0]; // arg for 1st call
      expect(arg).toBe(user);
    });

    it("return false if channelPermission.canCreateChannel is false", () => {
      canCreateChannelSpy.mockImplementation(() => false);

      const user = buildUser();
      const channel = {
        channelAcl: [{ category: AclCategory.ANONYMOUS_USER, role: Role.READ }],
      } as IChannel;

      expect(canCreateChannelV2(channel, user)).toBe(false);

      expect(canCreateChannelSpy).toHaveBeenCalledTimes(1);
      const [arg] = canCreateChannelSpy.mock.calls[0]; // arg for 1st call
      expect(arg).toBe(user);
    });

    it("return false if user is undefined", () => {
      canCreateChannelSpy.mockImplementation(() => false);

      const user = undefined as IDiscussionsUser;
      const channel = {
        channelAcl: [{ category: AclCategory.ANONYMOUS_USER, role: Role.READ }],
      } as IChannel;

      expect(canCreateChannelV2(channel, user)).toBe(false);

      expect(canCreateChannelSpy).toHaveBeenCalledTimes(1);
      const [arg] = canCreateChannelSpy.mock.calls[0]; // arg for 1st call
      expect(arg).toEqual({});
    });
  });
});
