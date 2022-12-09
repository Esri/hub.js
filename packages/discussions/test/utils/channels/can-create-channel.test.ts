import { IGroup } from "@esri/arcgis-rest-types";
import {
  AclCategory,
  AclSubCategory,
  IChannel,
  IDiscussionsUser,
  Role,
  SharingAccess,
} from "../../../src/types";
import { canCreateChannel } from "../../../src/utils/channels";

const orgId1 = "3ef";
const groupId1 = "aaa";
const groupId2 = "bbb";
const groupId3 = "ccc";

function buildUser(overrides = {}) {
  const defaultUser = {
    username: "john",
    orgId: orgId1,
    role: "org_user",
    groups: [buildGroup(groupId1, "member"), buildGroup(groupId2, "admin")],
  };

  return { ...defaultUser, ...overrides } as IDiscussionsUser;
}

function buildGroup(id: string, memberType: string) {
  return {
    id,
    userMembership: { memberType },
  } as any as IGroup;
}

function buildCompleteAcl() {
  return [
    { category: AclCategory.ANONYMOUS_USER, role: Role.READ },
    { category: AclCategory.AUTHENTICATED_USER, role: Role.READ },
    {
      category: AclCategory.GROUP,
      subCategory: AclSubCategory.ADMIN,
      key: groupId1,
      role: Role.OWNER,
    },
    {
      category: AclCategory.GROUP,
      subCategory: AclSubCategory.MEMBER,
      key: groupId2,
      role: Role.READ,
    },
    {
      category: AclCategory.ORG,
      subCategory: AclSubCategory.ADMIN,
      key: orgId1,
      role: Role.OWNER,
    },
    {
      category: AclCategory.ORG,
      subCategory: AclSubCategory.MEMBER,
      key: orgId1,
      role: Role.READ,
    },
    // this permission currently disabled on channel create
    // { category: AclCategory.USER, key: 'bob', role: Role.READ },
  ];
}

function buildLegacyChannel(overrides = {}) {
  const legacyChannel = {};

  return { ...legacyChannel, ...overrides } as IChannel;
}

