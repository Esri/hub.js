import { IGroup } from "@esri/arcgis-rest-types";
import {
  AclCategory,
  AclSubCategory,
  IChannel,
  IChannelAclPermission,
  IDiscussionsUser,
  IUpdateChannel,
  PostReaction,
  PostStatus,
  Role,
} from "../../src/types";
import { ChannelPermission } from "../../src/utils/channel-permission";
import { CANNOT_DISCUSS } from "../../src/utils/constants";

const ALLOWED_GROUP_ROLES = Object.freeze(["owner", "admin", "member"]);
const ADMIN_GROUP_MEMBER_TYPES = Object.freeze(["owner", "admin"]);

const ALLOWED_ROLES_FOR_READING = Object.freeze([
  Role.READ,
  Role.READWRITE,
  Role.MANAGE,
  Role.MODERATE,
  Role.OWNER,
]);

const ALLOWED_ROLES_FOR_POSTING = Object.freeze([
  Role.WRITE,
  Role.READWRITE,
  Role.MANAGE,
  Role.MODERATE,
  Role.OWNER,
]);
const ALLOWED_ROLES_FOR_MODERATION = Object.freeze([
  Role.MODERATE,
  Role.MANAGE,
  Role.OWNER,
]);

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

function buildGroup(id: string, memberType: string, typeKeywords?: string[]) {
  return {
    id,
    userMembership: { memberType },
    typeKeywords,
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
      key: groupId1,
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

describe("ChannelPermission class", () => {
  describe("constructor", () => {
    it("throws error if channel.channelAcl is undefined", () => {
      try {
        const channel = {} as IChannel;
        const a = new ChannelPermission(channel);
        throw new Error("should have thrown");
      } catch (error) {
        expect(error.message).toBe(
          "channel.channelAcl is required for ChannelPermission checks"
        );
      }
    });
  });

  describe("canPostToChannel", () => {
    describe("all permission cases", () => {
      it("returns false if user logged in and channel permissions are empty", async () => {
        const user = buildUser();
        const channelAcl = [] as IChannelAclPermission[];
        const channel = { channelAcl, creator: "foo" } as IChannel;

        const channelPermission = new ChannelPermission(channel);

        expect(channelPermission.canPostToChannel(user)).toBe(false);
      });

      it("returns false if user not logged in and channel permissions are empty", async () => {
        const user = buildUser({ username: null });
        const channelAcl = [] as IChannelAclPermission[];
        const channel = { channelAcl, creator: "foo" } as IChannel;

        const channelPermission = new ChannelPermission(channel);

        expect(channelPermission.canPostToChannel(user)).toBe(false);
      });
    });

    describe("Anonymous User Permissions", () => {
      it(`returns true if anonymous permission defined and role is allowed`, () => {
        const user = buildUser({ username: null });

        ALLOWED_ROLES_FOR_POSTING.forEach((allowedRole) => {
          const channelAcl = [
            { category: AclCategory.ANONYMOUS_USER, role: allowedRole },
          ] as IChannelAclPermission[];
          const channel = { channelAcl, creator: "foo" } as IChannel;

          const channelPermission = new ChannelPermission(channel);

          expect(channelPermission.canPostToChannel(user)).toBe(true);
        });
      });

      it("returns false if anonymous permission defined but role is read", () => {
        const user = buildUser({ username: null });
        const channelAcl = [
          { category: AclCategory.ANONYMOUS_USER, role: Role.READ },
        ] as IChannelAclPermission[];
        const channel = { channelAcl, creator: "foo" } as IChannel;

        const channelPermission = new ChannelPermission(channel);

        expect(channelPermission.canPostToChannel(user)).toBe(false);
      });
    });

    describe("Authenticated User Permissions", () => {
      it(`returns true if authenticated permission defined, user logged in, and role is allowed`, async () => {
        const user = buildUser();

        ALLOWED_ROLES_FOR_POSTING.forEach((allowedRole) => {
          const channelAcl = [
            { category: AclCategory.AUTHENTICATED_USER, role: allowedRole },
          ] as IChannelAclPermission[];
          const channel = { channelAcl, creator: "foo" } as IChannel;

          const channelPermission = new ChannelPermission(channel);

          expect(channelPermission.canPostToChannel(user)).toBe(true);
        });
      });

      it("returns false if authenticated permission defined, user logged in, and role is read", async () => {
        const user = buildUser();
        const channelAcl = [
          { category: AclCategory.AUTHENTICATED_USER, role: Role.READ },
        ] as IChannelAclPermission[];
        const channel = { channelAcl, creator: "foo" } as IChannel;

        const channelPermission = new ChannelPermission(channel);

        expect(channelPermission.canPostToChannel(user)).toBe(false);
      });

      it("returns false if authenticated permission defined and user is not logged in", async () => {
        const user = buildUser({ username: null });
        const channelAcl = [
          { category: AclCategory.AUTHENTICATED_USER, role: Role.READWRITE },
        ] as IChannelAclPermission[];
        const channel = { channelAcl, creator: "foo" } as IChannel;

        const channelPermission = new ChannelPermission(channel);

        expect(channelPermission.canPostToChannel(user)).toBe(false);
      });
    });

    describe("Group Permissions", () => {
      it("returns true if user is group member in group permission list and role is allowed", async () => {
        ALLOWED_ROLES_FOR_POSTING.forEach((allowedRole) => {
          const channelAcl = [
            {
              category: AclCategory.GROUP,
              subCategory: AclSubCategory.MEMBER,
              key: groupId1,
              role: allowedRole, // members write
            },
            {
              category: AclCategory.GROUP,
              subCategory: AclSubCategory.ADMIN,
              key: groupId1,
              role: Role.READ,
            },
          ] as IChannelAclPermission[];

          ALLOWED_GROUP_ROLES.forEach((memberType) => {
            const user = buildUser({
              orgId: orgId1,
              groups: [buildGroup(groupId1, memberType)], // member in groupId1
            });
            const channel = { channelAcl, creator: "foo" } as IChannel;

            const channelPermission = new ChannelPermission(channel);

            expect(channelPermission.canPostToChannel(user)).toBe(true);
          });
        });
      });

      it("returns false if user is group member in group permission list and role is NOT allowed", async () => {
        const user = buildUser(); // member in groupId1
        const channelAcl = [
          {
            category: AclCategory.GROUP,
            subCategory: AclSubCategory.MEMBER,
            key: groupId1,
            role: Role.READ, // members read
          },
          {
            category: AclCategory.GROUP,
            subCategory: AclSubCategory.ADMIN,
            key: groupId1,
            role: Role.READ,
          },
        ] as IChannelAclPermission[];
        const channel = { channelAcl, creator: "foo" } as IChannel;

        const channelPermission = new ChannelPermission(channel);

        expect(channelPermission.canPostToChannel(user)).toBe(false);
      });

      it("returns false if user is group member in group permission list, role is allowed, but userMemberType is none", async () => {
        const user = buildUser({
          groups: [buildGroup(groupId1, "none")], // none in groupId1
        });
        const channelAcl = [
          {
            category: AclCategory.GROUP,
            subCategory: AclSubCategory.MEMBER,
            key: groupId1,
            role: Role.READWRITE, // members read
          },
          {
            category: AclCategory.GROUP,
            subCategory: AclSubCategory.ADMIN,
            key: groupId1,
            role: Role.READWRITE, // admins read
          },
        ] as IChannelAclPermission[];
        const channel = { channelAcl, creator: "foo" } as IChannel;

        const channelPermission = new ChannelPermission(channel);

        expect(channelPermission.canPostToChannel(user)).toBe(false);
      });

      it("returns true if user is group owner/admin in group permission list and role is allowed", async () => {
        ALLOWED_ROLES_FOR_POSTING.forEach((allowedRole) => {
          const channelAcl = [
            {
              category: AclCategory.GROUP,
              subCategory: AclSubCategory.MEMBER,
              key: groupId1,
              role: Role.READ,
            },
            {
              category: AclCategory.GROUP,
              subCategory: AclSubCategory.ADMIN,
              key: groupId1,
              role: allowedRole, // admins write
            },
          ] as IChannelAclPermission[];

          ["owner", "admin"].forEach((memberType) => {
            const user = buildUser({
              orgId: orgId1,
              groups: [buildGroup(groupId1, memberType)], // admin in groupId1
            });
            const channel = { channelAcl, creator: "foo" } as IChannel;

            const channelPermission = new ChannelPermission(channel);

            expect(channelPermission.canPostToChannel(user)).toBe(true);
          });
        });
      });

      it("returns false if user is group owner/admin in group permission list and role is NOT allowed", async () => {
        const user = buildUser(); // admin in groupId2
        const channelAcl = [
          {
            category: AclCategory.GROUP,
            subCategory: AclSubCategory.MEMBER,
            key: groupId2,
            role: Role.READ,
          },
          {
            category: AclCategory.GROUP,
            subCategory: AclSubCategory.ADMIN,
            key: groupId2,
            role: Role.READ, // admins read
          },
        ] as IChannelAclPermission[];
        const channel = { channelAcl, creator: "foo" } as IChannel;

        const channelPermission = new ChannelPermission(channel);

        expect(channelPermission.canPostToChannel(user)).toBe(false);
      });

      it("returns true if user is group member of at least one group in permissions list that is discussable", async () => {
        const user = buildUser({
          orgId: orgId1,
          groups: [
            buildGroup(groupId1, "member"), // member in groupId1
            buildGroup(groupId2, "member", [CANNOT_DISCUSS]), // member in groupId2
          ],
        });
        const channelAcl = [
          {
            category: AclCategory.GROUP,
            subCategory: AclSubCategory.MEMBER,
            key: groupId1,
            role: Role.READWRITE, // members write
          },
          {
            category: AclCategory.GROUP,
            subCategory: AclSubCategory.ADMIN,
            key: groupId1,
            role: Role.READ,
          },
          {
            category: AclCategory.GROUP,
            subCategory: AclSubCategory.MEMBER,
            key: groupId2,
            role: Role.READWRITE, // members write, group CANNOT_DISCUSS
          },
          {
            category: AclCategory.GROUP,
            subCategory: AclSubCategory.ADMIN,
            key: groupId2,
            role: Role.READ,
          },
        ] as IChannelAclPermission[];
        const channel = { channelAcl, creator: "foo" } as IChannel;

        const channelPermission = new ChannelPermission(channel);

        expect(channelPermission.canPostToChannel(user)).toBe(true);
      });

      it("returns false if user is group member in permissions list but the group is not discussable", async () => {
        const user = buildUser({
          orgId: orgId1,
          groups: [
            buildGroup(groupId1, "member", [CANNOT_DISCUSS]), // member in groupId1
          ],
        });
        const channelAcl = [
          {
            category: AclCategory.GROUP,
            subCategory: AclSubCategory.MEMBER,
            key: groupId1,
            role: Role.READWRITE, // members write
          },
          {
            category: AclCategory.GROUP,
            subCategory: AclSubCategory.ADMIN,
            key: groupId1,
            role: Role.READ,
          },
        ] as IChannelAclPermission[];
        const channel = { channelAcl, creator: "foo" } as IChannel;

        const channelPermission = new ChannelPermission(channel);

        expect(channelPermission.canPostToChannel(user)).toBe(false);
      });

      it("returns false if user is group admin but group is not in permissions list", async () => {
        const user = buildUser({
          orgId: orgId1,
          groups: [
            buildGroup("unknownGroupId", "admin"), // admin in unknownGroupId
          ],
        });
        const channelAcl = [
          {
            category: AclCategory.GROUP,
            subCategory: AclSubCategory.MEMBER,
            key: groupId1,
            role: Role.READWRITE, // members write
          },
          {
            category: AclCategory.GROUP,
            subCategory: AclSubCategory.ADMIN,
            key: groupId1,
            role: Role.READWRITE, // admin write
          },
        ] as IChannelAclPermission[];
        const channel = { channelAcl, creator: "foo" } as IChannel;

        const channelPermission = new ChannelPermission(channel);

        expect(channelPermission.canPostToChannel(user)).toBe(false);
      });
    });

    describe("Org Permissions", () => {
      it("returns true if user is org member in permissions list and member role is allowed", async () => {
        const user = buildUser();

        ALLOWED_ROLES_FOR_POSTING.forEach((allowedRole) => {
          const channelAcl = [
            {
              category: AclCategory.ORG,
              subCategory: AclSubCategory.MEMBER,
              key: user.orgId,
              role: allowedRole, // members write
            },
            {
              category: AclCategory.ORG,
              subCategory: AclSubCategory.ADMIN,
              key: user.orgId,
              role: Role.READ, // admin read
            },
          ] as IChannelAclPermission[];
          const channel = { channelAcl, creator: "joker" } as IChannel;

          const channelPermission = new ChannelPermission(channel);

          expect(channelPermission.canPostToChannel(user)).toBe(true);
        });
      });

      it("returns true if user is org_admin in permissions list and admin role is allowed", async () => {
        const user = buildUser({ role: "org_admin" });

        ALLOWED_ROLES_FOR_POSTING.forEach((allowedRole) => {
          const channelAcl = [
            {
              category: AclCategory.ORG,
              subCategory: AclSubCategory.MEMBER,
              key: user.orgId,
              role: Role.READ, // members read
            },
            {
              category: AclCategory.ORG,
              subCategory: AclSubCategory.ADMIN,
              key: user.orgId,
              role: allowedRole, // admin write
            },
          ] as IChannelAclPermission[];
          const channel = { channelAcl, creator: "foo" } as IChannel;

          const channelPermission = new ChannelPermission(channel);

          expect(channelPermission.canPostToChannel(user)).toBe(true);
        });
      });

      it("returns false if user is not in the permissions org", async () => {
        const user = buildUser({ orgId: "unknownOrgId" });
        const channelAcl = [
          {
            category: AclCategory.ORG,
            subCategory: AclSubCategory.MEMBER,
            key: orgId1,
            role: Role.READ, // members read
          },
          {
            category: AclCategory.ORG,
            subCategory: AclSubCategory.ADMIN,
            key: orgId1,
            role: Role.READWRITE, // admin write
          },
        ] as IChannelAclPermission[];
        const channel = { channelAcl, creator: "foo" } as IChannel;

        const channelPermission = new ChannelPermission(channel);

        expect(channelPermission.canPostToChannel(user)).toBe(false);
      });
    });

    describe("User Permissions", () => {
      it("returns true if user is in permissions list and role is allowed", () => {
        const user = buildUser();

        ALLOWED_ROLES_FOR_POSTING.forEach((allowedRole) => {
          const channelAcl = [
            {
              category: AclCategory.USER,
              key: user.username,
              role: allowedRole,
            },
          ] as IChannelAclPermission[];
          const channel = { channelAcl, creator: "foo" } as IChannel;

          const channelPermission = new ChannelPermission(channel);

          expect(channelPermission.canPostToChannel(user)).toBe(true);
        });
      });

      it("returns false if user is in permissions list but role is read", () => {
        const user = buildUser();
        const channelAcl = [
          { category: AclCategory.USER, key: user.username, role: Role.READ },
        ] as IChannelAclPermission[];
        const channel = { channelAcl, creator: "foo" } as IChannel;

        const channelPermission = new ChannelPermission(channel);

        expect(channelPermission.canPostToChannel(user)).toBe(false);
      });
    });
  });

  describe("canCreateChannel", () => {
    describe("all permissions cases", () => {
      it("returns false if user not authenticated", () => {
        const user = buildUser({ username: null });
        const channelAcl = [
          { category: AclCategory.ANONYMOUS_USER, role: Role.READ },
        ] as IChannelAclPermission[];
        const channel = { channelAcl, creator: "foo" } as IChannel;

        const channelPermission = new ChannelPermission(channel);

        expect(channelPermission.canCreateChannel(user)).toEqual(false);
      });

      it("returns false if permissions list is empty", () => {
        const user = buildUser();
        const channelAcl = [] as IChannelAclPermission[];
        const channel = { channelAcl, creator: "foo" } as IChannel;

        const channelPermission = new ChannelPermission(channel);

        expect(channelPermission.canCreateChannel(user)).toEqual(false);
      });

      it("returns true with a full valid channelAcl if user is the org_admin, in all groups, and org permissions only relate to users org", () => {
        const user = buildUser({
          role: "org_admin",
          privileges: ["portal:admin:shareToPublic"],
        });
        const channelAcl = buildCompleteAcl() as IChannelAclPermission[];
        const channel = { channelAcl, creator: "foo" } as IChannel;

        const channelPermission = new ChannelPermission(channel);

        expect(channelPermission.canCreateChannel(user)).toEqual(true);
      });
    });

    describe("Anonymous User Permissions", () => {
      it("returns true if user is org_admin", () => {
        const user = buildUser({ role: "org_admin" });
        const channelAcl = [
          { category: AclCategory.ANONYMOUS_USER, role: Role.READ },
        ] as IChannelAclPermission[];
        const channel = { channelAcl, creator: "foo" } as IChannel;

        const channelPermission = new ChannelPermission(channel);

        expect(channelPermission.canCreateChannel(user)).toEqual(true);
      });

      it("returns true if user has privilege portal:admin:shareToPublic", () => {
        const user = buildUser({ privileges: ["portal:admin:shareToPublic"] });
        const channelAcl = [
          { category: AclCategory.ANONYMOUS_USER, role: Role.READ },
        ] as IChannelAclPermission[];
        const channel = { channelAcl, creator: "foo" } as IChannel;

        const channelPermission = new ChannelPermission(channel);

        expect(channelPermission.canCreateChannel(user)).toEqual(true);
      });

      it("returns true if user has privilege portal:user:shareToPublic", () => {
        const user = buildUser({ privileges: ["portal:user:shareToPublic"] });
        const channelAcl = [
          { category: AclCategory.ANONYMOUS_USER, role: Role.READ },
        ] as IChannelAclPermission[];
        const channel = { channelAcl, creator: "foo" } as IChannel;

        const channelPermission = new ChannelPermission(channel);

        expect(channelPermission.canCreateChannel(user)).toEqual(true);
      });

      it("returns false if user is not org_admin and does not have privileges", () => {
        const user = buildUser();
        const channelAcl = [
          { category: AclCategory.ANONYMOUS_USER, role: Role.READ },
        ] as IChannelAclPermission[];
        const channel = { channelAcl, creator: "foo" } as IChannel;

        const channelPermission = new ChannelPermission(channel);

        expect(channelPermission.canCreateChannel(user)).toEqual(false);
      });
    });

    describe("Authenticated User Permissions", () => {
      it("returns true if user is org_admin", () => {
        const user = buildUser({ role: "org_admin" });
        const channelAcl = [
          { category: AclCategory.AUTHENTICATED_USER, role: Role.READ },
        ] as IChannelAclPermission[];
        const channel = { channelAcl, creator: "foo" } as IChannel;

        const channelPermission = new ChannelPermission(channel);

        expect(channelPermission.canCreateChannel(user)).toEqual(true);
      });

      it("returns true if user if user has privilege portal:admin:shareToPublic", () => {
        const user = buildUser({ privileges: ["portal:admin:shareToPublic"] });
        const channelAcl = [
          { category: AclCategory.AUTHENTICATED_USER, role: Role.READ },
        ] as IChannelAclPermission[];
        const channel = { channelAcl, creator: "foo" } as IChannel;

        const channelPermission = new ChannelPermission(channel);

        expect(channelPermission.canCreateChannel(user)).toEqual(true);
      });

      it("returns true if user if user has privilege portal:user:shareToPublic", () => {
        const user = buildUser({ privileges: ["portal:user:shareToPublic"] });
        const channelAcl = [
          { category: AclCategory.AUTHENTICATED_USER, role: Role.READ },
        ] as IChannelAclPermission[];
        const channel = { channelAcl, creator: "foo" } as IChannel;

        const channelPermission = new ChannelPermission(channel);

        expect(channelPermission.canCreateChannel(user)).toEqual(true);
      });

      it("returns false if user is not org_admin and does not privileges", () => {
        const user = buildUser();
        const channelAcl = [
          { category: AclCategory.AUTHENTICATED_USER, role: Role.READ },
        ] as IChannelAclPermission[];
        const channel = { channelAcl, creator: "foo" } as IChannel;

        const channelPermission = new ChannelPermission(channel);

        expect(channelPermission.canCreateChannel(user)).toEqual(false);
      });
    });

    describe("Group Permissions", () => {
      it("returns true if user is a member of all groups and memberType is member, admin, or owner", async () => {
        const user = buildUser({
          groups: [
            buildGroup(groupId1, "member"),
            buildGroup(groupId2, "admin"),
            buildGroup(groupId3, "owner"),
          ],
        });
        const channelAcl = [
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
            category: AclCategory.GROUP,
            subCategory: AclSubCategory.MEMBER,
            key: groupId3,
            role: Role.READ,
          },
        ] as IChannelAclPermission[];
        const channel = { channelAcl, creator: "foo" } as IChannel;

        const channelPermission = new ChannelPermission(channel);

        expect(channelPermission.canCreateChannel(user)).toEqual(true);
      });

      it("returns false is user is a member of all groups and memberType is none", async () => {
        const user = buildUser({
          groups: [buildGroup(groupId1, "admin"), buildGroup(groupId2, "none")],
        });
        const channelAcl = [
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
        ] as IChannelAclPermission[];
        const channel = { channelAcl, creator: "foo" } as IChannel;

        const channelPermission = new ChannelPermission(channel);

        expect(channelPermission.canCreateChannel(user)).toEqual(false);
      });

      it("returns false is user is a member of all groups but group is not discussable", async () => {
        const user = buildUser({
          groups: [
            buildGroup(groupId1, "admin"),
            buildGroup(groupId2, "member", [CANNOT_DISCUSS]),
          ],
        });
        const channelAcl = [
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
        ] as IChannelAclPermission[];
        const channel = { channelAcl, creator: "foo" } as IChannel;

        const channelPermission = new ChannelPermission(channel);

        expect(channelPermission.canCreateChannel(user)).toEqual(false);
      });

      it("returns false if user is not a member of every group", async () => {
        const user = buildUser();
        const channelAcl = [
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
            key: groupId3, // user not member here
            role: Role.READWRITE,
          },
        ] as IChannelAclPermission[];
        const channel = { channelAcl, creator: "foo" } as IChannel;

        const channelPermission = new ChannelPermission(channel);

        expect(channelPermission.canCreateChannel(user)).toEqual(false);
      });
    });

    describe("Org Permissions", () => {
      it("returns true if user is org_admin and every permission is for the users orgId", () => {
        const user = buildUser({ role: "org_admin" });
        const channelAcl = [
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
        ] as IChannelAclPermission[];
        const channel = { channelAcl, creator: "foo" } as IChannel;

        const channelPermission = new ChannelPermission(channel);

        expect(channelPermission.canCreateChannel(user)).toEqual(true);
      });

      it("returns true if user if user has privilege portal:admin:shareToOrg and every permission is for the users orgId", () => {
        const user = buildUser({ privileges: ["portal:admin:shareToOrg"] });
        const channelAcl = [
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
        ] as IChannelAclPermission[];
        const channel = { channelAcl, creator: "foo" } as IChannel;

        const channelPermission = new ChannelPermission(channel);

        expect(channelPermission.canCreateChannel(user)).toEqual(true);
      });

      it("returns true if user if user has privilege portal:user:shareToOrg and every permission is for the users orgId", () => {
        const user = buildUser({ privileges: ["portal:user:shareToOrg"] });
        const channelAcl = [
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
        ] as IChannelAclPermission[];
        const channel = { channelAcl, creator: "foo" } as IChannel;

        const channelPermission = new ChannelPermission(channel);

        expect(channelPermission.canCreateChannel(user)).toEqual(true);
      });

      it("returns false if user is org_admin and every permission is not for the users orgId", () => {
        const user = buildUser({ role: "org_admin" });
        const channelAcl = [
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
        ] as IChannelAclPermission[];
        const channel = { channelAcl, creator: "foo" } as IChannel;

        const channelPermission = new ChannelPermission(channel);

        expect(channelPermission.canCreateChannel(user)).toEqual(false);
      });

      it("returns false if user has privilege portal:admin:shareToOrg and every permission is not for the users orgId", () => {
        const user = buildUser({ privileges: ["portal:admin:shareToOrg"] });
        const channelAcl = [
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
        ] as IChannelAclPermission[];
        const channel = { channelAcl, creator: "foo" } as IChannel;

        const channelPermission = new ChannelPermission(channel);

        expect(channelPermission.canCreateChannel(user)).toEqual(false);
      });

      it("returns false if user is not org_admin or does not have privilege portal:admin:shareToOrg", () => {
        const user = buildUser();
        const channelAcl = [
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
        ] as IChannelAclPermission[];
        const channel = { channelAcl, creator: "foo" } as IChannel;

        const channelPermission = new ChannelPermission(channel);

        expect(channelPermission.canCreateChannel(user)).toEqual(false);
      });
    });

    describe("User Permissions", () => {
      it("returns false if user permissions are included", () => {
        const user = buildUser({ role: "org_admin" });
        const channelAcl = [
          {
            category: AclCategory.USER,
            key: "johnUsername",
            role: Role.READ,
          },
        ] as IChannelAclPermission[];
        const channel = { channelAcl, creator: "foo" } as IChannel;

        const channelPermission = new ChannelPermission(channel);

        expect(channelPermission.canCreateChannel(user)).toEqual(false);
      });
    });
  });

  describe("canModerateChannel", () => {
    describe("all permission cases", () => {
      it("returns false if user not logged in", async () => {
        const user = buildUser({ username: null });
        const channelAcl = [] as IChannelAclPermission[];
        const channel = { channelAcl, creator: user.username } as IChannel;

        const channelPermission = new ChannelPermission(channel);

        expect(channelPermission.canModerateChannel(user)).toBe(false);
      });

      it("returns false if the user created the channel but channel permissions do not allow moderation", async () => {
        const user = buildUser();
        const channelAcl = [] as IChannelAclPermission[];
        const channel = { channelAcl, creator: user.username } as IChannel;

        const channelPermission = new ChannelPermission(channel);

        expect(channelPermission.canModerateChannel(user)).toBe(false);
      });
    });

    describe("Group Permissions", () => {
      it("returns true if user is group member in group permission list and role is moderate or above", async () => {
        ALLOWED_ROLES_FOR_MODERATION.forEach((allowedRole) => {
          const channelAcl = [
            {
              category: AclCategory.GROUP,
              subCategory: AclSubCategory.MEMBER,
              key: groupId1,
              role: allowedRole, // members can moderate
            },
            {
              category: AclCategory.GROUP,
              subCategory: AclSubCategory.ADMIN,
              key: groupId1,
              role: Role.READ, // admins can only read
            },
          ] as IChannelAclPermission[];

          ADMIN_GROUP_MEMBER_TYPES.forEach((memberType) => {
            const user = buildUser({
              orgId: orgId1,
              groups: [buildGroup(groupId1, memberType)], // member in groupId1
            });
            const channel = { channelAcl, creator: "notUser" } as IChannel;

            const channelPermission = new ChannelPermission(channel);

            expect(channelPermission.canModerateChannel(user)).toBe(true);
          });
        });
      });

      it("returns false if user is group member in group permission list and role is NOT allowed", async () => {
        const user = buildUser(); // member in groupId1
        const channelAcl = [
          {
            category: AclCategory.GROUP,
            subCategory: AclSubCategory.MEMBER,
            key: groupId1,
            role: Role.READ, // members read
          },
          {
            category: AclCategory.GROUP,
            subCategory: AclSubCategory.ADMIN,
            key: groupId1,
            role: Role.READ, // admins read
          },
        ] as IChannelAclPermission[];
        const channel = { channelAcl, creator: "notUser" } as IChannel;

        const channelPermission = new ChannelPermission(channel);

        expect(channelPermission.canModerateChannel(user)).toBe(false);
      });

      it("returns false if user is group member in group permission list, role is allowed, but userMemberType is none", async () => {
        const user = buildUser({
          groups: [buildGroup(groupId1, "none")], // none in groupId1
        });
        const channelAcl = [
          {
            category: AclCategory.GROUP,
            subCategory: AclSubCategory.MEMBER,
            key: groupId1,
            role: Role.MODERATE, // members moderate
          },
          {
            category: AclCategory.GROUP,
            subCategory: AclSubCategory.ADMIN,
            key: groupId1,
            role: Role.MODERATE, // admins moderate
          },
        ] as IChannelAclPermission[];
        const channel = { channelAcl, creator: "notUser" } as IChannel;

        const channelPermission = new ChannelPermission(channel);

        expect(channelPermission.canModerateChannel(user)).toBe(false);
      });

      it("returns true if user is group owner/admin in group permission list and role is allowed", async () => {
        ALLOWED_ROLES_FOR_MODERATION.forEach((allowedRole) => {
          const channelAcl = [
            {
              category: AclCategory.GROUP,
              subCategory: AclSubCategory.MEMBER,
              key: groupId1,
              role: Role.READ, // members read
            },
            {
              category: AclCategory.GROUP,
              subCategory: AclSubCategory.ADMIN,
              key: groupId1,
              role: allowedRole, // admins moderate
            },
          ] as IChannelAclPermission[];

          ["owner", "admin"].forEach((memberType) => {
            const user = buildUser({
              orgId: orgId1,
              groups: [buildGroup(groupId1, memberType)], // admin or owner in groupId1
            });
            const channel = { channelAcl, creator: "notUser" } as IChannel;

            const channelPermission = new ChannelPermission(channel);

            expect(channelPermission.canModerateChannel(user)).toBe(true);
          });
        });
      });

      it("returns false if user is group owner/admin in group permission list and role is NOT allowed", async () => {
        const user = buildUser(); // admin in groupId2
        const channelAcl = [
          {
            category: AclCategory.GROUP,
            subCategory: AclSubCategory.MEMBER,
            key: groupId2,
            role: Role.READ, // members read
          },
          {
            category: AclCategory.GROUP,
            subCategory: AclSubCategory.ADMIN,
            key: groupId2,
            role: Role.READ, // admins read
          },
        ] as IChannelAclPermission[];
        const channel = { channelAcl, creator: "notUser" } as IChannel;

        const channelPermission = new ChannelPermission(channel);

        expect(channelPermission.canModerateChannel(user)).toBe(false);
      });

      it("returns false if user is group admin but group is not in permissions list", async () => {
        const user = buildUser({
          orgId: orgId1,
          groups: [
            buildGroup("unknownGroupId", "admin"), // admin in unknownGroupId
          ],
        });
        const channelAcl = [
          {
            category: AclCategory.GROUP,
            subCategory: AclSubCategory.MEMBER,
            key: groupId1,
            role: Role.READWRITE, // members write
          },
          {
            category: AclCategory.GROUP,
            subCategory: AclSubCategory.ADMIN,
            key: groupId1,
            role: Role.MODERATE, // admin moderate
          },
        ] as IChannelAclPermission[];
        const channel = { channelAcl, creator: "notUser" } as IChannel;

        const channelPermission = new ChannelPermission(channel);

        expect(channelPermission.canModerateChannel(user)).toBe(false);
      });
    });

    describe("Org Permissions", () => {
      it("returns true if user is org member in permissions list and member role is allowed", async () => {
        const user = buildUser();

        ALLOWED_ROLES_FOR_MODERATION.forEach((allowedRole) => {
          const channelAcl = [
            {
              category: AclCategory.ORG,
              subCategory: AclSubCategory.MEMBER,
              key: user.orgId,
              role: allowedRole, // members moderate
            },
            {
              category: AclCategory.ORG,
              subCategory: AclSubCategory.ADMIN,
              key: user.orgId,
              role: Role.READ, // admin read
            },
          ] as IChannelAclPermission[];
          const channel = { channelAcl, creator: "notUser" } as IChannel;

          const channelPermission = new ChannelPermission(channel);

          expect(channelPermission.canModerateChannel(user)).toBe(true);
        });
      });

      it("returns true if user is org_admin in permissions list and admin role is allowed", async () => {
        const user = buildUser({ role: "org_admin" });

        ALLOWED_ROLES_FOR_MODERATION.forEach((allowedRole) => {
          const channelAcl = [
            {
              category: AclCategory.ORG,
              subCategory: AclSubCategory.MEMBER,
              key: user.orgId,
              role: Role.READ, // members read
            },
            {
              category: AclCategory.ORG,
              subCategory: AclSubCategory.ADMIN,
              key: user.orgId,
              role: allowedRole, // admin moderate
            },
          ] as IChannelAclPermission[];
          const channel = { channelAcl, creator: "notUser" } as IChannel;

          const channelPermission = new ChannelPermission(channel);

          expect(channelPermission.canModerateChannel(user)).toBe(true);
        });
      });

      it("returns false if user is not in the permissions org", async () => {
        const user = buildUser({ orgId: "unknownOrgId" }); // unknown org
        const channelAcl = [
          {
            category: AclCategory.ORG,
            subCategory: AclSubCategory.MEMBER,
            key: orgId1,
            role: Role.READ, // members read
          },
          {
            category: AclCategory.ORG,
            subCategory: AclSubCategory.ADMIN,
            key: orgId1,
            role: Role.MODERATE, // admin moderate
          },
        ] as IChannelAclPermission[];
        const channel = { channelAcl, creator: "notUser" } as IChannel;

        const channelPermission = new ChannelPermission(channel);

        expect(channelPermission.canModerateChannel(user)).toBe(false);
      });
    });

    describe("User Permissions", () => {
      it("returns true if user is in permissions list and role is allowed", () => {
        const user = buildUser();

        ALLOWED_ROLES_FOR_MODERATION.forEach((allowedRole) => {
          const channelAcl = [
            {
              category: AclCategory.USER,
              key: user.username,
              role: allowedRole,
            },
          ] as IChannelAclPermission[];
          const channel = { channelAcl, creator: "notUser" } as IChannel;

          const channelPermission = new ChannelPermission(channel);

          expect(channelPermission.canModerateChannel(user)).toBe(true);
        });
      });

      it("returns false if user is in permissions list but role is not allowed", () => {
        const user = buildUser();
        const channelAcl = [
          { category: AclCategory.USER, key: user.username, role: Role.READ },
        ] as IChannelAclPermission[];
        const channel = { channelAcl, creator: "notUser" } as IChannel;

        const channelPermission = new ChannelPermission(channel);

        expect(channelPermission.canModerateChannel(user)).toBe(false);
      });
    });
  });

  describe("canUpdateProperties", () => {
    describe("no updates", () => {
      it("returns true if no updates, regardless of role", () => {
        const user = buildUser();
        const channelAcl = [
          { category: AclCategory.USER, key: user.username, role: Role.READ }, // bad role for update
        ] as IChannelAclPermission[];

        const channel = {
          allowReply: true,
          channelAcl,
        } as IChannel;
        const channelPermission = new ChannelPermission(channel);

        const updates: IUpdateChannel = {};

        expect(channelPermission.canUpdateProperties(user, updates)).toBe(true);
      });

      it("returns true if updates undefined, regardless of role", () => {
        const user = buildUser();
        const channelAcl = [
          { category: AclCategory.USER, key: user.username, role: Role.READ }, // bad role for update
        ] as IChannelAclPermission[];

        const channel = {
          allowReply: true,
          channelAcl,
        } as IChannel;
        const channelPermission = new ChannelPermission(channel);

        expect(channelPermission.canUpdateProperties(user)).toBe(true);
      });
    });

    describe("allowReply", () => {
      it("returns true if value not changed from existing regardless of role", () => {
        const user = buildUser();
        const channelAcl = [
          { category: AclCategory.USER, key: user.username, role: Role.READ }, // bad role for update
        ] as IChannelAclPermission[];

        const channel = {
          allowReply: true,
          channelAcl,
          creator: "foo",
        } as IChannel;
        const channelPermission = new ChannelPermission(channel);

        const updates: IUpdateChannel = {
          allowReply: true,
        };

        expect(channelPermission.canUpdateProperties(user, updates)).toBe(true);
      });

      it("returns true if update is undefined regardless of role", () => {
        const user = buildUser();
        const channelAcl = [
          { category: AclCategory.USER, key: user.username, role: Role.READ }, // bad role for update
        ] as IChannelAclPermission[];

        const channel = {
          allowReply: true,
          channelAcl,
          creator: "foo",
        } as IChannel;
        const channelPermission = new ChannelPermission(channel);

        const updates: IUpdateChannel = {
          allowReply: undefined,
        };

        expect(channelPermission.canUpdateProperties(user, updates)).toBe(true);
      });

      it("returns true if user has a role of moderate", () => {
        const user = buildUser();
        const channelAcl = [
          {
            category: AclCategory.USER,
            key: user.username,
            role: Role.MODERATE,
          },
        ] as IChannelAclPermission[];

        const channel = {
          allowReply: false,
          channelAcl,
          creator: "foo",
        } as IChannel;
        const channelPermission = new ChannelPermission(channel);

        const updates: IUpdateChannel = {
          allowReply: true,
        };

        expect(channelPermission.canUpdateProperties(user, updates)).toBe(true);
      });

      it("returns true if user has a role of manage", () => {
        const user = buildUser();
        const channelAcl = [
          { category: AclCategory.USER, key: user.username, role: Role.MANAGE },
        ] as IChannelAclPermission[];

        const channel = {
          allowReply: false,
          channelAcl,
          creator: "foo",
        } as IChannel;
        const channelPermission = new ChannelPermission(channel);

        const updates: IUpdateChannel = {
          allowReply: true,
        };

        expect(channelPermission.canUpdateProperties(user, updates)).toBe(true);
      });

      it("returns true if user has a role of owner", () => {
        const user = buildUser();
        const channelAcl = [
          { category: AclCategory.USER, key: user.username, role: Role.OWNER },
        ] as IChannelAclPermission[];

        const channel = {
          allowReply: false,
          channelAcl,
          creator: "foo",
        } as IChannel;
        const channelPermission = new ChannelPermission(channel);

        const updates: IUpdateChannel = {
          allowReply: true,
        };

        expect(channelPermission.canUpdateProperties(user, updates)).toBe(true);
      });

      it("returns false if user does not have a minimum role of moderate", () => {
        const user = buildUser();
        const channelAcl = [
          {
            category: AclCategory.USER,
            key: user.username,
            role: Role.READWRITE,
          },
        ] as IChannelAclPermission[];

        const channel = {
          allowReply: false,
          channelAcl,
          creator: "foo",
        } as IChannel;
        const channelPermission = new ChannelPermission(channel);

        const updates: IUpdateChannel = {
          allowReply: true,
        };

        expect(channelPermission.canUpdateProperties(user, updates)).toBe(
          false
        );
      });
    });

    describe("allowReaction", () => {
      it("returns true if value not changed from existing regardless of role", () => {
        const user = buildUser();
        const channelAcl = [
          { category: AclCategory.USER, key: user.username, role: Role.READ }, // bad role for update
        ] as IChannelAclPermission[];

        const channel = {
          allowReaction: true,
          channelAcl,
          creator: "foo",
        } as IChannel;
        const channelPermission = new ChannelPermission(channel);

        const updates: IUpdateChannel = {
          allowReaction: true,
        };

        expect(channelPermission.canUpdateProperties(user, updates)).toBe(true);
      });

      it("returns true if update is undefined existing regardless of role", () => {
        const user = buildUser();
        const channelAcl = [
          { category: AclCategory.USER, key: user.username, role: Role.READ }, // bad role for update
        ] as IChannelAclPermission[];

        const channel = {
          allowReaction: true,
          channelAcl,
          creator: "foo",
        } as IChannel;
        const channelPermission = new ChannelPermission(channel);

        const updates: IUpdateChannel = {
          allowReaction: undefined,
        };

        expect(channelPermission.canUpdateProperties(user, updates)).toBe(true);
      });

      it("returns true if user has a role of moderate", () => {
        const user = buildUser();
        const channelAcl = [
          {
            category: AclCategory.USER,
            key: user.username,
            role: Role.MODERATE,
          },
        ] as IChannelAclPermission[];

        const channel = {
          allowReaction: false,
          channelAcl,
          creator: "foo",
        } as IChannel;
        const channelPermission = new ChannelPermission(channel);

        const updates: IUpdateChannel = {
          allowReaction: true,
        };

        expect(channelPermission.canUpdateProperties(user, updates)).toBe(true);
      });

      it("returns true if user has a role of manage", () => {
        const user = buildUser();
        const channelAcl = [
          { category: AclCategory.USER, key: user.username, role: Role.MANAGE },
        ] as IChannelAclPermission[];

        const channel = {
          allowReaction: false,
          channelAcl,
          creator: "foo",
        } as IChannel;
        const channelPermission = new ChannelPermission(channel);

        const updates: IUpdateChannel = {
          allowReaction: true,
        };

        expect(channelPermission.canUpdateProperties(user, updates)).toBe(true);
      });

      it("returns true if user has a role of owner", () => {
        const user = buildUser();
        const channelAcl = [
          { category: AclCategory.USER, key: user.username, role: Role.OWNER },
        ] as IChannelAclPermission[];

        const channel = {
          allowReaction: false,
          channelAcl,
          creator: "foo",
        } as IChannel;
        const channelPermission = new ChannelPermission(channel);

        const updates: IUpdateChannel = {
          allowReaction: true,
        };

        expect(channelPermission.canUpdateProperties(user, updates)).toBe(true);
      });

      it("returns false if user does not have a minimum role of moderate", () => {
        const user = buildUser();
        const channelAcl = [
          {
            category: AclCategory.USER,
            key: user.username,
            role: Role.READWRITE,
          },
        ] as IChannelAclPermission[];

        const channel = {
          allowReaction: false,
          channelAcl,
          creator: "foo",
        } as IChannel;
        const channelPermission = new ChannelPermission(channel);

        const updates: IUpdateChannel = {
          allowReaction: true,
        };

        expect(channelPermission.canUpdateProperties(user, updates)).toBe(
          false
        );
      });
    });

    describe("allowAsAnonymous", () => {
      it("returns true if value not changed from existing regardless of role", () => {
        const user = buildUser();
        const channelAcl = [
          { category: AclCategory.USER, key: user.username, role: Role.READ }, // bad role for update
        ] as IChannelAclPermission[];

        const channel = {
          allowAsAnonymous: true,
          channelAcl,
          creator: "foo",
        } as IChannel;
        const channelPermission = new ChannelPermission(channel);

        const updates: IUpdateChannel = {
          allowAsAnonymous: true,
        };

        expect(channelPermission.canUpdateProperties(user, updates)).toBe(true);
      });

      it("returns true if update is undefined regardless of role", () => {
        const user = buildUser();
        const channelAcl = [
          { category: AclCategory.USER, key: user.username, role: Role.READ }, // bad role for update
        ] as IChannelAclPermission[];

        const channel = {
          allowAsAnonymous: true,
          channelAcl,
          creator: "foo",
        } as IChannel;
        const channelPermission = new ChannelPermission(channel);

        const updates: IUpdateChannel = {
          allowAsAnonymous: undefined,
        };

        expect(channelPermission.canUpdateProperties(user, updates)).toBe(true);
      });

      it("returns true if user has a role of moderate", () => {
        const user = buildUser();
        const channelAcl = [
          {
            category: AclCategory.USER,
            key: user.username,
            role: Role.MODERATE,
          },
        ] as IChannelAclPermission[];

        const channel = {
          allowAsAnonymous: false,
          channelAcl,
          creator: "foo",
        } as IChannel;
        const channelPermission = new ChannelPermission(channel);

        const updates: IUpdateChannel = {
          allowAsAnonymous: true,
        };

        expect(channelPermission.canUpdateProperties(user, updates)).toBe(true);
      });

      it("returns true if user has a role of manage", () => {
        const user = buildUser();
        const channelAcl = [
          { category: AclCategory.USER, key: user.username, role: Role.MANAGE },
        ] as IChannelAclPermission[];

        const channel = {
          allowAsAnonymous: false,
          channelAcl,
          creator: "foo",
        } as IChannel;
        const channelPermission = new ChannelPermission(channel);

        const updates: IUpdateChannel = {
          allowAsAnonymous: true,
        };

        expect(channelPermission.canUpdateProperties(user, updates)).toBe(true);
      });

      it("returns true if user has a role of owner", () => {
        const user = buildUser();
        const channelAcl = [
          { category: AclCategory.USER, key: user.username, role: Role.OWNER },
        ] as IChannelAclPermission[];

        const channel = {
          allowAsAnonymous: false,
          channelAcl,
          creator: "foo",
        } as IChannel;
        const channelPermission = new ChannelPermission(channel);

        const updates: IUpdateChannel = {
          allowAsAnonymous: true,
        };

        expect(channelPermission.canUpdateProperties(user, updates)).toBe(true);
      });

      it("returns false if user does not have a minimum role of moderate", () => {
        const user = buildUser();
        const channelAcl = [
          {
            category: AclCategory.USER,
            key: user.username,
            role: Role.READWRITE,
          },
        ] as IChannelAclPermission[];

        const channel = {
          allowAsAnonymous: false,
          channelAcl,
          creator: "foo",
        } as IChannel;
        const channelPermission = new ChannelPermission(channel);

        const updates: IUpdateChannel = {
          allowAsAnonymous: true,
        };

        expect(channelPermission.canUpdateProperties(user, updates)).toBe(
          false
        );
      });
    });

    describe("allowedReactions", () => {
      it("returns true if value not changed from existing regardless of role", () => {
        const user = buildUser();
        const channelAcl = [
          { category: AclCategory.USER, key: user.username, role: Role.READ }, // bad role for update
        ] as IChannelAclPermission[];

        const channel = {
          allowedReactions: [PostReaction.THUMBS_UP],
          channelAcl,
          creator: "foo",
        } as IChannel;
        const channelPermission = new ChannelPermission(channel);

        const updates: IUpdateChannel = {
          allowedReactions: [PostReaction.THUMBS_UP],
        };

        expect(channelPermission.canUpdateProperties(user, updates)).toBe(true);
      });

      it("returns true if value not changed (just rearranged) from existing regardless of role", () => {
        const user = buildUser();
        const channelAcl = [
          { category: AclCategory.USER, key: user.username, role: Role.READ }, // bad role for update
        ] as IChannelAclPermission[];

        const channel = {
          allowedReactions: [PostReaction.THUMBS_UP, PostReaction.LAUGH],
          channelAcl,
          creator: "foo",
        } as IChannel;
        const channelPermission = new ChannelPermission(channel);

        const updates: IUpdateChannel = {
          allowedReactions: [PostReaction.LAUGH, PostReaction.THUMBS_UP],
        };

        expect(channelPermission.canUpdateProperties(user, updates)).toBe(true);
      });

      it("returns true if user has a role of manage and reaction is removed", () => {
        const user = buildUser();
        const channelAcl = [
          { category: AclCategory.USER, key: user.username, role: Role.MANAGE },
        ] as IChannelAclPermission[];

        const channel = {
          allowedReactions: [PostReaction.THUMBS_UP, PostReaction.LAUGH],
          channelAcl,
          creator: "foo",
        } as IChannel;
        const channelPermission = new ChannelPermission(channel);

        const updates: IUpdateChannel = {
          allowedReactions: [PostReaction.THUMBS_UP],
        };

        expect(channelPermission.canUpdateProperties(user, updates)).toBe(true);
      });

      it("returns true if user has a role of manage and reaction is added", () => {
        const user = buildUser();
        const channelAcl = [
          { category: AclCategory.USER, key: user.username, role: Role.MANAGE },
        ] as IChannelAclPermission[];

        const channel = {
          allowedReactions: [PostReaction.THUMBS_UP],
          channelAcl,
          creator: "foo",
        } as IChannel;
        const channelPermission = new ChannelPermission(channel);

        const updates: IUpdateChannel = {
          allowedReactions: [PostReaction.THUMBS_UP, PostReaction.LAUGH],
        };

        expect(channelPermission.canUpdateProperties(user, updates)).toBe(true);
      });

      it("returns true if user has a role of owner", () => {
        const user = buildUser();
        const channelAcl = [
          { category: AclCategory.USER, key: user.username, role: Role.OWNER },
        ] as IChannelAclPermission[];

        const channel = {
          allowedReactions: [PostReaction.THUMBS_UP],
          channelAcl,
          creator: "foo",
        } as IChannel;
        const channelPermission = new ChannelPermission(channel);

        const updates: IUpdateChannel = {
          allowedReactions: [PostReaction.LAUGH],
        };

        expect(channelPermission.canUpdateProperties(user, updates)).toBe(true);
      });

      it("returns false if user does not have a minimum role of moderate", () => {
        const user = buildUser();
        const channelAcl = [
          {
            category: AclCategory.USER,
            key: user.username,
            role: Role.READWRITE,
          },
        ] as IChannelAclPermission[];

        const channel = {
          allowedReactions: [PostReaction.THUMBS_UP],
          channelAcl,
          creator: "foo",
        } as IChannel;
        const channelPermission = new ChannelPermission(channel);

        const updates: IUpdateChannel = {
          allowedReactions: [PostReaction.LAUGH],
        };

        expect(channelPermission.canUpdateProperties(user, updates)).toBe(
          false
        );
      });
    });

    describe("channelAclDefinition", () => {
      describe("No acl changes", () => {
        it("should return true if no acl changes, regardless of role", () => {
          const user = buildUser({ orgId: "aaa", groups: [] });
          const channelAcl = buildCompleteAcl();

          const channel = { channelAcl, creator: "foo" } as IChannel;
          const channelPermission = new ChannelPermission(channel);

          const updates: IUpdateChannel = {
            // TODO: remove ts-ignore when V2 interfaces are hoisted from service to hub.js
            // @ts-ignore
            channelAclDefinition: buildCompleteAcl(),
          };

          expect(channelPermission.canUpdateProperties(user, updates)).toBe(
            true
          );
        });

        it("should return true if no acl changes, just rearranged, regardless of role", () => {
          const user = buildUser({ orgId: "aaa", groups: [] });
          const channelAcl = [
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
              key: groupId1,
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
          ];

          const updatedAcl = [
            {
              category: AclCategory.GROUP,
              subCategory: AclSubCategory.MEMBER,
              key: groupId1,
              role: Role.READ,
            },
            { category: AclCategory.AUTHENTICATED_USER, role: Role.READ },
            {
              category: AclCategory.GROUP,
              subCategory: AclSubCategory.ADMIN,
              key: groupId1,
              role: Role.OWNER,
            },
            {
              category: AclCategory.ORG,
              subCategory: AclSubCategory.MEMBER,
              key: orgId1,
              role: Role.READ,
            },
            {
              category: AclCategory.ORG,
              subCategory: AclSubCategory.ADMIN,
              key: orgId1,
              role: Role.OWNER,
            },
            { category: AclCategory.ANONYMOUS_USER, role: Role.READ },
          ];

          const channel = { channelAcl, creator: "foo" } as IChannel;
          const channelPermission = new ChannelPermission(channel);

          const updates: IUpdateChannel = {
            // TODO: remove ts-ignore when V2 interfaces are hoisted from service to hub.js
            // @ts-ignore
            channelAclDefinition: updatedAcl,
          };

          expect(channelPermission.canUpdateProperties(user, updates)).toBe(
            true
          );
        });
      });

      describe("OWNER added or removed", () => {
        const allowedRoles = [Role.OWNER];
        const notAllowedRoles = [
          Role.READ,
          Role.WRITE,
          Role.READWRITE,
          Role.MODERATE,
          Role.MANAGE,
        ];

        allowedRoles.forEach((allowedRole) => {
          it(`should return true if user has role: ${allowedRole} and owner is removed`, () => {
            const user = buildUser();
            const channelAcl = [
              {
                category: AclCategory.USER,
                key: user.username,
                role: allowedRole, // allows change
              },
              { category: AclCategory.USER, key: "aaa", role: Role.OWNER }, // will be removed
            ] as IChannelAclPermission[];
            const updatedAcl = [
              {
                // no update
                category: AclCategory.USER,
                key: user.username,
                role: allowedRole,
              },
            ] as IChannelAclPermission[];

            const channel = { channelAcl, creator: "foo" } as IChannel;
            const channelPermission = new ChannelPermission(channel);

            const updates: IUpdateChannel = {
              // TODO: remove ts-ignore when V2 interfaces are hoisted from service to hub.js
              // @ts-ignore
              channelAclDefinition: updatedAcl,
            };

            expect(channelPermission.canUpdateProperties(user, updates)).toBe(
              true
            );
          });

          it(`should return true if user has role: ${allowedRole} and owner is added`, () => {
            const user = buildUser();
            const channelAcl = [
              {
                category: AclCategory.USER,
                key: user.username,
                role: allowedRole, // allows change
              },
            ] as IChannelAclPermission[];
            const updatedAcl = [
              {
                // no update
                category: AclCategory.USER,
                key: user.username,
                role: allowedRole,
              },
              { category: AclCategory.USER, key: "bbb", role: Role.OWNER }, // added
            ] as IChannelAclPermission[];

            const channel = { channelAcl, creator: "foo" } as IChannel;
            const channelPermission = new ChannelPermission(channel);

            const updates: IUpdateChannel = {
              // TODO: remove ts-ignore when V2 interfaces are hoisted from service to hub.js
              // @ts-ignore
              channelAclDefinition: updatedAcl,
            };

            expect(channelPermission.canUpdateProperties(user, updates)).toBe(
              true
            );
          });

          it(`should return true if user has role: ${allowedRole} and owner is added in another category`, () => {
            const user = buildUser();
            const channelAcl = [
              {
                category: AclCategory.USER,
                key: user.username,
                role: allowedRole, // allows change
              },
            ] as IChannelAclPermission[];
            const updatedAcl = [
              {
                // no update
                category: AclCategory.USER,
                key: user.username,
                role: allowedRole,
              },
              {
                // added
                category: AclCategory.GROUP,
                subCategory: AclSubCategory.ADMIN,
                key: "group_id",
                role: Role.OWNER,
              },
            ] as IChannelAclPermission[];

            const channel = { channelAcl, creator: "foo" } as IChannel;
            const channelPermission = new ChannelPermission(channel);

            const updates: IUpdateChannel = {
              // TODO: remove ts-ignore when V2 interfaces are hoisted from service to hub.js
              // @ts-ignore
              channelAclDefinition: updatedAcl,
            };

            expect(channelPermission.canUpdateProperties(user, updates)).toBe(
              true
            );
          });
        });

        notAllowedRoles.forEach((notAllowedRole) => {
          it(`should return false if user has role: ${notAllowedRole} and owner is removed`, () => {
            const user = buildUser();
            const channelAcl = [
              {
                category: AclCategory.USER,
                key: user.username,
                role: notAllowedRole, // DOES NOT ALLOW CHANGE
              },
              { category: AclCategory.USER, key: "aaa", role: Role.OWNER }, // will be removed
            ] as IChannelAclPermission[];
            const updatedAcl = [
              {
                // no update
                category: AclCategory.USER,
                key: user.username,
                role: notAllowedRole,
              },
            ] as IChannelAclPermission[];

            const channel = { channelAcl, creator: "foo" } as IChannel;
            const channelPermission = new ChannelPermission(channel);

            const updates: IUpdateChannel = {
              // TODO: remove ts-ignore when V2 interfaces are hoisted from service to hub.js
              // @ts-ignore
              channelAclDefinition: updatedAcl,
            };

            expect(channelPermission.canUpdateProperties(user, updates)).toBe(
              false
            );
          });

          it(`should return false if user has role: ${notAllowedRole} and owner is added`, () => {
            const user = buildUser();
            const channelAcl = [
              {
                category: AclCategory.USER,
                key: user.username,
                role: notAllowedRole, // DOES NOT ALLOW CHANGE
              },
            ] as IChannelAclPermission[];
            const updatedAcl = [
              {
                // no update
                category: AclCategory.USER,
                key: user.username,
                role: notAllowedRole,
              },
              { category: AclCategory.USER, key: "bbb", role: Role.OWNER }, // added
            ] as IChannelAclPermission[];

            const channel = { channelAcl, creator: "foo" } as IChannel;
            const channelPermission = new ChannelPermission(channel);

            const updates: IUpdateChannel = {
              // TODO: remove ts-ignore when V2 interfaces are hoisted from service to hub.js
              // @ts-ignore
              channelAclDefinition: updatedAcl,
            };

            expect(channelPermission.canUpdateProperties(user, updates)).toBe(
              false
            );
          });
        });
      });

      describe("MANAGER added or removed", () => {
        const allowedRoles = [Role.OWNER, Role.MANAGE];
        const notAllowedRoles = [
          Role.READ,
          Role.WRITE,
          Role.READWRITE,
          Role.MODERATE,
        ];

        allowedRoles.forEach((allowedRole) => {
          it(`should return true if user has role: ${allowedRole} and manager is removed`, () => {
            const user = buildUser();
            const channelAcl = [
              {
                category: AclCategory.USER,
                key: user.username,
                role: allowedRole, // allows change
              },
              { category: AclCategory.USER, key: "aaa", role: Role.MANAGE }, // will be removed
            ] as IChannelAclPermission[];
            const updatedAcl = [
              {
                // no update
                category: AclCategory.USER,
                key: user.username,
                role: allowedRole,
              },
            ] as IChannelAclPermission[];

            const channel = { channelAcl, creator: "foo" } as IChannel;
            const channelPermission = new ChannelPermission(channel);

            const updates: IUpdateChannel = {
              // TODO: remove ts-ignore when V2 interfaces are hoisted from service to hub.js
              // @ts-ignore
              channelAclDefinition: updatedAcl,
            };

            expect(channelPermission.canUpdateProperties(user, updates)).toBe(
              true
            );
          });

          it(`should return true if user has role: ${allowedRole} and manager is added`, () => {
            const user = buildUser();
            const channelAcl = [
              {
                category: AclCategory.USER,
                key: user.username,
                role: allowedRole, // allows change
              },
            ] as IChannelAclPermission[];
            const updatedAcl = [
              {
                // no update
                category: AclCategory.USER,
                key: user.username,
                role: allowedRole,
              },
              { category: AclCategory.USER, key: "bbb", role: Role.MANAGE }, // added
            ] as IChannelAclPermission[];

            const channel = { channelAcl, creator: "foo" } as IChannel;
            const channelPermission = new ChannelPermission(channel);

            const updates: IUpdateChannel = {
              // TODO: remove ts-ignore when V2 interfaces are hoisted from service to hub.js
              // @ts-ignore
              channelAclDefinition: updatedAcl,
            };

            expect(channelPermission.canUpdateProperties(user, updates)).toBe(
              true
            );
          });

          it(`should return true if user has role: ${allowedRole} and manager is added in another category`, () => {
            const user = buildUser();
            const channelAcl = [
              {
                category: AclCategory.USER,
                key: user.username,
                role: allowedRole, // allows change
              },
            ] as IChannelAclPermission[];
            const updatedAcl = [
              {
                // no update
                category: AclCategory.USER,
                key: user.username,
                role: allowedRole,
              },
              {
                // added
                category: AclCategory.GROUP,
                subCategory: AclSubCategory.ADMIN,
                key: "group_id",
                role: Role.MANAGE,
              },
            ] as IChannelAclPermission[];

            const channel = { channelAcl, creator: "foo" } as IChannel;
            const channelPermission = new ChannelPermission(channel);

            const updates: IUpdateChannel = {
              // TODO: remove ts-ignore when V2 interfaces are hoisted from service to hub.js
              // @ts-ignore
              channelAclDefinition: updatedAcl,
            };

            expect(channelPermission.canUpdateProperties(user, updates)).toBe(
              true
            );
          });
        });

        notAllowedRoles.forEach((notAllowedRole) => {
          it(`should return false if user has role: ${notAllowedRole} and manager is removed`, () => {
            const user = buildUser();
            const channelAcl = [
              {
                category: AclCategory.USER,
                key: user.username,
                role: notAllowedRole, // DOES NOT ALLOW CHANGE
              },
              { category: AclCategory.USER, key: "aaa", role: Role.MANAGE }, // will be removed
            ] as IChannelAclPermission[];
            const updatedAcl = [
              {
                // no update
                category: AclCategory.USER,
                key: user.username,
                role: notAllowedRole,
              },
            ] as IChannelAclPermission[];

            const channel = { channelAcl, creator: "foo" } as IChannel;
            const channelPermission = new ChannelPermission(channel);

            const updates: IUpdateChannel = {
              // TODO: remove ts-ignore when V2 interfaces are hoisted from service to hub.js
              // @ts-ignore
              channelAclDefinition: updatedAcl,
            };

            expect(channelPermission.canUpdateProperties(user, updates)).toBe(
              false
            );
          });

          it(`should return false if user has role: ${notAllowedRole} and manager is added`, () => {
            const user = buildUser();
            const channelAcl = [
              {
                category: AclCategory.USER,
                key: user.username,
                role: notAllowedRole, // DOES NOT ALLOW CHANGE
              },
            ] as IChannelAclPermission[];
            const updatedAcl = [
              {
                // no update
                category: AclCategory.USER,
                key: user.username,
                role: notAllowedRole,
              },
              { category: AclCategory.USER, key: "bbb", role: Role.MANAGE }, // added
            ] as IChannelAclPermission[];

            const channel = { channelAcl, creator: "foo" } as IChannel;
            const channelPermission = new ChannelPermission(channel);

            const updates: IUpdateChannel = {
              // TODO: remove ts-ignore when V2 interfaces are hoisted from service to hub.js
              // @ts-ignore
              channelAclDefinition: updatedAcl,
            };

            expect(channelPermission.canUpdateProperties(user, updates)).toBe(
              false
            );
          });
        });
      });

      describe("MODERATOR added or removed", () => {
        const allowedRoles = [Role.OWNER, Role.MANAGE];
        const notAllowedRoles = [
          Role.READ,
          Role.WRITE,
          Role.READWRITE,
          Role.MODERATE,
        ];

        allowedRoles.forEach((allowedRole) => {
          it(`should return true if user has role: ${allowedRole} and moderator is removed`, () => {
            const user = buildUser();
            const channelAcl = [
              {
                category: AclCategory.USER,
                key: user.username,
                role: allowedRole, // allows change
              },
              { category: AclCategory.USER, key: "aaa", role: Role.MODERATE }, // will be removed
            ] as IChannelAclPermission[];
            const updatedAcl = [
              {
                // no update
                category: AclCategory.USER,
                key: user.username,
                role: allowedRole,
              },
            ] as IChannelAclPermission[];

            const channel = { channelAcl, creator: "foo" } as IChannel;
            const channelPermission = new ChannelPermission(channel);

            const updates: IUpdateChannel = {
              // TODO: remove ts-ignore when V2 interfaces are hoisted from service to hub.js
              // @ts-ignore
              channelAclDefinition: updatedAcl,
            };

            expect(channelPermission.canUpdateProperties(user, updates)).toBe(
              true
            );
          });

          it(`should return true if user has role: ${allowedRole} and moderator is added`, () => {
            const user = buildUser();
            const channelAcl = [
              {
                category: AclCategory.USER,
                key: user.username,
                role: allowedRole, // allows change
              },
            ] as IChannelAclPermission[];
            const updatedAcl = [
              {
                // no update
                category: AclCategory.USER,
                key: user.username,
                role: allowedRole,
              },
              { category: AclCategory.USER, key: "bbb", role: Role.MODERATE }, // added
            ] as IChannelAclPermission[];

            const channel = { channelAcl, creator: "foo" } as IChannel;
            const channelPermission = new ChannelPermission(channel);

            const updates: IUpdateChannel = {
              // TODO: remove ts-ignore when V2 interfaces are hoisted from service to hub.js
              // @ts-ignore
              channelAclDefinition: updatedAcl,
            };

            expect(channelPermission.canUpdateProperties(user, updates)).toBe(
              true
            );
          });

          it(`should return true if user has role: ${allowedRole} and moderator is added in another category`, () => {
            const user = buildUser();
            const channelAcl = [
              {
                category: AclCategory.USER,
                key: user.username,
                role: allowedRole, // allows change
              },
            ] as IChannelAclPermission[];
            const updatedAcl = [
              {
                // no update
                category: AclCategory.USER,
                key: user.username,
                role: allowedRole,
              },
              {
                // added
                category: AclCategory.GROUP,
                subCategory: AclSubCategory.ADMIN,
                key: "group_id",
                role: Role.MODERATE,
              },
            ] as IChannelAclPermission[];

            const channel = { channelAcl, creator: "foo" } as IChannel;
            const channelPermission = new ChannelPermission(channel);

            const updates: IUpdateChannel = {
              // TODO: remove ts-ignore when V2 interfaces are hoisted from service to hub.js
              // @ts-ignore
              channelAclDefinition: updatedAcl,
            };

            expect(channelPermission.canUpdateProperties(user, updates)).toBe(
              true
            );
          });
        });

        notAllowedRoles.forEach((notAllowedRole) => {
          it(`should return false if user has role: ${notAllowedRole} and moderator is removed`, () => {
            const user = buildUser();
            const channelAcl = [
              {
                category: AclCategory.USER,
                key: user.username,
                role: notAllowedRole, // DOES NOT ALLOW CHANGE
              },
              { category: AclCategory.USER, key: "aaa", role: Role.MODERATE }, // will be removed
            ] as IChannelAclPermission[];
            const updatedAcl = [
              {
                // no update
                category: AclCategory.USER,
                key: user.username,
                role: notAllowedRole,
              },
            ] as IChannelAclPermission[];

            const channel = { channelAcl, creator: "foo" } as IChannel;
            const channelPermission = new ChannelPermission(channel);

            const updates: IUpdateChannel = {
              // TODO: remove ts-ignore when V2 interfaces are hoisted from service to hub.js
              // @ts-ignore
              channelAclDefinition: updatedAcl,
            };

            expect(channelPermission.canUpdateProperties(user, updates)).toBe(
              false
            );
          });

          it(`should return false if user has role: ${notAllowedRole} and moderator is added`, () => {
            const user = buildUser();
            const channelAcl = [
              {
                category: AclCategory.USER,
                key: user.username,
                role: notAllowedRole, // DOES NOT ALLOW CHANGE
              },
            ] as IChannelAclPermission[];
            const updatedAcl = [
              {
                // no update
                category: AclCategory.USER,
                key: user.username,
                role: notAllowedRole,
              },
              { category: AclCategory.USER, key: "bbb", role: Role.MODERATE }, // added
            ] as IChannelAclPermission[];

            const channel = { channelAcl, creator: "foo" } as IChannel;
            const channelPermission = new ChannelPermission(channel);

            const updates: IUpdateChannel = {
              // TODO: remove ts-ignore when V2 interfaces are hoisted from service to hub.js
              // @ts-ignore
              channelAclDefinition: updatedAcl,
            };

            expect(channelPermission.canUpdateProperties(user, updates)).toBe(
              false
            );
          });
        });
      });

      describe("ORG added or removed or updated", () => {
        const allowedRoles = [Role.OWNER, Role.MANAGE];
        const notAllowedRoles = [
          Role.READ,
          Role.WRITE,
          Role.READWRITE,
          Role.MODERATE,
        ];

        allowedRoles.forEach((allowedRole) => {
          it(`should return true if user has role: ${allowedRole} and org is removed`, () => {
            const user = buildUser();
            const channelAcl = [
              {
                category: AclCategory.USER,
                key: user.username,
                role: allowedRole, // allows change
              },
              {
                // will be removed
                category: AclCategory.ORG,
                subCategory: AclSubCategory.ADMIN,
                key: "aaa",
                role: Role.MODERATE,
              },
              {
                // will be removed
                category: AclCategory.ORG,
                subCategory: AclSubCategory.MEMBER,
                key: "aaa",
                role: Role.READ,
              },
            ] as IChannelAclPermission[];
            const updatedAcl = [
              {
                // no update
                category: AclCategory.USER,
                key: user.username,
                role: allowedRole,
              },
            ] as IChannelAclPermission[];

            const channel = { channelAcl, creator: "foo" } as IChannel;
            const channelPermission = new ChannelPermission(channel);

            const updates: IUpdateChannel = {
              // TODO: remove ts-ignore when V2 interfaces are hoisted from service to hub.js
              // @ts-ignore
              channelAclDefinition: updatedAcl,
            };

            expect(channelPermission.canUpdateProperties(user, updates)).toBe(
              true
            );
          });

          it(`should return true if user has role: ${allowedRole} and org is added`, () => {
            const user = buildUser();
            const channelAcl = [
              {
                category: AclCategory.USER,
                key: user.username,
                role: allowedRole, // allows change
              },
              {
                category: AclCategory.ORG,
                subCategory: AclSubCategory.ADMIN,
                key: "aaa",
                role: Role.MODERATE,
              },
              {
                category: AclCategory.ORG,
                subCategory: AclSubCategory.MEMBER,
                key: "aaa",
                role: Role.READ,
              },
            ] as IChannelAclPermission[];
            const updatedAcl = [
              {
                // no update
                category: AclCategory.USER,
                key: user.username,
                role: allowedRole,
              },
              {
                // no update
                category: AclCategory.ORG,
                subCategory: AclSubCategory.ADMIN,
                key: "aaa",
                role: Role.MODERATE,
              },
              {
                // no update
                category: AclCategory.ORG,
                subCategory: AclSubCategory.MEMBER,
                key: "aaa",
                role: Role.READ,
              },
              {
                // added
                category: AclCategory.ORG,
                subCategory: AclSubCategory.ADMIN,
                key: "bbb",
                role: Role.MODERATE,
              },
            ] as IChannelAclPermission[];

            const channel = { channelAcl, creator: "foo" } as IChannel;
            const channelPermission = new ChannelPermission(channel);

            const updates: IUpdateChannel = {
              // TODO: remove ts-ignore when V2 interfaces are hoisted from service to hub.js
              // @ts-ignore
              channelAclDefinition: updatedAcl,
            };

            expect(channelPermission.canUpdateProperties(user, updates)).toBe(
              true
            );
          });

          it(`should return true if user has role: ${allowedRole} and org role is updated`, () => {
            const user = buildUser();
            const channelAcl = [
              {
                category: AclCategory.USER,
                key: user.username,
                role: allowedRole, // allows change
              },
              {
                category: AclCategory.ORG,
                subCategory: AclSubCategory.ADMIN,
                key: "aaa",
                role: Role.MODERATE,
              },
              {
                category: AclCategory.ORG,
                subCategory: AclSubCategory.MEMBER,
                key: "aaa",
                role: Role.READ,
              },
            ] as IChannelAclPermission[];
            const updatedAcl = [
              {
                // no update
                category: AclCategory.USER,
                key: user.username,
                role: allowedRole,
              },
              {
                // no update
                category: AclCategory.ORG,
                subCategory: AclSubCategory.ADMIN,
                key: "aaa",
                role: Role.MODERATE,
              },
              {
                category: AclCategory.ORG,
                subCategory: AclSubCategory.MEMBER,
                key: "aaa",
                role: Role.READWRITE, // role changed
              },
            ] as IChannelAclPermission[];

            const channel = { channelAcl, creator: "foo" } as IChannel;
            const channelPermission = new ChannelPermission(channel);

            const updates: IUpdateChannel = {
              // TODO: remove ts-ignore when V2 interfaces are hoisted from service to hub.js
              // @ts-ignore
              channelAclDefinition: updatedAcl,
            };

            expect(channelPermission.canUpdateProperties(user, updates)).toBe(
              true
            );
          });
        });

        notAllowedRoles.forEach((notAllowedRole) => {
          it(`should return false if user has role: ${notAllowedRole} and org is removed`, () => {
            const user = buildUser();
            const channelAcl = [
              {
                category: AclCategory.USER,
                key: user.username,
                role: notAllowedRole, // DOES NOT ALLOW CHANGE
              },
              {
                // will be removed
                category: AclCategory.ORG,
                subCategory: AclSubCategory.ADMIN,
                key: "aaa",
                role: Role.MODERATE,
              },
              {
                // will be removed
                category: AclCategory.ORG,
                subCategory: AclSubCategory.MEMBER,
                key: "aaa",
                role: Role.READ,
              },
            ] as IChannelAclPermission[];
            const updatedAcl = [
              {
                // no update
                category: AclCategory.USER,
                key: user.username,
                role: notAllowedRole,
              },
            ] as IChannelAclPermission[];

            const channel = { channelAcl, creator: "foo" } as IChannel;
            const channelPermission = new ChannelPermission(channel);

            const updates: IUpdateChannel = {
              // TODO: remove ts-ignore when V2 interfaces are hoisted from service to hub.js
              // @ts-ignore
              channelAclDefinition: updatedAcl,
            };

            expect(channelPermission.canUpdateProperties(user, updates)).toBe(
              false
            );
          });

          it(`should return false if user has role: ${notAllowedRole} and org is added`, () => {
            const user = buildUser();
            const channelAcl = [
              {
                category: AclCategory.USER,
                key: user.username,
                role: notAllowedRole, // DOES NOT ALLOW CHANGE
              },
              {
                category: AclCategory.ORG,
                subCategory: AclSubCategory.ADMIN,
                key: "aaa",
                role: Role.MODERATE,
              },
              {
                category: AclCategory.ORG,
                subCategory: AclSubCategory.MEMBER,
                key: "aaa",
                role: Role.READ,
              },
            ] as IChannelAclPermission[];
            const updatedAcl = [
              {
                // no update
                category: AclCategory.USER,
                key: user.username,
                role: notAllowedRole,
              },
              {
                // no update
                category: AclCategory.ORG,
                subCategory: AclSubCategory.ADMIN,
                key: "aaa",
                role: Role.MODERATE,
              },
              {
                // no update
                category: AclCategory.ORG,
                subCategory: AclSubCategory.MEMBER,
                key: "aaa",
                role: Role.READ,
              },
              {
                // added
                category: AclCategory.ORG,
                subCategory: AclSubCategory.ADMIN,
                key: "bbb",
                role: Role.MODERATE,
              },
            ] as IChannelAclPermission[];

            const channel = { channelAcl, creator: "foo" } as IChannel;
            const channelPermission = new ChannelPermission(channel);

            const updates: IUpdateChannel = {
              // TODO: remove ts-ignore when V2 interfaces are hoisted from service to hub.js
              // @ts-ignore
              channelAclDefinition: updatedAcl,
            };

            expect(channelPermission.canUpdateProperties(user, updates)).toBe(
              false
            );
          });

          it(`should return false if user has role: ${notAllowedRole} and org role is updated`, () => {
            const user = buildUser();
            const channelAcl = [
              {
                category: AclCategory.USER,
                key: user.username,
                role: notAllowedRole, // DOES NOT ALLOW CHANGE
              },
              {
                category: AclCategory.ORG,
                subCategory: AclSubCategory.ADMIN,
                key: "aaa",
                role: Role.MODERATE,
              },
              {
                category: AclCategory.ORG,
                subCategory: AclSubCategory.MEMBER,
                key: "aaa",
                role: Role.READ,
              },
            ] as IChannelAclPermission[];
            const updatedAcl = [
              {
                // no update
                category: AclCategory.USER,
                key: user.username,
                role: notAllowedRole,
              },
              {
                // no update
                category: AclCategory.ORG,
                subCategory: AclSubCategory.ADMIN,
                key: "aaa",
                role: Role.MODERATE,
              },
              {
                category: AclCategory.ORG,
                subCategory: AclSubCategory.MEMBER,
                key: "aaa",
                role: Role.READWRITE, // role changed
              },
            ] as IChannelAclPermission[];

            const channel = { channelAcl, creator: "foo" } as IChannel;
            const channelPermission = new ChannelPermission(channel);

            const updates: IUpdateChannel = {
              // TODO: remove ts-ignore when V2 interfaces are hoisted from service to hub.js
              // @ts-ignore
              channelAclDefinition: updatedAcl,
            };

            expect(channelPermission.canUpdateProperties(user, updates)).toBe(
              false
            );
          });
        });
      });

      describe("GROUP added or removed or updated", () => {
        const allowedRoles = [Role.OWNER, Role.MANAGE];
        const notAllowedRoles = [
          Role.READ,
          Role.WRITE,
          Role.READWRITE,
          Role.MODERATE,
        ];

        allowedRoles.forEach((allowedRole) => {
          it(`should return true if user has role: ${allowedRole} and group is removed`, () => {
            const user = buildUser();
            const channelAcl = [
              {
                category: AclCategory.USER,
                key: user.username,
                role: allowedRole, // allows change
              },
              {
                // will be removed
                category: AclCategory.GROUP,
                subCategory: AclSubCategory.ADMIN,
                key: "aaa",
                role: Role.MODERATE,
              },
              {
                // will be removed
                category: AclCategory.GROUP,
                subCategory: AclSubCategory.MEMBER,
                key: "aaa",
                role: Role.READ,
              },
            ] as IChannelAclPermission[];
            const updatedAcl = [
              {
                // no update
                category: AclCategory.USER,
                key: user.username,
                role: allowedRole,
              },
            ] as IChannelAclPermission[];

            const channel = { channelAcl, creator: "foo" } as IChannel;
            const channelPermission = new ChannelPermission(channel);

            const updates: IUpdateChannel = {
              // TODO: remove ts-ignore when V2 interfaces are hoisted from service to hub.js
              // @ts-ignore
              channelAclDefinition: updatedAcl,
            };

            expect(channelPermission.canUpdateProperties(user, updates)).toBe(
              true
            );
          });

          it(`should return true if user has role: ${allowedRole} and GROUP is added`, () => {
            const user = buildUser();
            const channelAcl = [
              {
                category: AclCategory.USER,
                key: user.username,
                role: allowedRole, // allows change
              },
              {
                category: AclCategory.GROUP,
                subCategory: AclSubCategory.ADMIN,
                key: "aaa",
                role: Role.MODERATE,
              },
              {
                category: AclCategory.GROUP,
                subCategory: AclSubCategory.MEMBER,
                key: "aaa",
                role: Role.READ,
              },
            ] as IChannelAclPermission[];
            const updatedAcl = [
              {
                // no update
                category: AclCategory.USER,
                key: user.username,
                role: allowedRole,
              },
              {
                // no update
                category: AclCategory.GROUP,
                subCategory: AclSubCategory.ADMIN,
                key: "aaa",
                role: Role.MODERATE,
              },
              {
                // no update
                category: AclCategory.GROUP,
                subCategory: AclSubCategory.MEMBER,
                key: "aaa",
                role: Role.READ,
              },
              {
                // added
                category: AclCategory.GROUP,
                subCategory: AclSubCategory.ADMIN,
                key: "bbb",
                role: Role.MODERATE,
              },
            ] as IChannelAclPermission[];

            const channel = { channelAcl, creator: "foo" } as IChannel;
            const channelPermission = new ChannelPermission(channel);

            const updates: IUpdateChannel = {
              // TODO: remove ts-ignore when V2 interfaces are hoisted from service to hub.js
              // @ts-ignore
              channelAclDefinition: updatedAcl,
            };

            expect(channelPermission.canUpdateProperties(user, updates)).toBe(
              true
            );
          });

          it(`should return true if user has role: ${allowedRole} and GROUP role is updated`, () => {
            const user = buildUser();
            const channelAcl = [
              {
                category: AclCategory.USER,
                key: user.username,
                role: allowedRole, // allows change
              },
              {
                category: AclCategory.GROUP,
                subCategory: AclSubCategory.ADMIN,
                key: "aaa",
                role: Role.MODERATE,
              },
              {
                category: AclCategory.GROUP,
                subCategory: AclSubCategory.MEMBER,
                key: "aaa",
                role: Role.READ,
              },
            ] as IChannelAclPermission[];
            const updatedAcl = [
              {
                // no update
                category: AclCategory.USER,
                key: user.username,
                role: allowedRole,
              },
              {
                // no update
                category: AclCategory.GROUP,
                subCategory: AclSubCategory.ADMIN,
                key: "aaa",
                role: Role.MODERATE,
              },
              {
                category: AclCategory.GROUP,
                subCategory: AclSubCategory.MEMBER,
                key: "aaa",
                role: Role.READWRITE, // role changed
              },
            ] as IChannelAclPermission[];

            const channel = { channelAcl, creator: "foo" } as IChannel;
            const channelPermission = new ChannelPermission(channel);

            const updates: IUpdateChannel = {
              // TODO: remove ts-ignore when V2 interfaces are hoisted from service to hub.js
              // @ts-ignore
              channelAclDefinition: updatedAcl,
            };

            expect(channelPermission.canUpdateProperties(user, updates)).toBe(
              true
            );
          });
        });

        notAllowedRoles.forEach((notAllowedRole) => {
          it(`should return false if user has role: ${notAllowedRole} and GROUP is removed`, () => {
            const user = buildUser();
            const channelAcl = [
              {
                category: AclCategory.USER,
                key: user.username,
                role: notAllowedRole, // DOES NOT ALLOW CHANGE
              },
              {
                // will be removed
                category: AclCategory.GROUP,
                subCategory: AclSubCategory.ADMIN,
                key: "aaa",
                role: Role.MODERATE,
              },
              {
                // will be removed
                category: AclCategory.GROUP,
                subCategory: AclSubCategory.MEMBER,
                key: "aaa",
                role: Role.READ,
              },
            ] as IChannelAclPermission[];
            const updatedAcl = [
              {
                // no update
                category: AclCategory.USER,
                key: user.username,
                role: notAllowedRole,
              },
            ] as IChannelAclPermission[];

            const channel = { channelAcl, creator: "foo" } as IChannel;
            const channelPermission = new ChannelPermission(channel);

            const updates: IUpdateChannel = {
              // TODO: remove ts-ignore when V2 interfaces are hoisted from service to hub.js
              // @ts-ignore
              channelAclDefinition: updatedAcl,
            };

            expect(channelPermission.canUpdateProperties(user, updates)).toBe(
              false
            );
          });

          it(`should return false if user has role: ${notAllowedRole} and GROUP is added`, () => {
            const user = buildUser();
            const channelAcl = [
              {
                category: AclCategory.USER,
                key: user.username,
                role: notAllowedRole, // DOES NOT ALLOW CHANGE
              },
              {
                category: AclCategory.GROUP,
                subCategory: AclSubCategory.ADMIN,
                key: "aaa",
                role: Role.MODERATE,
              },
              {
                category: AclCategory.GROUP,
                subCategory: AclSubCategory.MEMBER,
                key: "aaa",
                role: Role.READ,
              },
            ] as IChannelAclPermission[];
            const updatedAcl = [
              {
                // no update
                category: AclCategory.USER,
                key: user.username,
                role: notAllowedRole,
              },
              {
                // no update
                category: AclCategory.GROUP,
                subCategory: AclSubCategory.ADMIN,
                key: "aaa",
                role: Role.MODERATE,
              },
              {
                // no update
                category: AclCategory.GROUP,
                subCategory: AclSubCategory.MEMBER,
                key: "aaa",
                role: Role.READ,
              },
              {
                // added
                category: AclCategory.GROUP,
                subCategory: AclSubCategory.ADMIN,
                key: "bbb",
                role: Role.MODERATE,
              },
            ] as IChannelAclPermission[];

            const channel = { channelAcl, creator: "foo" } as IChannel;
            const channelPermission = new ChannelPermission(channel);

            const updates: IUpdateChannel = {
              // TODO: remove ts-ignore when V2 interfaces are hoisted from service to hub.js
              // @ts-ignore
              channelAclDefinition: updatedAcl,
            };

            expect(channelPermission.canUpdateProperties(user, updates)).toBe(
              false
            );
          });

          it(`should return false if user has role: ${notAllowedRole} and GROUP role is updated`, () => {
            const user = buildUser();
            const channelAcl = [
              {
                category: AclCategory.USER,
                key: user.username,
                role: notAllowedRole, // DOES NOT ALLOW CHANGE
              },
              {
                category: AclCategory.GROUP,
                subCategory: AclSubCategory.ADMIN,
                key: "aaa",
                role: Role.MODERATE,
              },
              {
                category: AclCategory.GROUP,
                subCategory: AclSubCategory.MEMBER,
                key: "aaa",
                role: Role.READ,
              },
            ] as IChannelAclPermission[];
            const updatedAcl = [
              {
                // no update
                category: AclCategory.USER,
                key: user.username,
                role: notAllowedRole,
              },
              {
                // no update
                category: AclCategory.GROUP,
                subCategory: AclSubCategory.ADMIN,
                key: "aaa",
                role: Role.MODERATE,
              },
              {
                category: AclCategory.GROUP,
                subCategory: AclSubCategory.MEMBER,
                key: "aaa",
                role: Role.READWRITE, // role changed
              },
            ] as IChannelAclPermission[];

            const channel = { channelAcl, creator: "foo" } as IChannel;
            const channelPermission = new ChannelPermission(channel);

            const updates: IUpdateChannel = {
              // TODO: remove ts-ignore when V2 interfaces are hoisted from service to hub.js
              // @ts-ignore
              channelAclDefinition: updatedAcl,
            };

            expect(channelPermission.canUpdateProperties(user, updates)).toBe(
              false
            );
          });
        });
      });

      describe("USER added or removed or updated", () => {
        const allowedRoles = [Role.OWNER, Role.MANAGE];
        const notAllowedRoles = [
          Role.READ,
          Role.WRITE,
          Role.READWRITE,
          Role.MODERATE,
        ];

        allowedRoles.forEach((allowedRole) => {
          it(`should return true if user has role: ${allowedRole} and USER is removed`, () => {
            const user = buildUser();
            const channelAcl = [
              {
                category: AclCategory.USER,
                key: user.username,
                role: allowedRole, // allows change
              },
              { category: AclCategory.USER, key: "aaa", role: Role.READ }, // will be removed
            ] as IChannelAclPermission[];
            const updatedAcl = [
              {
                // no update
                category: AclCategory.USER,
                key: user.username,
                role: allowedRole,
              },
            ] as IChannelAclPermission[];

            const channel = { channelAcl, creator: "foo" } as IChannel;
            const channelPermission = new ChannelPermission(channel);

            const updates: IUpdateChannel = {
              // TODO: remove ts-ignore when V2 interfaces are hoisted from service to hub.js
              // @ts-ignore
              channelAclDefinition: updatedAcl,
            };

            expect(channelPermission.canUpdateProperties(user, updates)).toBe(
              true
            );
          });

          it(`should return true if user has role: ${allowedRole} and USER is added`, () => {
            const user = buildUser();
            const channelAcl = [
              {
                category: AclCategory.USER,
                key: user.username,
                role: allowedRole, // allows change
              },
            ] as IChannelAclPermission[];
            const updatedAcl = [
              {
                // no update
                category: AclCategory.USER,
                key: user.username,
                role: allowedRole,
              },
              { category: AclCategory.USER, key: "aaa", role: Role.READ }, // added
            ] as IChannelAclPermission[];

            const channel = { channelAcl, creator: "foo" } as IChannel;
            const channelPermission = new ChannelPermission(channel);

            const updates: IUpdateChannel = {
              // TODO: remove ts-ignore when V2 interfaces are hoisted from service to hub.js
              // @ts-ignore
              channelAclDefinition: updatedAcl,
            };

            expect(channelPermission.canUpdateProperties(user, updates)).toBe(
              true
            );
          });

          it(`should return true if user has role: ${allowedRole} and USER role is updated`, () => {
            const user = buildUser();
            const channelAcl = [
              {
                category: AclCategory.USER,
                key: user.username,
                role: allowedRole, // allows change
              },
              { category: AclCategory.USER, key: "aaa", role: Role.READ }, // existing
            ] as IChannelAclPermission[];
            const updatedAcl = [
              {
                // no update
                category: AclCategory.USER,
                key: user.username,
                role: allowedRole,
              },
              { category: AclCategory.USER, key: "aaa", role: Role.READWRITE }, // role changed
            ] as IChannelAclPermission[];

            const channel = { channelAcl, creator: "foo" } as IChannel;
            const channelPermission = new ChannelPermission(channel);

            const updates: IUpdateChannel = {
              // TODO: remove ts-ignore when V2 interfaces are hoisted from service to hub.js
              // @ts-ignore
              channelAclDefinition: updatedAcl,
            };

            expect(channelPermission.canUpdateProperties(user, updates)).toBe(
              true
            );
          });
        });

        notAllowedRoles.forEach((notAllowedRole) => {
          it(`should return false if user has role: ${notAllowedRole} and USER is removed`, () => {
            const user = buildUser();
            const channelAcl = [
              {
                category: AclCategory.USER,
                key: user.username,
                role: notAllowedRole, // DOES NOT ALLOW CHANGE
              },
              { category: AclCategory.USER, key: "aaa", role: Role.READ }, // will be removed
            ] as IChannelAclPermission[];
            const updatedAcl = [
              {
                // no update
                category: AclCategory.USER,
                key: user.username,
                role: notAllowedRole,
              },
            ] as IChannelAclPermission[];

            const channel = { channelAcl, creator: "foo" } as IChannel;
            const channelPermission = new ChannelPermission(channel);

            const updates: IUpdateChannel = {
              // TODO: remove ts-ignore when V2 interfaces are hoisted from service to hub.js
              // @ts-ignore
              channelAclDefinition: updatedAcl,
            };

            expect(channelPermission.canUpdateProperties(user, updates)).toBe(
              false
            );
          });

          it(`should return false if user has role: ${notAllowedRole} and USER is added`, () => {
            const user = buildUser();
            const channelAcl = [
              {
                category: AclCategory.USER,
                key: user.username,
                role: notAllowedRole, // DOES NOT ALLOW CHANGE
              },
            ] as IChannelAclPermission[];
            const updatedAcl = [
              {
                // no update
                category: AclCategory.USER,
                key: user.username,
                role: notAllowedRole,
              },
              { category: AclCategory.USER, key: "aaa", role: Role.READ }, // added
            ] as IChannelAclPermission[];

            const channel = { channelAcl, creator: "foo" } as IChannel;
            const channelPermission = new ChannelPermission(channel);

            const updates: IUpdateChannel = {
              // TODO: remove ts-ignore when V2 interfaces are hoisted from service to hub.js
              // @ts-ignore
              channelAclDefinition: updatedAcl,
            };

            expect(channelPermission.canUpdateProperties(user, updates)).toBe(
              false
            );
          });

          it(`should return false if user has role: ${notAllowedRole} and USER role is updated`, () => {
            const user = buildUser();
            const channelAcl = [
              {
                category: AclCategory.USER,
                key: user.username,
                role: notAllowedRole, // DOES NOT ALLOW CHANGE
              },
              { category: AclCategory.USER, key: "aaa", role: Role.READ }, // existing
            ] as IChannelAclPermission[];
            const updatedAcl = [
              {
                // no update
                category: AclCategory.USER,
                key: user.username,
                role: notAllowedRole,
              },
              { category: AclCategory.USER, key: "aaa", role: Role.READWRITE }, // role changed
            ] as IChannelAclPermission[];

            const channel = { channelAcl, creator: "foo" } as IChannel;
            const channelPermission = new ChannelPermission(channel);

            const updates: IUpdateChannel = {
              // TODO: remove ts-ignore when V2 interfaces are hoisted from service to hub.js
              // @ts-ignore
              channelAclDefinition: updatedAcl,
            };

            expect(channelPermission.canUpdateProperties(user, updates)).toBe(
              false
            );
          });
        });
      });

      describe("AUTHENTICATED_USER added or removed or updated", () => {
        const allowedRoles = [Role.OWNER, Role.MANAGE];
        const notAllowedRoles = [
          Role.READ,
          Role.WRITE,
          Role.READWRITE,
          Role.MODERATE,
        ];

        allowedRoles.forEach((allowedRole) => {
          it(`should return true if user has role: ${allowedRole} and AUTHENTICATED_USER is removed`, () => {
            const user = buildUser();
            const channelAcl = [
              {
                category: AclCategory.USER,
                key: user.username,
                role: allowedRole, // allows change
              },
              { category: AclCategory.AUTHENTICATED_USER, role: Role.READ }, // will be removed
            ] as IChannelAclPermission[];
            const updatedAcl = [
              {
                // no update
                category: AclCategory.USER,
                key: user.username,
                role: allowedRole,
              },
            ] as IChannelAclPermission[];

            const channel = { channelAcl, creator: "foo" } as IChannel;
            const channelPermission = new ChannelPermission(channel);

            const updates: IUpdateChannel = {
              // TODO: remove ts-ignore when V2 interfaces are hoisted from service to hub.js
              // @ts-ignore
              channelAclDefinition: updatedAcl,
            };

            expect(channelPermission.canUpdateProperties(user, updates)).toBe(
              true
            );
          });

          it(`should return true if user has role: ${allowedRole} and AUTHENTICATED_USER is added`, () => {
            const user = buildUser();
            const channelAcl = [
              {
                category: AclCategory.USER,
                key: user.username,
                role: allowedRole, // allows change
              },
            ] as IChannelAclPermission[];
            const updatedAcl = [
              {
                // no update
                category: AclCategory.USER,
                key: user.username,
                role: allowedRole,
              },
              { category: AclCategory.AUTHENTICATED_USER, role: Role.READ }, // added
            ] as IChannelAclPermission[];

            const channel = { channelAcl, creator: "foo" } as IChannel;
            const channelPermission = new ChannelPermission(channel);

            const updates: IUpdateChannel = {
              // TODO: remove ts-ignore when V2 interfaces are hoisted from service to hub.js
              // @ts-ignore
              channelAclDefinition: updatedAcl,
            };

            expect(channelPermission.canUpdateProperties(user, updates)).toBe(
              true
            );
          });

          it(`should return true if user has role: ${allowedRole} and AUTHENTICATED_USER role is updated`, () => {
            const user = buildUser();
            const channelAcl = [
              {
                category: AclCategory.USER,
                key: user.username,
                role: allowedRole, // allows change
              },
              { category: AclCategory.AUTHENTICATED_USER, role: Role.READ },
            ] as IChannelAclPermission[];
            const updatedAcl = [
              {
                // no update
                category: AclCategory.USER,
                key: user.username,
                role: allowedRole,
              },
              {
                category: AclCategory.AUTHENTICATED_USER,
                role: Role.READWRITE, // role changed
              },
            ] as IChannelAclPermission[];

            const channel = { channelAcl, creator: "foo" } as IChannel;
            const channelPermission = new ChannelPermission(channel);

            const updates: IUpdateChannel = {
              // TODO: remove ts-ignore when V2 interfaces are hoisted from service to hub.js
              // @ts-ignore
              channelAclDefinition: updatedAcl,
            };

            expect(channelPermission.canUpdateProperties(user, updates)).toBe(
              true
            );
          });
        });

        notAllowedRoles.forEach((notAllowedRole) => {
          it(`should return false if user has role: ${notAllowedRole} and AUTHENTICATED_USER is removed`, () => {
            const user = buildUser();
            const channelAcl = [
              {
                category: AclCategory.USER,
                key: user.username,
                role: notAllowedRole, // DOES NOT ALLOW CHANGE
              },
              { category: AclCategory.AUTHENTICATED_USER, role: Role.READ }, // will be removed
            ] as IChannelAclPermission[];
            const updatedAcl = [
              {
                // no update
                category: AclCategory.USER,
                key: user.username,
                role: notAllowedRole,
              },
            ] as IChannelAclPermission[];

            const channel = { channelAcl, creator: "foo" } as IChannel;
            const channelPermission = new ChannelPermission(channel);

            const updates: IUpdateChannel = {
              // TODO: remove ts-ignore when V2 interfaces are hoisted from service to hub.js
              // @ts-ignore
              channelAclDefinition: updatedAcl,
            };

            expect(channelPermission.canUpdateProperties(user, updates)).toBe(
              false
            );
          });

          it(`should return false if user has role: ${notAllowedRole} and AUTHENTICATED_USER is added`, () => {
            const user = buildUser();
            const channelAcl = [
              {
                category: AclCategory.USER,
                key: user.username,
                role: notAllowedRole, // DOES NOT ALLOW CHANGE
              },
            ] as IChannelAclPermission[];
            const updatedAcl = [
              {
                // no update
                category: AclCategory.USER,
                key: user.username,
                role: notAllowedRole,
              },
              { category: AclCategory.AUTHENTICATED_USER, role: Role.READ }, // added
            ] as IChannelAclPermission[];

            const channel = { channelAcl, creator: "foo" } as IChannel;
            const channelPermission = new ChannelPermission(channel);

            const updates: IUpdateChannel = {
              // TODO: remove ts-ignore when V2 interfaces are hoisted from service to hub.js
              // @ts-ignore
              channelAclDefinition: updatedAcl,
            };

            expect(channelPermission.canUpdateProperties(user, updates)).toBe(
              false
            );
          });

          it(`should return false if user has role: ${notAllowedRole} and AUTHENTICATED_USER role is updated`, () => {
            const user = buildUser();
            const channelAcl = [
              {
                category: AclCategory.USER,
                key: user.username,
                role: notAllowedRole, // DOES NOT ALLOW CHANGE
              },
              { category: AclCategory.AUTHENTICATED_USER, role: Role.READ }, // existing
            ] as IChannelAclPermission[];
            const updatedAcl = [
              {
                // no update
                category: AclCategory.USER,
                key: user.username,
                role: notAllowedRole,
              },
              {
                category: AclCategory.AUTHENTICATED_USER,
                role: Role.READWRITE, // role changed
              },
            ] as IChannelAclPermission[];

            const channel = { channelAcl, creator: "foo" } as IChannel;
            const channelPermission = new ChannelPermission(channel);

            const updates: IUpdateChannel = {
              // TODO: remove ts-ignore when V2 interfaces are hoisted from service to hub.js
              // @ts-ignore
              channelAclDefinition: updatedAcl,
            };

            expect(channelPermission.canUpdateProperties(user, updates)).toBe(
              false
            );
          });
        });
      });

      describe("ANONYMOUS_USER added or removed or updated", () => {
        const allowedRoles = [Role.OWNER, Role.MANAGE];
        const notAllowedRoles = [
          Role.READ,
          Role.WRITE,
          Role.READWRITE,
          Role.MODERATE,
        ];

        allowedRoles.forEach((allowedRole) => {
          it(`should return true if user has role: ${allowedRole} and ANONYMOUS_USER is removed`, () => {
            const user = buildUser();
            const channelAcl = [
              {
                category: AclCategory.USER,
                key: user.username,
                role: allowedRole, // allows change
              },
              { category: AclCategory.ANONYMOUS_USER, role: Role.READ }, // will be removed
            ] as IChannelAclPermission[];
            const updatedAcl = [
              {
                // no update
                category: AclCategory.USER,
                key: user.username,
                role: allowedRole,
              },
            ] as IChannelAclPermission[];

            const channel = { channelAcl, creator: "foo" } as IChannel;
            const channelPermission = new ChannelPermission(channel);

            const updates: IUpdateChannel = {
              // TODO: remove ts-ignore when V2 interfaces are hoisted from service to hub.js
              // @ts-ignore
              channelAclDefinition: updatedAcl,
            };

            expect(channelPermission.canUpdateProperties(user, updates)).toBe(
              true
            );
          });

          it(`should return true if user has role: ${allowedRole} and ANONYMOUS_USER is added`, () => {
            const user = buildUser();
            const channelAcl = [
              {
                category: AclCategory.USER,
                key: user.username,
                role: allowedRole, // allows change
              },
            ] as IChannelAclPermission[];
            const updatedAcl = [
              {
                // no update
                category: AclCategory.USER,
                key: user.username,
                role: allowedRole,
              },
              { category: AclCategory.ANONYMOUS_USER, role: Role.READ }, // added
            ] as IChannelAclPermission[];

            const channel = { channelAcl, creator: "foo" } as IChannel;
            const channelPermission = new ChannelPermission(channel);

            const updates: IUpdateChannel = {
              // TODO: remove ts-ignore when V2 interfaces are hoisted from service to hub.js
              // @ts-ignore
              channelAclDefinition: updatedAcl,
            };

            expect(channelPermission.canUpdateProperties(user, updates)).toBe(
              true
            );
          });

          it(`should return true if user has role: ${allowedRole} and ANONYMOUS_USER role is updated`, () => {
            const user = buildUser();
            const channelAcl = [
              {
                category: AclCategory.USER,
                key: user.username,
                role: allowedRole, // allows change
              },
              { category: AclCategory.ANONYMOUS_USER, role: Role.READ }, // existing
            ] as IChannelAclPermission[];
            const updatedAcl = [
              {
                // no update
                category: AclCategory.USER,
                key: user.username,
                role: allowedRole,
              },
              { category: AclCategory.ANONYMOUS_USER, role: Role.READWRITE }, // role changed
            ] as IChannelAclPermission[];

            const channel = { channelAcl, creator: "foo" } as IChannel;
            const channelPermission = new ChannelPermission(channel);

            const updates: IUpdateChannel = {
              // TODO: remove ts-ignore when V2 interfaces are hoisted from service to hub.js
              // @ts-ignore
              channelAclDefinition: updatedAcl,
            };

            expect(channelPermission.canUpdateProperties(user, updates)).toBe(
              true
            );
          });
        });

        notAllowedRoles.forEach((notAllowedRole) => {
          it(`should return false if user has role: ${notAllowedRole} and ANONYMOUS_USER is removed`, () => {
            const user = buildUser();
            const channelAcl = [
              {
                category: AclCategory.USER,
                key: user.username,
                role: notAllowedRole, // DOES NOT ALLOW CHANGE
              },
              { category: AclCategory.ANONYMOUS_USER, role: Role.READ }, // will be removed
            ] as IChannelAclPermission[];
            const updatedAcl = [
              {
                // no update
                category: AclCategory.USER,
                key: user.username,
                role: notAllowedRole,
              },
            ] as IChannelAclPermission[];

            const channel = { channelAcl, creator: "foo" } as IChannel;
            const channelPermission = new ChannelPermission(channel);

            const updates: IUpdateChannel = {
              // TODO: remove ts-ignore when V2 interfaces are hoisted from service to hub.js
              // @ts-ignore
              channelAclDefinition: updatedAcl,
            };

            expect(channelPermission.canUpdateProperties(user, updates)).toBe(
              false
            );
          });

          it(`should return false if user has role: ${notAllowedRole} and ANONYMOUS_USER is added`, () => {
            const user = buildUser();
            const channelAcl = [
              {
                category: AclCategory.USER,
                key: user.username,
                role: notAllowedRole, // DOES NOT ALLOW CHANGE
              },
            ] as IChannelAclPermission[];
            const updatedAcl = [
              {
                // no update
                category: AclCategory.USER,
                key: user.username,
                role: notAllowedRole,
              },
              { category: AclCategory.ANONYMOUS_USER, role: Role.READ }, // added
            ] as IChannelAclPermission[];

            const channel = { channelAcl, creator: "foo" } as IChannel;
            const channelPermission = new ChannelPermission(channel);

            const updates: IUpdateChannel = {
              // TODO: remove ts-ignore when V2 interfaces are hoisted from service to hub.js
              // @ts-ignore
              channelAclDefinition: updatedAcl,
            };

            expect(channelPermission.canUpdateProperties(user, updates)).toBe(
              false
            );
          });

          it(`should return false if user has role: ${notAllowedRole} and ANONYMOUS_USER role is updated`, () => {
            const user = buildUser();
            const channelAcl = [
              {
                category: AclCategory.USER,
                key: user.username,
                role: notAllowedRole, // DOES NOT ALLOW CHANGE
              },
              { category: AclCategory.ANONYMOUS_USER, role: Role.READ }, // existing
            ] as IChannelAclPermission[];
            const updatedAcl = [
              {
                // no update
                category: AclCategory.USER,
                key: user.username,
                role: notAllowedRole,
              },
              { category: AclCategory.ANONYMOUS_USER, role: Role.READWRITE }, // role changed
            ] as IChannelAclPermission[];

            const channel = { channelAcl, creator: "foo" } as IChannel;
            const channelPermission = new ChannelPermission(channel);

            const updates: IUpdateChannel = {
              // TODO: remove ts-ignore when V2 interfaces are hoisted from service to hub.js
              // @ts-ignore
              channelAclDefinition: updatedAcl,
            };

            expect(channelPermission.canUpdateProperties(user, updates)).toBe(
              false
            );
          });
        });
      });
    });

    describe("defaultPostStatus", () => {
      it("returns true if value not changed regardless of role", () => {
        const user = buildUser();
        const channelAcl = [
          { category: AclCategory.USER, key: user.username, role: Role.READ }, // bad role for update
        ] as IChannelAclPermission[];

        const channel = {
          defaultPostStatus: PostStatus.APPROVED,
          channelAcl,
          creator: "foo",
        } as IChannel;
        const channelPermission = new ChannelPermission(channel);

        const updates: IUpdateChannel = {
          defaultPostStatus: PostStatus.APPROVED,
        };

        expect(channelPermission.canUpdateProperties(user, updates)).toBe(true);
      });

      it("returns true if updated is undefined regardless of role", () => {
        const user = buildUser();
        const channelAcl = [
          { category: AclCategory.USER, key: user.username, role: Role.READ }, // bad role for update
        ] as IChannelAclPermission[];

        const channel = {
          defaultPostStatus: PostStatus.APPROVED,
          channelAcl,
          creator: "foo",
        } as IChannel;
        const channelPermission = new ChannelPermission(channel);

        const updates: IUpdateChannel = {
          defaultPostStatus: undefined,
        };

        expect(channelPermission.canUpdateProperties(user, updates)).toBe(true);
      });

      it("returns true if user has a role of moderate", () => {
        const user = buildUser();
        const channelAcl = [
          {
            category: AclCategory.USER,
            key: user.username,
            role: Role.MODERATE,
          },
        ] as IChannelAclPermission[];

        const channel = {
          defaultPostStatus: PostStatus.PENDING,
          channelAcl,
          creator: "foo",
        } as IChannel;
        const channelPermission = new ChannelPermission(channel);

        const updates: IUpdateChannel = {
          defaultPostStatus: PostStatus.APPROVED,
        };

        expect(channelPermission.canUpdateProperties(user, updates)).toBe(true);
      });

      it("returns true if user has a role of manage", () => {
        const user = buildUser();
        const channelAcl = [
          { category: AclCategory.USER, key: user.username, role: Role.MANAGE },
        ] as IChannelAclPermission[];

        const channel = {
          defaultPostStatus: PostStatus.PENDING,
          channelAcl,
          creator: "foo",
        } as IChannel;
        const channelPermission = new ChannelPermission(channel);

        const updates: IUpdateChannel = {
          defaultPostStatus: PostStatus.APPROVED,
        };

        expect(channelPermission.canUpdateProperties(user, updates)).toBe(true);
      });

      it("returns true if user has a role of owner", () => {
        const user = buildUser();
        const channelAcl = [
          { category: AclCategory.USER, key: user.username, role: Role.OWNER },
        ] as IChannelAclPermission[];

        const channel = {
          defaultPostStatus: PostStatus.PENDING,
          channelAcl,
          creator: "foo",
        } as IChannel;
        const channelPermission = new ChannelPermission(channel);

        const updates: IUpdateChannel = {
          defaultPostStatus: PostStatus.APPROVED,
        };

        expect(channelPermission.canUpdateProperties(user, updates)).toBe(true);
      });

      it("returns false if user does not have a minimum role of moderate", () => {
        const user = buildUser();
        const channelAcl = [
          {
            category: AclCategory.USER,
            key: user.username,
            role: Role.READWRITE,
          },
        ] as IChannelAclPermission[];

        const channel = {
          defaultPostStatus: PostStatus.PENDING,
          channelAcl,
          creator: "foo",
        } as IChannel;
        const channelPermission = new ChannelPermission(channel);

        const updates: IUpdateChannel = {
          defaultPostStatus: PostStatus.APPROVED,
        };

        expect(channelPermission.canUpdateProperties(user, updates)).toBe(
          false
        );
      });
    });

    describe("blockWords", () => {
      it("returns true if value not changed from existing regardless of role", () => {
        const user = buildUser();
        const channelAcl = [
          { category: AclCategory.USER, key: user.username, role: Role.READ }, // bad role for update
        ] as IChannelAclPermission[];

        const channel = {
          blockWords: ["burrito"],
          channelAcl,
          creator: "foo",
        } as IChannel;
        const channelPermission = new ChannelPermission(channel);

        const updates: IUpdateChannel = {
          blockWords: ["burrito"],
        };

        expect(channelPermission.canUpdateProperties(user, updates)).toBe(true);
      });

      it("returns true if value not changed (just rearranged) from existing regardless of role", () => {
        const user = buildUser();
        const channelAcl = [
          { category: AclCategory.USER, key: user.username, role: Role.READ }, // bad role for update
        ] as IChannelAclPermission[];

        const channel = {
          blockWords: ["burrito", "taco"],
          channelAcl,
          creator: "foo",
        } as IChannel;
        const channelPermission = new ChannelPermission(channel);

        const updates: IUpdateChannel = {
          blockWords: ["taco", "burrito"],
        };

        expect(channelPermission.canUpdateProperties(user, updates)).toBe(true);
      });

      it("returns true if user has a role of moderate and blockWord is removed", () => {
        const user = buildUser();
        const channelAcl = [
          {
            category: AclCategory.USER,
            key: user.username,
            role: Role.MODERATE,
          },
        ] as IChannelAclPermission[];

        const channel = {
          blockWords: ["burrito", "taco"],
          channelAcl,
          creator: "foo",
        } as IChannel;
        const channelPermission = new ChannelPermission(channel);

        const updates: IUpdateChannel = {
          blockWords: ["burrito"],
        };

        expect(channelPermission.canUpdateProperties(user, updates)).toBe(true);
      });

      it("returns true if user has a role of moderate and blockWord is added", () => {
        const user = buildUser();
        const channelAcl = [
          {
            category: AclCategory.USER,
            key: user.username,
            role: Role.MODERATE,
          },
        ] as IChannelAclPermission[];

        const channel = {
          blockWords: ["burrito", "taco"],
          channelAcl,
          creator: "foo",
        } as IChannel;
        const channelPermission = new ChannelPermission(channel);

        const updates: IUpdateChannel = {
          blockWords: ["burrito", "taco", "flan"],
        };

        expect(channelPermission.canUpdateProperties(user, updates)).toBe(true);
      });

      it("returns true if user has a role of manage", () => {
        const user = buildUser();
        const channelAcl = [
          { category: AclCategory.USER, key: user.username, role: Role.MANAGE },
        ] as IChannelAclPermission[];

        const channel = {
          blockWords: ["burrito"],
          channelAcl,
          creator: "foo",
        } as IChannel;
        const channelPermission = new ChannelPermission(channel);

        const updates: IUpdateChannel = {
          blockWords: ["taco"],
        };

        expect(channelPermission.canUpdateProperties(user, updates)).toBe(true);
      });

      it("returns true if user has a role of owner", () => {
        const user = buildUser();
        const channelAcl = [
          { category: AclCategory.USER, key: user.username, role: Role.OWNER },
        ] as IChannelAclPermission[];

        const channel = {
          blockWords: ["burrito"],
          channelAcl,
          creator: "foo",
        } as IChannel;
        const channelPermission = new ChannelPermission(channel);

        const updates: IUpdateChannel = {
          blockWords: ["taco"],
        };

        expect(channelPermission.canUpdateProperties(user, updates)).toBe(true);
      });

      it("returns false if user does not have a minimum role of moderate", () => {
        const user = buildUser();
        const channelAcl = [
          {
            category: AclCategory.USER,
            key: user.username,
            role: Role.READWRITE,
          },
        ] as IChannelAclPermission[];

        const channel = {
          blockWords: ["burrito"],
          channelAcl,
          creator: "foo",
        } as IChannel;
        const channelPermission = new ChannelPermission(channel);

        const updates: IUpdateChannel = {
          blockWords: ["taco"],
        };

        expect(channelPermission.canUpdateProperties(user, updates)).toBe(
          false
        );
      });
    });

    describe("softDelete", () => {
      it("returns true if value not changed from existing regardless of role", () => {
        const user = buildUser();
        const channelAcl = [
          { category: AclCategory.USER, key: user.username, role: Role.READ }, // bad role for update
        ] as IChannelAclPermission[];

        const channel = {
          softDelete: true,
          channelAcl,
          creator: "foo",
        } as IChannel;
        const channelPermission = new ChannelPermission(channel);

        const updates: IUpdateChannel = {
          softDelete: true,
        };

        expect(channelPermission.canUpdateProperties(user, updates)).toBe(true);
      });

      it("returns true if update is undefined regardless of role", () => {
        const user = buildUser();
        const channelAcl = [
          { category: AclCategory.USER, key: user.username, role: Role.READ }, // bad role for update
        ] as IChannelAclPermission[];

        const channel = {
          softDelete: true,
          channelAcl,
          creator: "foo",
        } as IChannel;
        const channelPermission = new ChannelPermission(channel);

        const updates: IUpdateChannel = {
          softDelete: undefined,
        };

        expect(channelPermission.canUpdateProperties(user, updates)).toBe(true);
      });

      it("returns true if user has a role of manage", () => {
        const user = buildUser();
        const channelAcl = [
          { category: AclCategory.USER, key: user.username, role: Role.MANAGE },
        ] as IChannelAclPermission[];

        const channel = {
          softDelete: false,
          channelAcl,
          creator: "foo",
        } as IChannel;
        const channelPermission = new ChannelPermission(channel);

        const updates: IUpdateChannel = {
          softDelete: true,
        };

        expect(channelPermission.canUpdateProperties(user, updates)).toBe(true);
      });

      it("returns true if user has a role of owner", () => {
        const user = buildUser();
        const channelAcl = [
          { category: AclCategory.USER, key: user.username, role: Role.OWNER },
        ] as IChannelAclPermission[];

        const channel = {
          softDelete: false,
          channelAcl,
          creator: "foo",
        } as IChannel;
        const channelPermission = new ChannelPermission(channel);

        const updates: IUpdateChannel = {
          softDelete: true,
        };

        expect(channelPermission.canUpdateProperties(user, updates)).toBe(true);
      });

      it("returns false if user does not have a minimum role of manage", () => {
        const user = buildUser();
        const channelAcl = [
          {
            category: AclCategory.USER,
            key: user.username,
            role: Role.MODERATE,
          },
        ] as IChannelAclPermission[];

        const channel = {
          softDelete: false,
          channelAcl,
          creator: "foo",
        } as IChannel;
        const channelPermission = new ChannelPermission(channel);

        const updates: IUpdateChannel = {
          softDelete: true,
        };

        expect(channelPermission.canUpdateProperties(user, updates)).toBe(
          false
        );
      });
    });

    describe("name", () => {
      it("returns true if value not changed from existing regardless of role", () => {
        const user = buildUser();
        const channelAcl = [
          { category: AclCategory.USER, key: user.username, role: Role.READ }, // bad role for update
        ] as IChannelAclPermission[];

        const channel = {
          name: "burrito",
          channelAcl,
          creator: "foo",
        } as IChannel;
        const channelPermission = new ChannelPermission(channel);

        const updates: IUpdateChannel = {
          name: "burrito",
        };

        expect(channelPermission.canUpdateProperties(user, updates)).toBe(true);
      });

      it("returns true if update is undefined regardless of role", () => {
        const user = buildUser();
        const channelAcl = [
          { category: AclCategory.USER, key: user.username, role: Role.READ }, // bad role for update
        ] as IChannelAclPermission[];

        const channel = {
          name: "burrito",
          channelAcl,
          creator: "foo",
        } as IChannel;
        const channelPermission = new ChannelPermission(channel);

        const updates: IUpdateChannel = {
          name: undefined,
        };

        expect(channelPermission.canUpdateProperties(user, updates)).toBe(true);
      });

      it("returns true if user has a role of manage", () => {
        const user = buildUser();
        const channelAcl = [
          { category: AclCategory.USER, key: user.username, role: Role.MANAGE },
        ] as IChannelAclPermission[];

        const channel = {
          name: "burrito",
          channelAcl,
          creator: "foo",
        } as IChannel;
        const channelPermission = new ChannelPermission(channel);

        const updates: IUpdateChannel = {
          name: "foo",
        };

        expect(channelPermission.canUpdateProperties(user, updates)).toBe(true);
      });

      it("returns true if user has a role of owner", () => {
        const user = buildUser();
        const channelAcl = [
          { category: AclCategory.USER, key: user.username, role: Role.OWNER },
        ] as IChannelAclPermission[];

        const channel = {
          name: "burrito",
          channelAcl,
          creator: "foo",
        } as IChannel;
        const channelPermission = new ChannelPermission(channel);

        const updates: IUpdateChannel = {
          name: "foo",
        };

        expect(channelPermission.canUpdateProperties(user, updates)).toBe(true);
      });

      it("returns false if user does not have a minimum role of manage", () => {
        const user = buildUser();
        const channelAcl = [
          {
            category: AclCategory.USER,
            key: user.username,
            role: Role.MODERATE,
          },
        ] as IChannelAclPermission[];

        const channel = {
          name: "burrito",
          channelAcl,
          creator: "foo",
        } as IChannel;
        const channelPermission = new ChannelPermission(channel);

        const updates: IUpdateChannel = {
          name: "foo",
        };

        expect(channelPermission.canUpdateProperties(user, updates)).toBe(
          false
        );
      });
    });
  });

  describe("canReadChannel", () => {
    describe("no channel permissions defined", () => {
      it("returns false if user logged in and channel permissions are empty", async () => {
        const user = buildUser();
        const channelAcl = [] as IChannelAclPermission[];
        const channel = { channelAcl, creator: "foo" } as IChannel;

        const channelPermission = new ChannelPermission(channel);

        expect(channelPermission.canReadChannel(user)).toBe(false);
      });

      it("returns false if user not logged in and channel permissions are empty", async () => {
        const user = buildUser({ username: null });
        const channelAcl = [] as IChannelAclPermission[];
        const channel = { channelAcl, creator: "foo" } as IChannel;

        const channelPermission = new ChannelPermission(channel);

        expect(channelPermission.canReadChannel(user)).toBe(false);
      });

      it("returns true if user logged in and in non-discussable group", async () => {
        const user = buildUser({
          groups: [buildGroup("groupND", "member", [CANNOT_DISCUSS])],
        });
        const channelAcl = [
          {
            category: AclCategory.GROUP,
            subCategory: AclSubCategory.MEMBER,
            key: "groupND",
            role: Role.READ, // members write
          },
          {
            category: AclCategory.GROUP,
            subCategory: AclSubCategory.ADMIN,
            key: "groupND",
            role: Role.READ, // members write
          },
        ] as IChannelAclPermission[];
        const channel = { channelAcl, creator: "foo" } as IChannel;
        const channelPermission = new ChannelPermission(channel);

        expect(channelPermission.canReadChannel(user)).toBe(true);
      });
    });

    describe("Anonymous User Permissions", () => {
      it(`returns true if anonymous permission defined and role is allowed`, () => {
        const user = buildUser({ username: null });

        ALLOWED_ROLES_FOR_READING.forEach((allowedRole) => {
          const channelAcl = [
            { category: AclCategory.ANONYMOUS_USER, role: allowedRole },
          ] as IChannelAclPermission[];
          const channel = { channelAcl, creator: "foo" } as IChannel;

          const channelPermission = new ChannelPermission(channel);

          expect(channelPermission.canReadChannel(user)).toBe(true);
        });
      });

      it("returns false if anonymous permission defined but role is write", () => {
        const user = buildUser({ username: null });
        const channelAcl = [
          { category: AclCategory.ANONYMOUS_USER, role: Role.WRITE },
        ] as IChannelAclPermission[];
        const channel = { channelAcl, creator: "foo" } as IChannel;

        const channelPermission = new ChannelPermission(channel);

        expect(channelPermission.canReadChannel(user)).toBe(false);
      });
    });

    describe("Authenticated User Permissions", () => {
      it(`returns true if authenticated permission defined, user logged in, and role is allowed`, async () => {
        const user = buildUser();

        ALLOWED_ROLES_FOR_READING.forEach((allowedRole) => {
          const channelAcl = [
            { category: AclCategory.AUTHENTICATED_USER, role: allowedRole },
          ] as IChannelAclPermission[];
          const channel = { channelAcl, creator: "foo" } as IChannel;

          const channelPermission = new ChannelPermission(channel);

          expect(channelPermission.canReadChannel(user)).toBe(true);
        });
      });

      it("returns false if authenticated permission defined, user logged in, and role is write", async () => {
        const user = buildUser();
        const channelAcl = [
          { category: AclCategory.AUTHENTICATED_USER, role: Role.WRITE },
        ] as IChannelAclPermission[];
        const channel = { channelAcl, creator: "foo" } as IChannel;

        const channelPermission = new ChannelPermission(channel);

        expect(channelPermission.canReadChannel(user)).toBe(false);
      });

      it("returns false if authenticated permission defined and user is not logged in", async () => {
        const user = buildUser({ username: null });
        const channelAcl = [
          { category: AclCategory.AUTHENTICATED_USER, role: Role.READWRITE },
        ] as IChannelAclPermission[];
        const channel = { channelAcl, creator: "foo" } as IChannel;

        const channelPermission = new ChannelPermission(channel);

        expect(channelPermission.canReadChannel(user)).toBe(false);
      });
    });

    describe("Group Permissions", () => {
      it("returns true if user is group member in group permission list and role is allowed", async () => {
        ALLOWED_ROLES_FOR_READING.forEach((allowedRole) => {
          const channelAcl = [
            {
              category: AclCategory.GROUP,
              subCategory: AclSubCategory.MEMBER,
              key: groupId1,
              role: allowedRole, // members write
            },
            {
              category: AclCategory.GROUP,
              subCategory: AclSubCategory.ADMIN,
              key: groupId1,
              role: Role.READ,
            },
          ] as IChannelAclPermission[];

          ALLOWED_GROUP_ROLES.forEach((memberType) => {
            const user = buildUser({
              orgId: orgId1,
              groups: [buildGroup(groupId1, memberType)], // member in groupId1
            });
            const channel = { channelAcl, creator: "foo" } as IChannel;

            const channelPermission = new ChannelPermission(channel);

            expect(channelPermission.canReadChannel(user)).toBe(true);
          });
        });
      });

      it("returns false if user is group member in group permission list and role is NOT allowed", async () => {
        const user = buildUser(); // member in groupId1
        const channelAcl = [
          {
            category: AclCategory.GROUP,
            subCategory: AclSubCategory.MEMBER,
            key: groupId1,
            role: Role.WRITE,
          },
          {
            category: AclCategory.GROUP,
            subCategory: AclSubCategory.ADMIN,
            key: groupId1,
            role: Role.WRITE,
          },
        ] as IChannelAclPermission[];
        const channel = { channelAcl, creator: "foo" } as IChannel;

        const channelPermission = new ChannelPermission(channel);

        expect(channelPermission.canReadChannel(user)).toBe(false);
      });

      it("returns false if user is group member in group permission list, role is allowed, but userMemberType is none", async () => {
        const user = buildUser({
          groups: [buildGroup(groupId1, "none")], // none in groupId1
        });
        const channelAcl = [
          {
            category: AclCategory.GROUP,
            subCategory: AclSubCategory.MEMBER,
            key: groupId1,
            role: Role.READWRITE, // members read
          },
          {
            category: AclCategory.GROUP,
            subCategory: AclSubCategory.ADMIN,
            key: groupId1,
            role: Role.READWRITE, // admins read
          },
        ] as IChannelAclPermission[];
        const channel = { channelAcl, creator: "foo" } as IChannel;

        const channelPermission = new ChannelPermission(channel);

        expect(channelPermission.canReadChannel(user)).toBe(false);
      });

      it("returns true if user is group owner/admin in group permission list and role is allowed", async () => {
        ALLOWED_ROLES_FOR_READING.forEach((allowedRole) => {
          const channelAcl = [
            {
              category: AclCategory.GROUP,
              subCategory: AclSubCategory.MEMBER,
              key: groupId1,
              role: Role.READ,
            },
            {
              category: AclCategory.GROUP,
              subCategory: AclSubCategory.ADMIN,
              key: groupId1,
              role: allowedRole, // admins write
            },
          ] as IChannelAclPermission[];

          ["owner", "admin"].forEach((memberType) => {
            const user = buildUser({
              orgId: orgId1,
              groups: [buildGroup(groupId1, memberType)], // admin in groupId1
            });
            const channel = { channelAcl, creator: "foo" } as IChannel;

            const channelPermission = new ChannelPermission(channel);

            expect(channelPermission.canReadChannel(user)).toBe(true);
          });
        });
      });

      it("returns false if user is group owner/admin in group permission list and role is NOT allowed", async () => {
        const user = buildUser(); // admin in groupId2
        const channelAcl = [
          {
            category: AclCategory.GROUP,
            subCategory: AclSubCategory.MEMBER,
            key: groupId2,
            role: Role.WRITE,
          },
          {
            category: AclCategory.GROUP,
            subCategory: AclSubCategory.ADMIN,
            key: groupId2,
            role: Role.WRITE,
          },
        ] as IChannelAclPermission[];
        const channel = { channelAcl, creator: "foo" } as IChannel;

        const channelPermission = new ChannelPermission(channel);

        expect(channelPermission.canReadChannel(user)).toBe(false);
      });

      it("returns true if user is group member of at least one group in permissions list that is discussable", async () => {
        const user = buildUser({
          orgId: orgId1,
          groups: [
            buildGroup(groupId1, "member"), // member in groupId1
            buildGroup(groupId2, "member", [CANNOT_DISCUSS]), // member in groupId2
          ],
        });
        const channelAcl = [
          {
            category: AclCategory.GROUP,
            subCategory: AclSubCategory.MEMBER,
            key: groupId1,
            role: Role.READWRITE, // members write
          },
          {
            category: AclCategory.GROUP,
            subCategory: AclSubCategory.ADMIN,
            key: groupId1,
            role: Role.READ,
          },
          {
            category: AclCategory.GROUP,
            subCategory: AclSubCategory.MEMBER,
            key: groupId2,
            role: Role.READWRITE, // members write, group CANNOT_DISCUSS
          },
          {
            category: AclCategory.GROUP,
            subCategory: AclSubCategory.ADMIN,
            key: groupId2,
            role: Role.READ,
          },
        ] as IChannelAclPermission[];
        const channel = { channelAcl, creator: "foo" } as IChannel;

        const channelPermission = new ChannelPermission(channel);

        expect(channelPermission.canReadChannel(user)).toBe(true);
      });

      it("returns true if user is group member in permissions list but the group is not discussable", async () => {
        const user = buildUser({
          orgId: orgId1,
          groups: [
            buildGroup(groupId1, "member", [CANNOT_DISCUSS]), // member in groupId1
          ],
        });
        const channelAcl = [
          {
            category: AclCategory.GROUP,
            subCategory: AclSubCategory.MEMBER,
            key: groupId1,
            role: Role.READWRITE, // members write
          },
          {
            category: AclCategory.GROUP,
            subCategory: AclSubCategory.ADMIN,
            key: groupId1,
            role: Role.WRITE,
          },
        ] as IChannelAclPermission[];
        const channel = { channelAcl, creator: "foo" } as IChannel;

        const channelPermission = new ChannelPermission(channel);

        expect(channelPermission.canReadChannel(user)).toBe(true);
      });

      it("returns false if user is group admin but group is not in permissions list", async () => {
        const user = buildUser({
          orgId: orgId1,
          groups: [
            buildGroup("unknownGroupId", "admin"), // admin in unknownGroupId
          ],
        });
        const channelAcl = [
          {
            category: AclCategory.GROUP,
            subCategory: AclSubCategory.MEMBER,
            key: groupId1,
            role: Role.READWRITE, // members write
          },
          {
            category: AclCategory.GROUP,
            subCategory: AclSubCategory.ADMIN,
            key: groupId1,
            role: Role.READWRITE, // admin write
          },
        ] as IChannelAclPermission[];
        const channel = { channelAcl, creator: "foo" } as IChannel;

        const channelPermission = new ChannelPermission(channel);

        expect(channelPermission.canReadChannel(user)).toBe(false);
      });
    });

    describe("Org Permissions", () => {
      it("returns true if user is org member in permissions list and member role is allowed", async () => {
        const user = buildUser();

        ALLOWED_ROLES_FOR_READING.forEach((allowedRole) => {
          const channelAcl = [
            {
              category: AclCategory.ORG,
              subCategory: AclSubCategory.MEMBER,
              key: user.orgId,
              role: allowedRole, // members write
            },
            {
              category: AclCategory.ORG,
              subCategory: AclSubCategory.ADMIN,
              key: user.orgId,
              role: Role.READ, // admin read
            },
          ] as IChannelAclPermission[];
          const channel = { channelAcl, creator: "joker" } as IChannel;

          const channelPermission = new ChannelPermission(channel);

          expect(channelPermission.canReadChannel(user)).toBe(true);
        });
      });

      it("returns true if user is org_admin in permissions list and admin role is allowed", async () => {
        const user = buildUser({ role: "org_admin" });

        ALLOWED_ROLES_FOR_READING.forEach((allowedRole) => {
          const channelAcl = [
            {
              category: AclCategory.ORG,
              subCategory: AclSubCategory.MEMBER,
              key: user.orgId,
              role: Role.READ, // members read
            },
            {
              category: AclCategory.ORG,
              subCategory: AclSubCategory.ADMIN,
              key: user.orgId,
              role: allowedRole, // admin write
            },
          ] as IChannelAclPermission[];
          const channel = { channelAcl, creator: "foo" } as IChannel;

          const channelPermission = new ChannelPermission(channel);

          expect(channelPermission.canReadChannel(user)).toBe(true);
        });
      });

      it("returns false if user is not in the permissions org", async () => {
        const user = buildUser({ orgId: "unknownOrgId" });
        const channelAcl = [
          {
            category: AclCategory.ORG,
            subCategory: AclSubCategory.MEMBER,
            key: orgId1,
            role: Role.WRITE,
          },
          {
            category: AclCategory.ORG,
            subCategory: AclSubCategory.ADMIN,
            key: orgId1,
            role: Role.READWRITE,
          },
        ] as IChannelAclPermission[];
        const channel = { channelAcl, creator: "foo" } as IChannel;

        const channelPermission = new ChannelPermission(channel);

        expect(channelPermission.canReadChannel(user)).toBe(false);
      });
    });

    describe("User Permissions", () => {
      it("returns true if user is in permissions list and role is allowed", () => {
        const user = buildUser();

        ALLOWED_ROLES_FOR_READING.forEach((allowedRole) => {
          const channelAcl = [
            {
              category: AclCategory.USER,
              key: user.username,
              role: allowedRole,
            },
          ] as IChannelAclPermission[];
          const channel = { channelAcl, creator: "foo" } as IChannel;

          const channelPermission = new ChannelPermission(channel);

          expect(channelPermission.canReadChannel(user)).toBe(true);
        });
      });

      it("returns false if user is in permissions list but role is write", () => {
        const user = buildUser();
        const channelAcl = [
          { category: AclCategory.USER, key: user.username, role: Role.WRITE },
        ] as IChannelAclPermission[];
        const channel = { channelAcl, creator: "foo" } as IChannel;

        const channelPermission = new ChannelPermission(channel);

        expect(channelPermission.canReadChannel(user)).toBe(false);
      });
    });
  });
});
