import { IGroup } from "@esri/arcgis-rest-types";
import {
  AclCategory,
  IChannel,
  IDiscussionsUser,
  Role,
} from "../../../src/types";
import { ChannelPermission } from "../../../src/utils/channel-permission";
import { canPostToChannel } from "../../../src/utils/channels/can-post-to-channel";

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

describe("canPostToChannel", () => {
  describe("with channelAcl", () => {
    let canPostToChannelSpy: jasmine.Spy;

    beforeAll(() => {
      canPostToChannelSpy = spyOn(
        ChannelPermission.prototype,
        "canPostToChannel"
      );
    });

    beforeEach(() => {
      canPostToChannelSpy.calls.reset();
    });

    it("return true if channelPermission.canPostToChannel is true", () => {
      canPostToChannelSpy.and.callFake(() => true);

      const user = buildUser();
      const channel = {
        channelAcl: [{ category: AclCategory.ANONYMOUS_USER, role: Role.READ }],
      } as IChannel;

      expect(canPostToChannel(channel, user)).toBe(true);

      expect(canPostToChannelSpy.calls.count()).toBe(1);
      const [arg] = canPostToChannelSpy.calls.allArgs()[0]; // arg for 1st call
      expect(arg).toBe(user);
    });

    it("return false if channelPermission.canPostToChannel is false", () => {
      canPostToChannelSpy.and.callFake(() => false);

      const user = buildUser();
      const channel = {
        channelAcl: [{ category: AclCategory.ANONYMOUS_USER, role: Role.READ }],
      } as IChannel;

      expect(canPostToChannel(channel, user)).toBe(false);

      expect(canPostToChannelSpy.calls.count()).toBe(1);
    });
  });

  describe("with legacy permissions", () => {
    it("returns true if undefined user attempts to create post in allowAnonymous === true channel", () => {
      const channel = {
        allowAnonymous: true,
      } as IChannel;

      expect(canPostToChannel(channel)).toBe(true);
    });

    it("returns true if anonymous user attempts to create post in allowAnonymous === true channel", () => {
      const user: IDiscussionsUser = { username: null };
      const channel = {
        allowAnonymous: true,
      } as IChannel;

      expect(canPostToChannel(channel, user)).toBe(true);
    });

    it("returns false if anonymous user attempts to create post in allowAnonymous === false channel", () => {
      const user: IDiscussionsUser = { username: null };
      const channel = {
        allowAnonymous: false,
      } as IChannel;

      expect(canPostToChannel(channel, user)).toBe(false);
    });

    it("returns true if authenticated user attempts to create post in public-access channel", () => {
      const user: IDiscussionsUser = { username: "Slughorn" };
      const channel = {
        access: "public",
        allowAnonymous: false,
      } as IChannel;

      expect(canPostToChannel(channel, user)).toBe(true);
    });

    it("returns true if group authorized user attempts to create post in private-access channel", () => {
      const user: IDiscussionsUser = {
        username: "Slughorn",
        groups: [
          {
            id: "abc",
            userMembership: { memberType: "member" },
            typeKeywords: [],
          },
        ],
      } as any;
      const channel = {
        access: "private",
        allowAnonymous: false,
        groups: ["abc"],
      } as any;

      expect(canPostToChannel(channel, user)).toBe(true);
    });

    it("returns true if a group authorized user attempts to create post in private-access channel, but at least one group is NOT marked cannotDiscuss", () => {
      const user: IDiscussionsUser = {
        username: "Slughorn",
        groups: [
          {
            id: "abc",
            userMembership: { memberType: "member" },
            typeKeywords: ["cannotDiscuss"],
          },
          {
            id: "xyz",
            userMembership: { memberType: "member" },
            typeKeywords: [],
          },
        ],
      } as any;
      const channel = {
        access: "private",
        allowAnonymous: false,
        groups: ["abc", "xyz"],
      } as any;

      expect(canPostToChannel(channel, user)).toBe(true);
    });

    it("returns false if group authorized user attempts to create post in private-access channel, but the only group is marked cannotDiscuss", () => {
      const user: IDiscussionsUser = {
        username: "Slughorn",
        groups: [
          {
            id: "abc",
            userMembership: { memberType: "member" },
            typeKeywords: ["cannotDiscuss"],
          },
        ],
      } as any;
      const channel = {
        access: "private",
        allowAnonymous: false,
        groups: ["abc"],
      } as any;

      expect(canPostToChannel(channel, user)).toBe(false);
    });

    it("returns false if group unauthorized user attempts to create post in private-access channel", () => {
      const user: IDiscussionsUser = {
        username: "Slughorn",
        groups: [
          {
            id: "abc",
            userMembership: { memberType: "member" },
            typeKeywords: [],
          },
        ],
        typeKeywords: [],
      } as any;
      const channel = {
        access: "private",
        allowAnonymous: false,
        groups: ["xyz"],
      } as any;

      expect(canPostToChannel(channel, user)).toBe(false);
    });

    it("handles missing user/channel groups", () => {
      const user: IDiscussionsUser = {
        username: "Slughorn",
      } as any;
      const channel = {
        access: "private",
        allowAnonymous: false,
      } as any;

      expect(canPostToChannel(channel, user)).toBe(false);
    });

    it("returns true if org authorized user attempts to create post in org-access channel", () => {
      const user: IDiscussionsUser = {
        username: "Slughorn",
        orgId: "abc",
      } as any;
      const channel = {
        access: "org",
        allowAnonymous: false,
        orgs: ["abc"],
      } as any;

      expect(canPostToChannel(channel, user)).toBe(true);
    });

    it("returns false if unknown access value", () => {
      const user: IDiscussionsUser = {
        username: "Slughorn",
        orgId: "abc",
      } as any;
      const channel = {
        access: "foo",
        allowAnonymous: false,
        orgs: ["abc"],
      } as any;

      expect(canPostToChannel(channel, user)).toBe(false);
    });
  });
});
