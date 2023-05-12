import { IGroup } from "@esri/arcgis-rest-types";
import {
  AclCategory,
  AclSubCategory,
  IChannelAclPermission,
  IDiscussionsUser,
  Role,
} from "../../src/types";
import { ChannelPermission } from "../../src/utils/channel-permission";
import { CANNOT_DISCUSS } from "../../src/utils/constants";

const ALLOWED_GROUP_ROLES = Object.freeze(["owner", "admin", "member"]);
const ADMIN_GROUP_MEMBER_TYPES = Object.freeze(["owner", "admin"]);

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
  describe("canPostToChannel", () => {
    describe("all permission cases", () => {
      it("returns false if user logged in and channel permissions are empty", async () => {
        const user = buildUser();
        const channelAcl = [] as IChannelAclPermission[];

        const channelPermission = new ChannelPermission(channelAcl);

        expect(channelPermission.canPostToChannel(user)).toBe(false);
      });

      it("returns false if user not logged in and channel permissions are empty", async () => {
        const user = buildUser({ username: null });
        const channelAcl = [] as IChannelAclPermission[];

        const channelPermission = new ChannelPermission(channelAcl);

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

          const channelPermission = new ChannelPermission(channelAcl);

          expect(channelPermission.canPostToChannel(user)).toBe(true);
        });
      });

      it("returns false if anonymous permission defined but role is read", () => {
        const user = buildUser({ username: null });
        const channelAcl = [
          { category: AclCategory.ANONYMOUS_USER, role: Role.READ },
        ] as IChannelAclPermission[];

        const channelPermission = new ChannelPermission(channelAcl);

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

          const channelPermission = new ChannelPermission(channelAcl);

          expect(channelPermission.canPostToChannel(user)).toBe(true);
        });
      });

      it("returns false if authenticated permission defined, user logged in, and role is read", async () => {
        const user = buildUser();
        const channelAcl = [
          { category: AclCategory.AUTHENTICATED_USER, role: Role.READ },
        ] as IChannelAclPermission[];

        const channelPermission = new ChannelPermission(channelAcl);

        expect(channelPermission.canPostToChannel(user)).toBe(false);
      });

      it("returns false if authenticated permission defined and user is not logged in", async () => {
        const user = buildUser({ username: null });
        const channelAcl = [
          { category: AclCategory.AUTHENTICATED_USER, role: Role.READWRITE },
        ] as IChannelAclPermission[];

        const channelPermission = new ChannelPermission(channelAcl);

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

            const channelPermission = new ChannelPermission(channelAcl);

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

        const channelPermission = new ChannelPermission(channelAcl);

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

        const channelPermission = new ChannelPermission(channelAcl);

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

            const channelPermission = new ChannelPermission(channelAcl);

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

        const channelPermission = new ChannelPermission(channelAcl);

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

        const channelPermission = new ChannelPermission(channelAcl);

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

        const channelPermission = new ChannelPermission(channelAcl);

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

        const channelPermission = new ChannelPermission(channelAcl);

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

          const channelPermission = new ChannelPermission(channelAcl);

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

          const channelPermission = new ChannelPermission(channelAcl);

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

        const channelPermission = new ChannelPermission(channelAcl);

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

          const channelPermission = new ChannelPermission(channelAcl);

          expect(channelPermission.canPostToChannel(user)).toBe(true);
        });
      });

      it("returns false if user is in permissions list but role is read", () => {
        const user = buildUser();
        const channelAcl = [
          { category: AclCategory.USER, key: user.username, role: Role.READ },
        ] as IChannelAclPermission[];

        const channelPermission = new ChannelPermission(channelAcl);

        expect(channelPermission.canPostToChannel(user)).toBe(false);
      });
    });
  });

  describe("canModifyPostStatus", () => {
    let canModifyChannelSpy: jasmine.Spy;

    beforeAll(() => {
      canModifyChannelSpy = spyOn(
        ChannelPermission.prototype,
        "canModifyChannel"
      );
    });

    beforeEach(() => {
      canModifyChannelSpy.calls.reset();
    });

    it("should return true if canModifyChannel returns true", () => {
      canModifyChannelSpy.and.callFake(() => true);

      const user = buildUser();
      const channelCreator = user.username;
      const channelAcl = [] as IChannelAclPermission[];

      const channelPermission = new ChannelPermission(channelAcl);

      expect(channelPermission.canModifyPostStatus(user, channelCreator)).toBe(
        true
      );

      expect(canModifyChannelSpy.calls.count()).toBe(1);
      const [arg1, arg2] = canModifyChannelSpy.calls.allArgs()[0]; // args for 1st call
      expect(arg1).toBe(user);
      expect(arg2).toBe(channelCreator);
    });

    it("should return false if canModifyChannel returns false", () => {
      canModifyChannelSpy.and.callFake(() => false);

      const user = buildUser();
      const channelCreator = user.username;
      const channelAcl = [] as IChannelAclPermission[];

      const channelPermission = new ChannelPermission(channelAcl);

      expect(channelPermission.canModifyPostStatus(user, channelCreator)).toBe(
        false
      );

      expect(canModifyChannelSpy.calls.count()).toBe(1);
      const [arg1, arg2] = canModifyChannelSpy.calls.allArgs()[0]; // args for 1st call
      expect(arg1).toBe(user);
      expect(arg2).toBe(channelCreator);
    });
  });

  describe("canCreateChannel", () => {
    describe("all permissions cases", () => {
      it("returns false if user not authenticated", () => {
        const user = buildUser({ username: null });
        const channelAcl = [
          { category: AclCategory.ANONYMOUS_USER, role: Role.READ },
        ] as IChannelAclPermission[];

        const channelPermission = new ChannelPermission(channelAcl);

        expect(channelPermission.canCreateChannel(user)).toEqual(false);
      });

      it("returns false if permissions list is empty", () => {
        const user = buildUser();
        const channelAcl = [] as IChannelAclPermission[];

        const channelPermission = new ChannelPermission(channelAcl);

        expect(channelPermission.canCreateChannel(user)).toEqual(false);
      });

      it("returns true with a full valid channelAcl if user is the org_admin, in all groups, and org permissions only relate to users org", () => {
        const user = buildUser({ role: "org_admin" });
        const channelAcl = buildCompleteAcl() as IChannelAclPermission[];

        const channelPermission = new ChannelPermission(channelAcl);

        expect(channelPermission.canCreateChannel(user)).toEqual(true);
      });
    });

    describe("Anonymous User Permissions", () => {
      it("returns true if user is org_admin", () => {
        const user = buildUser({ role: "org_admin" });
        const channelAcl = [
          { category: AclCategory.ANONYMOUS_USER, role: Role.READ },
        ] as IChannelAclPermission[];

        const channelPermission = new ChannelPermission(channelAcl);

        expect(channelPermission.canCreateChannel(user)).toEqual(true);
      });

      it("returns false if user is not org_admin", () => {
        const user = buildUser();
        const channelAcl = [
          { category: AclCategory.ANONYMOUS_USER, role: Role.READ },
        ] as IChannelAclPermission[];

        const channelPermission = new ChannelPermission(channelAcl);

        expect(channelPermission.canCreateChannel(user)).toEqual(false);
      });
    });

    describe("Authenticated User Permissions", () => {
      it("returns true if user is org_admin", () => {
        const user = buildUser({ role: "org_admin" });
        const channelAcl = [
          { category: AclCategory.AUTHENTICATED_USER, role: Role.READ },
        ] as IChannelAclPermission[];

        const channelPermission = new ChannelPermission(channelAcl);

        expect(channelPermission.canCreateChannel(user)).toEqual(true);
      });

      it("returns false if user is not org_admin", () => {
        const user = buildUser();
        const channelAcl = [
          { category: AclCategory.AUTHENTICATED_USER, role: Role.READ },
        ] as IChannelAclPermission[];

        const channelPermission = new ChannelPermission(channelAcl);

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

        const channelPermission = new ChannelPermission(channelAcl);

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

        const channelPermission = new ChannelPermission(channelAcl);

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

        const channelPermission = new ChannelPermission(channelAcl);

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

        const channelPermission = new ChannelPermission(channelAcl);

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

        const channelPermission = new ChannelPermission(channelAcl);

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

        const channelPermission = new ChannelPermission(channelAcl);

        expect(channelPermission.canCreateChannel(user)).toEqual(false);
      });

      it("returns false if user is not org_admin", () => {
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

        const channelPermission = new ChannelPermission(channelAcl);

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
        const channelPermission = new ChannelPermission(channelAcl);

        expect(channelPermission.canCreateChannel(user)).toEqual(false);
      });
    });
  });

  describe("canModifyChannel", () => {
    describe("all permission cases", () => {
      it("returns false if user not logged in", async () => {
        const user = buildUser({ username: null });
        const channelCreator = user.username;
        const channelAcl = [] as IChannelAclPermission[];

        const channelPermission = new ChannelPermission(channelAcl);

        expect(channelPermission.canModifyChannel(user, channelCreator)).toBe(
          false
        );
      });

      it("returns true if the user created the channel", async () => {
        const user = buildUser({ username: null });
        const channelCreator = user.username;
        const channelAcl = [] as IChannelAclPermission[];

        const channelPermission = new ChannelPermission(channelAcl);

        expect(channelPermission.canModifyChannel(user, channelCreator)).toBe(
          false
        );
      });
    });

    describe("Group Permissions", () => {
      it("returns true if user is group member in group permission list and role is moderate or above", async () => {
        const channelCreator = "notUser";

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

            const channelPermission = new ChannelPermission(channelAcl);

            expect(
              channelPermission.canModifyChannel(user, channelCreator)
            ).toBe(true);
          });
        });
      });

      it("returns false if user is group member in group permission list and role is NOT allowed", async () => {
        const user = buildUser(); // member in groupId1
        const channelCreator = "notUser";
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

        const channelPermission = new ChannelPermission(channelAcl);

        expect(channelPermission.canModifyChannel(user, channelCreator)).toBe(
          false
        );
      });

      it("returns false if user is group member in group permission list, role is allowed, but userMemberType is none", async () => {
        const user = buildUser({
          groups: [buildGroup(groupId1, "none")], // none in groupId1
        });
        const channelCreator = "notUser";
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

        const channelPermission = new ChannelPermission(channelAcl);

        expect(channelPermission.canModifyChannel(user, channelCreator)).toBe(
          false
        );
      });

      it("returns true if user is group owner/admin in group permission list and role is allowed", async () => {
        const channelCreator = "notUser";

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

            const channelPermission = new ChannelPermission(channelAcl);

            expect(
              channelPermission.canModifyChannel(user, channelCreator)
            ).toBe(true);
          });
        });
      });

      it("returns false if user is group owner/admin in group permission list and role is NOT allowed", async () => {
        const user = buildUser(); // admin in groupId2
        const channelCreator = "notUser";
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

        const channelPermission = new ChannelPermission(channelAcl);

        expect(channelPermission.canModifyChannel(user, channelCreator)).toBe(
          false
        );
      });

      it("returns false if user is group admin but group is not in permissions list", async () => {
        const user = buildUser({
          orgId: orgId1,
          groups: [
            buildGroup("unknownGroupId", "admin"), // admin in unknownGroupId
          ],
        });
        const channelCreator = "notUser";
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

        const channelPermission = new ChannelPermission(channelAcl);

        expect(channelPermission.canModifyChannel(user, channelCreator)).toBe(
          false
        );
      });
    });

    describe("Org Permissions", () => {
      it("returns true if user is org member in permissions list and member role is allowed", async () => {
        const user = buildUser();
        const channelCreator = "notUser";

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

          const channelPermission = new ChannelPermission(channelAcl);

          expect(channelPermission.canModifyChannel(user, channelCreator)).toBe(
            true
          );
        });
      });

      it("returns true if user is org_admin in permissions list and admin role is allowed", async () => {
        const user = buildUser({ role: "org_admin" });
        const channelCreator = "notUser";

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

          const channelPermission = new ChannelPermission(channelAcl);

          expect(channelPermission.canModifyChannel(user, channelCreator)).toBe(
            true
          );
        });
      });

      it("returns false if user is not in the permissions org", async () => {
        const user = buildUser({ orgId: "unknownOrgId" }); // unknown org
        const channelCreator = "notUser";
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

        const channelPermission = new ChannelPermission(channelAcl);

        expect(channelPermission.canModifyChannel(user, channelCreator)).toBe(
          false
        );
      });
    });

    describe("User Permissions", () => {
      it("returns true if user is in permissions list and role is allowed", () => {
        const user = buildUser();
        const channelCreator = "notUser";

        ALLOWED_ROLES_FOR_MODERATION.forEach((allowedRole) => {
          const channelAcl = [
            {
              category: AclCategory.USER,
              key: user.username,
              role: allowedRole,
            },
          ] as IChannelAclPermission[];

          const channelPermission = new ChannelPermission(channelAcl);

          expect(channelPermission.canModifyChannel(user, channelCreator)).toBe(
            true
          );
        });
      });

      it("returns false if user is in permissions list but role is not allowed", () => {
        const user = buildUser();
        const channelCreator = "notUser";
        const channelAcl = [
          { category: AclCategory.USER, key: user.username, role: Role.READ },
        ] as IChannelAclPermission[];

        const channelPermission = new ChannelPermission(channelAcl);

        expect(channelPermission.canModifyChannel(user, channelCreator)).toBe(
          false
        );
      });
    });
  });
});
