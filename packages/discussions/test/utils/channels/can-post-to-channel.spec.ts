import { IChannel } from "../../../src/channels";
import { IDiscussionsUser } from "../../../src/types";
import { canPostToChannel } from "../../../src/utils/channels/can-post-to-channel";

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
