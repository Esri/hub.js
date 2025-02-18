import { IGroup } from "@esri/arcgis-rest-types";
import {
  AclCategory,
  IChannelV2,
  IDiscussionsUser,
  Role,
} from "../../../src/types";
import { ChannelPermission } from "../../../src/utils/channel-permission";
import { canCreateChannelV2 } from "../../../src/utils/channels";

const orgId1 = "3ef";
const groupId1 = "aaa";
const groupId2 = "bbb";

function buildUser(overrides = {}) {
  const defaultUser = {
    username: "john",
    orgId: orgId1,
    role: "org_user",
    groups: [buildGroup(groupId1, "member"), buildGroup(groupId2, "admin")],
  };

  return { ...defaultUser, ...overrides } as IDiscussionsUser;
}

function buildGroup(id: string, memberType: string, typeKeywords?: string[]) {
  return {
    id,
    userMembership: { memberType },
    typeKeywords,
  } as any as IGroup;
}

describe("canCreateChannelV2", () => {
  describe("with channelAcl", () => {
    let canCreateChannelSpy: jasmine.Spy;

    beforeAll(() => {
      canCreateChannelSpy = spyOn(
        ChannelPermission.prototype,
        "canCreateChannel"
      );
    });

    beforeEach(() => {
      canCreateChannelSpy.calls.reset();
    });

    it("throws error if channel.channelAcl is undefined", async () => {
      const user = buildUser();
      const channel = {
        channelAcl: undefined,
      } as IChannelV2;

      expect(() => canCreateChannelV2(channel, user)).toThrow(
        new Error("channel.channelAcl is required for ChannelPermission checks")
      );
    });

    it("return true if channelPermission.canCreateChannel is true", () => {
      canCreateChannelSpy.and.callFake(() => true);

      const user = buildUser();
      const channel = {
        channelAcl: [{ category: AclCategory.ANONYMOUS_USER, role: Role.READ }],
      } as IChannelV2;

      expect(canCreateChannelV2(channel, user)).toBe(true);

      expect(canCreateChannelSpy.calls.count()).toBe(1);
      const [arg] = canCreateChannelSpy.calls.allArgs()[0]; // arg for 1st call
      expect(arg).toBe(user);
    });

    it("return false if channelPermission.canCreateChannel is false", () => {
      canCreateChannelSpy.and.callFake(() => false);

      const user = buildUser();
      const channel = {
        channelAcl: [{ category: AclCategory.ANONYMOUS_USER, role: Role.READ }],
      } as IChannelV2;

      expect(canCreateChannelV2(channel, user)).toBe(false);

      expect(canCreateChannelSpy.calls.count()).toBe(1);
      const [arg] = canCreateChannelSpy.calls.allArgs()[0]; // arg for 1st call
      expect(arg).toBe(user);
    });
  });
});
