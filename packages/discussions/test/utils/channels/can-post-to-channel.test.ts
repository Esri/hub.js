import { IGroup } from "@esri/arcgis-rest-types";
import {
  AclCategory,
  AclSubCategory,
  IChannel,
  IDiscussionsUser,
  Role,
} from "../../../src/types";
import { canPostToChannel } from "../../../src/utils/channels/can-post-to-channel";
import { CANNOT_DISCUSS } from "../../../src/utils/constants";

const ALLOWED_GROUP_ROLES = Object.freeze(["owner", "admin", "member"]);

const ALLOWED_ROLES_FOR_POSTING = Object.freeze([
  Role.WRITE,
  Role.READWRITE,
  Role.MANAGE,
  Role.MODERATE,
  Role.OWNER,
]);

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
  describe("with ACL", () => {
    describe("anonymous user", () => {
      it("returns true if anonymous user attempts to create post in acl.anonymous.role === readWrite", () => {
        const user: IDiscussionsUser = { username: null };
        const channel = {
          acl: {
            anonymous: {
              role: "readWrite",
            },
          },
        } as any;

        expect(canPostToChannel(channel, user)).toBe(true);
      });

      it("returns true if anonymous user attempts to create post in acl.anonymous.role === write", () => {
        const user: IDiscussionsUser = { username: null };
        const channel = {
          acl: {
            anonymous: {
              role: "write",
            },
          },
        } as any;

        expect(canPostToChannel(channel, user)).toBe(true);
      });

      it("returns false if anonymous user attempts to create post in acl.anonymous.role === read", () => {
        const user: IDiscussionsUser = { username: null };
        const channel = {
          acl: {
            anonymous: {
              role: "read",
            },
          },
        } as any;

        expect(canPostToChannel(channel, user)).toBe(false);
      });

      it("returns false if anonymous user attempts to create post in a channel without anonymous access", () => {
        const user: IDiscussionsUser = { username: null };
        const channel = {
          acl: {},
        } as any;

        expect(canPostToChannel(channel, user)).toBe(false);
      });
    });

    describe("authenticated user but otherwise unauthorized", () => {
      it("returns true if authenticated user attempts to create post in acl.authenticated.role === readWrite", () => {
        const user: IDiscussionsUser = { username: "Slughorn" };
        const channel = {
          acl: {
            authenticated: {
              role: "readWrite",
            },
          },
        } as any;

        expect(canPostToChannel(channel, user)).toBe(true);
      });

      it("returns true if authenticated user attempts to create post in acl.authenticated.role === write", () => {
        const user: IDiscussionsUser = { username: "Slughorn" };
        const channel = {
          acl: {
            authenticated: {
              role: "write",
            },
          },
        } as any;

        expect(canPostToChannel(channel, user)).toBe(true);
      });

      it("returns false if authenticated user attempts to create post in acl.authenticated.role === read", () => {
        const user: IDiscussionsUser = { username: "Slughorn" };
        const channel = {
          acl: {
            authenticated: {
              role: "read",
            },
          },
        } as any;

        expect(canPostToChannel(channel, user)).toBe(false);
      });

      it("returns false if authenticated user attempts to create post in a channel without authenticated access", () => {
        const user: IDiscussionsUser = { username: null };
        const channel = {
          acl: {},
        } as any;

        expect(canPostToChannel(channel, user)).toBe(false);
      });
    });

    describe("authenticated user authorized in ACL", () => {
      it("returns true if user found in acl.users with allowed roles", () => {
        ["readWrite", "write", "manage", "moderate", "owner"].forEach(
          (allowedRole) => {
            const channel = {
              acl: {
                users: {
                  Slughorn: {
                    role: allowedRole,
                  },
                },
              },
            } as any;

            const user: IDiscussionsUser = {
              username: "Slughorn",
            } as any;

            expect(canPostToChannel(channel, user)).toBe(true);
          }
        );
      });

      it("returns false if authenticated user attempts to create post and is found in acl.users  with role === read", () => {
        const user: IDiscussionsUser = { username: "Slughorn" };
        const channel = {
          acl: {
            users: {
              Slughorn: {
                role: "read",
              },
            },
          },
        } as any;

        expect(canPostToChannel(channel, user)).toBe(false);
      });

      it("returns false if user attempts to create post in a channel without user authorization", () => {
        const user: IDiscussionsUser = { username: "Slughorn" };
        const channel = {
          acl: {},
        } as any;

        expect(canPostToChannel(channel, user)).toBe(false);
      });
    });

    describe("authorization by group", () => {
      it("returns true if user is group member of acl.group with allowed roles", () => {
        ["readWrite", "write", "manage", "moderate", "owner"].forEach(
          (allowedRole) => {
            const channel = {
              acl: {
                groups: {
                  abc: {
                    member: {
                      role: allowedRole,
                    },
                  },
                },
              },
            } as any;

            ["owner", "admin", "member"].forEach((memberType) => {
              const user: IDiscussionsUser = {
                username: "Slughorn",
                groups: [
                  {
                    id: "abc",
                    userMembership: { memberType },
                    typeKeywords: [],
                  },
                ],
              } as any;

              expect(canPostToChannel(channel, user)).toBe(true);
            });
          }
        );
      });

      it("returns true if user is group owner/admin of acl.group with allowed roles", () => {
        ["readWrite", "write", "manage", "moderate", "owner"].forEach(
          (allowedRole) => {
            const channel = {
              acl: {
                groups: {
                  abc: {
                    admin: {
                      role: allowedRole,
                    },
                  },
                },
              },
            } as any;

            ["owner", "admin"].forEach((memberType) => {
              const user: IDiscussionsUser = {
                username: "Slughorn",
                groups: [
                  {
                    id: "abc",
                    userMembership: { memberType },
                    typeKeywords: [],
                  },
                ],
              } as any;

              expect(canPostToChannel(channel, user)).toBe(true);
            });
          }
        );
      });

      it("returns true if user is member acl.groups with allowed roles, and at least one group does NOT have typeKewords cannotDiscuss", () => {
        ["readWrite", "write", "manage", "moderate", "owner"].forEach(
          (allowedRole) => {
            const channel = {
              acl: {
                groups: {
                  abc: {
                    member: {
                      role: allowedRole,
                    },
                  },
                  def: {
                    member: {
                      role: allowedRole,
                    },
                  },
                },
              },
            } as any;

            ["owner", "admin", "member"].forEach((memberType) => {
              const user: IDiscussionsUser = {
                username: "Slughorn",
                groups: [
                  {
                    id: "abc",
                    userMembership: { memberType },
                    typeKeywords: ["cannotDiscuss"],
                  },
                  {
                    id: "def",
                    userMembership: { memberType },
                    typeKeywords: [],
                  },
                ],
              } as any;

              expect(canPostToChannel(channel, user)).toBe(true);
            });
          }
        );
      });

      it("returns false if user has group overlap with acl.groups with allowed roles, but typeKewords include cannotDiscuss", () => {
        ["readWrite", "write", "manage", "moderate", "owner"].forEach(
          (allowedRole) => {
            const channel = {
              acl: {
                groups: {
                  abc: {
                    member: { role: allowedRole },
                  },
                },
              },
            } as any;

            ["owner", "admin", "member"].forEach((memberType) => {
              const user: IDiscussionsUser = {
                username: "Slughorn",
                groups: [
                  {
                    id: "abc",
                    userMembership: { memberType },
                    typeKeywords: ["cannotDiscuss"],
                  },
                ],
              } as any;

              expect(canPostToChannel(channel, user)).toBe(false);
            });
          }
        );
      });

      it("returns false if user has group membership type admin that is not allowed", () => {
        const channel = {
          acl: {
            groups: {
              abc: {
                member: {
                  role: "read",
                },
              },
            },
          },
        } as any;

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

        expect(canPostToChannel(channel, user)).toBe(false);
      });

      it("returns false if group does not exist in acl", () => {
        const channel = {
          acl: {
            groups: {
              xyz: {
                admin: { role: "read" },
              },
            },
          },
        } as any;

        ["owner", "admin", "member"].forEach((memberType) => {
          const user: IDiscussionsUser = {
            username: "Slughorn",
            groups: [
              {
                id: "abc",
                userMembership: { memberType },
                typeKeywords: [],
              },
            ],
            typeKeywords: [],
          } as any;

          expect(canPostToChannel(channel, user)).toBe(false);
        });
      });
    });

    describe("authorization by org", () => {
      it("returns true if user is part of org in acl.orgs with allowed roles", () => {
        ["readWrite", "write", "manage", "moderate", "owner"].forEach(
          (allowedRole) => {
            const channel = {
              acl: {
                orgs: {
                  abc: {
                    admin: { role: allowedRole },
                  },
                },
              },
            } as any;

            const user: IDiscussionsUser = {
              username: "Slughorn",
              orgId: "abc",
              role: "org_admin",
            } as any;

            expect(canPostToChannel(channel, user)).toBe(true);
          }
        );
      });

      it("returns false if user is not part of org", () => {
        ["readWrite", "write", "manage", "moderate", "owner"].forEach(
          (allowedRole) => {
            const channel = {
              acl: {
                orgs: {
                  abc: {
                    role: allowedRole,
                  },
                },
              },
            } as any;

            const user: IDiscussionsUser = {
              username: "Slughorn",
              orgId: "xyz",
            } as any;

            expect(canPostToChannel(channel, user)).toBe(false);
          }
        );
      });

      it("returns false if org-role that matches user role does not have post writing privledge", () => {
        const channel = {
          acl: {
            orgs: {
              abc: {
                member: {
                  role: "read",
                },
              },
            },
          },
        } as any;

        const user: IDiscussionsUser = {
          username: "Slughorn",
          orgId: "abc",
          role: "org_member",
        } as any;

        expect(canPostToChannel(channel, user)).toBe(false);
      });
    });
  });

  describe("with channelAcl", () => {
    it("returns false if user logged in and channel permissions are empty", async () => {
      const user = buildUser();
      const channel = {
        channelAcl: [],
      } as any as IChannel;

      expect(canPostToChannel(channel, user)).toBe(false);
    });

    it("returns false if user not logged in and channel permissions are empty", async () => {
      const user = buildUser({ username: null });
      const channel = {
        channelAcl: [],
      } as any as IChannel;

      expect(canPostToChannel(channel, user)).toBe(false);
    });

    describe("any anonymous user channel permissions", () => {
      it(`returns true if anonymous permission defined and role is allowed`, () => {
        const user = buildUser({ username: null });

        ALLOWED_ROLES_FOR_POSTING.forEach((allowedRole) => {
          const channel = {
            channelAcl: [
              { category: AclCategory.ANONYMOUS_USER, role: allowedRole },
            ],
          } as IChannel;

          expect(canPostToChannel(channel, user)).toBe(true);
        });
      });

      it("returns false if anonymous permission defined but role is read", () => {
        const user = buildUser({ username: null });
        const channel = {
          channelAcl: [
            { category: AclCategory.ANONYMOUS_USER, role: Role.READ },
          ],
        } as IChannel;

        expect(canPostToChannel(channel, user)).toBe(false);
      });
    });

    describe("any authenticated user channel permissions", () => {
      it(`returns true if authenticated permission defined, user logged in, and role is allowed`, async () => {
        const user = buildUser();

        ALLOWED_ROLES_FOR_POSTING.forEach((allowedRole) => {
          const channel = {
            channelAcl: [
              { category: AclCategory.AUTHENTICATED_USER, role: allowedRole },
            ],
          } as IChannel;

          expect(canPostToChannel(channel, user)).toBe(true);
        });
      });

      it("returns false if authenticated permission defined, user logged in, and role is read", async () => {
        const user = buildUser();
        const channel = {
          channelAcl: [
            { category: AclCategory.AUTHENTICATED_USER, role: Role.READ },
          ],
        } as IChannel;

        expect(canPostToChannel(channel, user)).toBe(false);
      });

      it("returns false if authenticated permission defined and user is not logged in", async () => {
        const user = buildUser({ username: null });
        const channel = {
          channelAcl: [
            { category: AclCategory.AUTHENTICATED_USER, role: Role.READWRITE },
          ],
        } as IChannel;

        expect(canPostToChannel(channel, user)).toBe(false);
      });
    });

    describe("specific authenticated user channel permissions", () => {
      it("returns true if user is in permissions list and role is allowed", () => {
        const user = buildUser();

        ALLOWED_ROLES_FOR_POSTING.forEach((allowedRole) => {
          const channel = {
            channelAcl: [
              {
                category: AclCategory.USER,
                key: user.username,
                role: allowedRole,
              },
            ],
          } as IChannel;

          expect(canPostToChannel(channel, user)).toBe(true);
        });
      });

      it("returns false if user is in permissions list but role is read", () => {
        const user = buildUser();
        const channel = {
          channelAcl: [
            { category: AclCategory.USER, key: user.username, role: Role.READ },
          ],
        } as IChannel;

        expect(canPostToChannel(channel, user)).toBe(false);
      });
    });

    describe("group channel permissions", () => {
      it("returns true if user is group member in group permission list and role is allowed", async () => {
        ALLOWED_ROLES_FOR_POSTING.forEach((allowedRole) => {
          const channel = {
            channelAcl: [
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
            ],
          } as IChannel;

          ALLOWED_GROUP_ROLES.forEach((memberType) => {
            const user = buildUser({
              orgId: orgId1,
              groups: [buildGroup(groupId1, memberType)], // member in groupId1
            });

            expect(canPostToChannel(channel, user)).toBe(true);
          });
        });
      });

      it("returns false if user is group member in group permission list and role is NOT allowed", async () => {
        const user = buildUser(); // member in groupId1
        const channel = {
          channelAcl: [
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
          ],
        } as IChannel;

        expect(canPostToChannel(channel, user)).toBe(false);
      });

      it("returns false if user is group member in group permission list, role is allowed, but userMemberType is none", async () => {
        const user = buildUser({
          groups: [buildGroup(groupId1, "none")], // none in groupId1
        });
        const channel = {
          channelAcl: [
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
          ],
        } as IChannel;

        expect(canPostToChannel(channel, user)).toBe(false);
      });

      it("returns true if user is group owner/admin in group permission list and role is allowed", async () => {
        ALLOWED_ROLES_FOR_POSTING.forEach((allowedRole) => {
          const channel = {
            channelAcl: [
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
            ],
          } as IChannel;

          ["owner", "admin"].forEach((memberType) => {
            const user = buildUser({
              orgId: orgId1,
              groups: [buildGroup(groupId1, memberType)], // admin in groupId1
            });

            expect(canPostToChannel(channel, user)).toBe(true);
          });
        });
      });

      it("returns false if user is group owner/admin in group permission list and role is NOT allowed", async () => {
        const user = buildUser(); // admin in groupId2
        const channel = {
          channelAcl: [
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
          ],
        } as IChannel;

        expect(canPostToChannel(channel, user)).toBe(false);
      });

      it("returns true if user is group member of at least one group in permissions list that is discussable", async () => {
        const user = buildUser({
          orgId: orgId1,
          groups: [
            buildGroup(groupId1, "member"), // member in groupId1
            buildGroup(groupId2, "member", [CANNOT_DISCUSS]), // member in groupId2
          ],
        });
        const channel = {
          channelAcl: [
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
          ],
        } as IChannel;

        expect(canPostToChannel(channel, user)).toBe(true);
      });

      it("returns false if user is group member in permissions list but the group is not discussable", async () => {
        const user = buildUser({
          orgId: orgId1,
          groups: [
            buildGroup(groupId1, "member", [CANNOT_DISCUSS]), // member in groupId1
          ],
        });
        const channel = {
          channelAcl: [
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
          ],
        } as IChannel;

        expect(canPostToChannel(channel, user)).toBe(false);
      });

      it("returns false if user is group admin but group is not in permissions list", async () => {
        const user = buildUser({
          orgId: orgId1,
          groups: [
            buildGroup("unknownGroupId", "admin"), // member in unknownGroupId
          ],
        });
        const channel = {
          channelAcl: [
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
          ],
        } as IChannel;

        expect(canPostToChannel(channel, user)).toBe(false);
      });
    });

    describe("org channel permissions", () => {
      it("returns true if user is org member in permissions list and role is allowed", async () => {
        const user = buildUser();

        ALLOWED_ROLES_FOR_POSTING.forEach((allowedRole) => {
          const channel = {
            channelAcl: [
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
            ],
          } as IChannel;

          expect(canPostToChannel(channel, user)).toBe(true);
        });
      });

      it("returns true if user is org_admin in permissions list and role is allowed", async () => {
        const user = buildUser({ role: "org_admin" });

        ALLOWED_ROLES_FOR_POSTING.forEach((allowedRole) => {
          const channel = {
            channelAcl: [
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
                role: Role.READWRITE, // admin write
              },
            ],
          } as IChannel;

          expect(canPostToChannel(channel, user)).toBe(true);
        });
      });

      it("returns false if user is not in the org", async () => {
        const user = buildUser({ orgId: "unknownOrgId" });
        const channel = {
          channelAcl: [
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
          ],
        } as IChannel;

        expect(canPostToChannel(channel, user)).toBe(false);
      });
    });
  });

  describe("with legacy permissions", () => {
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