describe("canCreateChannel", () => {
  describe("With ChannelAcl Permissions", () => {
    it("returns false if user not authenticated", () => {
      const channel = {
        channelAcl: [{ category: AclCategory.ANONYMOUS_USER, role: Role.READ }],
      } as IChannel;
      const user = buildUser({ username: null });

      expect(canCreateChannel(channel, user)).toEqual(false);
    });

    it("returns false if permissions list is empty", () => {
      const channel = { channelAcl: [] } as unknown as IChannel;
      const user = buildUser();

      expect(canCreateChannel(channel, user)).toEqual(false);
    });

    it("returns true with a full valid channelAcl if user is the org_admin, in all groups, and org permissions only relate to users org", () => {
      const channel = { channelAcl: buildCompleteAcl() } as IChannel;
      const user = buildUser({ role: "org_admin" });

      expect(canCreateChannel(channel, user)).toEqual(true);
    });

    describe("Anonymous User Permissions", () => {
      it("returns true if user is org_admin", () => {
        const channel = {
          channelAcl: [
            { category: AclCategory.ANONYMOUS_USER, role: Role.READ },
          ],
        } as IChannel;
        const user = buildUser({ role: "org_admin" });

        expect(canCreateChannel(channel, user)).toEqual(true);
      });

      it("returns false if user is not org_admin", () => {
        const channel = {
          channelAcl: [
            { category: AclCategory.ANONYMOUS_USER, role: Role.READ },
          ],
        } as IChannel;
        const user = buildUser();

        expect(canCreateChannel(channel, user)).toEqual(false);
      });
    });

    describe("Authenticated User Permissions", () => {
      it("returns true if user is org_admin", () => {
        const channel = {
          channelAcl: [
            { category: AclCategory.AUTHENTICATED_USER, role: Role.READ },
          ],
        } as IChannel;
        const user = buildUser({ role: "org_admin" });

        expect(canCreateChannel(channel, user)).toEqual(true);
      });

      it("returns false if user is not org_admin", () => {
        const channel = {
          channelAcl: [
            { category: AclCategory.AUTHENTICATED_USER, role: Role.READ },
          ],
        } as IChannel;
        const user = buildUser();

        expect(canCreateChannel(channel, user)).toEqual(false);
      });
    });

    describe("Group Permissions", () => {
      it("returns true if user is a member of all groups and memberType is member or admin", async () => {
        const channel = {
          channelAcl: [
            {
              category: AclCategory.GROUP,
              subCategory: AclSubCategory.ADMIN,
              key: groupId1,
              role: Role.OWNER,
            },
            {
              category: AclCategory.GROUP,
              subCategory: AclSubCategory.MEMBER,
              key: groupId2,
              role: Role.READ,
            },
          ],
        } as IChannel;
        const user = buildUser();

        expect(canCreateChannel(channel, user)).toEqual(true);
      });

      it("returns true is user is a member of all groups and memberType is owner", async () => {
        const channel = {
          channelAcl: [
            {
              category: AclCategory.GROUP,
              subCategory: AclSubCategory.ADMIN,
              key: groupId1,
              role: Role.OWNER,
            },
            {
              category: AclCategory.GROUP,
              subCategory: AclSubCategory.MEMBER,
              key: groupId2,
              role: Role.READ,
            },
          ],
        } as IChannel;
        const user = buildUser({
          groups: [
            buildGroup(groupId1, "admin"),
            buildGroup(groupId2, "owner"),
          ],
        });

        expect(canCreateChannel(channel, user)).toEqual(true);
      });

      it("returns false is user is a member of all groups and memberType is none", async () => {
        const channel = {
          channelAcl: [
            {
              category: AclCategory.GROUP,
              subCategory: AclSubCategory.ADMIN,
              key: groupId1,
              role: Role.OWNER,
            },
            {
              category: AclCategory.GROUP,
              subCategory: AclSubCategory.MEMBER,
              key: groupId2,
              role: Role.READ,
            },
          ],
        } as IChannel;
        const user = buildUser({
          groups: [buildGroup(groupId1, "admin"), buildGroup(groupId2, "none")],
        });

        expect(canCreateChannel(channel, user)).toEqual(false);
      });

      it("returns false if user is not a member of every group", async () => {
        const channel = {
          channelAcl: [
            {
              category: AclCategory.GROUP,
              subCategory: AclSubCategory.ADMIN,
              key: groupId1,
              role: Role.READWRITE,
            },
            {
              category: AclCategory.GROUP,
              subCategory: AclSubCategory.ADMIN,
              key: groupId2,
              role: Role.READWRITE,
            },
            {
              category: AclCategory.GROUP,
              subCategory: AclSubCategory.ADMIN,
              key: groupId3,
              role: Role.READWRITE,
            }, // user not member here
          ],
        } as IChannel;
        const user = buildUser();

        expect(canCreateChannel(channel, user)).toEqual(false);
      });
    });

    describe("Org Permissions", () => {
      it("returns true if user is org_admin and every permission is for the users orgId", () => {
        const channel = {
          channelAcl: [
            {
              category: AclCategory.ORG,
              subCategory: AclSubCategory.ADMIN,
              key: orgId1,
              role: Role.OWNER,
            },
            {
              category: AclCategory.ORG,
              subCategory: AclSubCategory.MEMBER,
              key: orgId1,
              role: Role.READ,
            },
          ],
        } as IChannel;
        const user = buildUser({ role: "org_admin" });

        expect(canCreateChannel(channel, user)).toEqual(true);
      });

      it("returns false if user is org_admin and every permission is not for the users orgId", () => {
        const channel = {
          channelAcl: [
            {
              category: AclCategory.ORG,
              subCategory: AclSubCategory.ADMIN,
              key: orgId1,
              role: Role.OWNER,
            },
            {
              category: AclCategory.ORG,
              subCategory: AclSubCategory.MEMBER,
              key: "unknown",
              role: Role.READ,
            },
          ],
        } as IChannel;
        const user = buildUser({ role: "org_admin" });

        expect(canCreateChannel(channel, user)).toEqual(false);
      });

      it("returns false if user is not org_admin", () => {
        const channel = {
          channelAcl: [
            {
              category: AclCategory.ORG,
              subCategory: AclSubCategory.ADMIN,
              key: orgId1,
              role: Role.OWNER,
            },
            {
              category: AclCategory.ORG,
              subCategory: AclSubCategory.MEMBER,
              key: orgId1,
              role: Role.READ,
            },
          ],
        } as IChannel;
        const user = buildUser();

        expect(canCreateChannel(channel, user)).toEqual(false);
      });
    });

    describe("User Permissions", () => {
      it("returns false if user permissions are included", () => {
        const channel = {
          channelAcl: [
            {
              category: AclCategory.USER,
              key: "johnUsername",
              role: Role.READ,
            },
          ],
        } as IChannel;
        const user = buildUser({ role: "org_admin" });

        expect(canCreateChannel(channel, user)).toEqual(false);
      });
    });
  });

  describe("With Legacy Permissions", () => {
    it("returns false if user not authenticated", () => {
      const channel = {
        access: SharingAccess.PRIVATE,
        orgs: [orgId1],
        groups: [groupId1, groupId2],
      } as IChannel;
      const user = buildUser({ username: null });

      expect(canCreateChannel(channel, user)).toEqual(false);
    });

    describe("Private access channel", () => {
      it("returns true if user is member of all channel groups", () => {
        const channel = {
          access: SharingAccess.PRIVATE,
          orgs: [orgId1],
          groups: [groupId1, groupId2],
        } as IChannel;
        const user = buildUser();

        expect(canCreateChannel(channel, user)).toEqual(true);
      });

      it("returns false if user is not member of all channel groups", () => {
        const channel = {
          access: SharingAccess.PRIVATE,
          orgs: [orgId1],
          groups: [groupId1, groupId2, groupId3], // groupId3
        } as IChannel;
        const user = buildUser();

        expect(canCreateChannel(channel, user)).toEqual(false);
      });
    });

    describe("Org access channel", () => {
      it("returns true if user is org admin included within orgs list", () => {
        const channel = {
          access: SharingAccess.ORG,
          orgs: [orgId1],
        } as IChannel;
        const user = buildUser({ role: "org_admin" });

        expect(canCreateChannel(channel, user)).toEqual(true);
      });

      it("returns false if user is org admin not included within orgs list", () => {
        const channel = {
          access: SharingAccess.ORG,
          orgs: ["a"], // not in this org
        } as IChannel;
        const user = buildUser({ role: "org_admin" });

        expect(canCreateChannel(channel, user)).toEqual(false);
      });

      it("returns false if user is not org admin", () => {
        const channel = {
          access: SharingAccess.ORG,
          orgs: [orgId1],
        } as IChannel;
        const user = buildUser();

        expect(canCreateChannel(channel, user)).toEqual(false);
      });
    });

    describe("Public Access channel", () => {
      it("returns true if user is org admin included within orgs list", () => {
        const channel = {
          access: SharingAccess.PUBLIC,
          orgs: [orgId1],
        } as IChannel;
        const user = buildUser({ role: "org_admin" });

        expect(canCreateChannel(channel, user)).toEqual(true);
      });

      it("returns false if user is org admin not included within orgs list", () => {
        const channel = {
          access: SharingAccess.PUBLIC,
          orgs: ["a"], // not in this org
        } as IChannel;
        const user = buildUser({ role: "org_admin" });

        expect(canCreateChannel(channel, user)).toEqual(false);
      });

      it("returns false if user is not org admin", () => {
        const channel = {
          access: SharingAccess.PUBLIC,
          orgs: [orgId1],
        } as IChannel;
        const user = buildUser();

        expect(canCreateChannel(channel, user)).toEqual(false);
      });
    });
  });
});
