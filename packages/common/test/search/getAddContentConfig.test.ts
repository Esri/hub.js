import { IGroup } from "@esri/arcgis-rest-types";
import {
  ArcGISContextManager,
  getAddContentConfig,
  IQuery,
  getPredicateValues,
  IHubCatalog,
} from "../../src";
import * as CheckPermissionModule from "../../src/permissions/checkPermission";
import {
  MOCK_AUTH,
  MOCK_AUTH_QA,
  MOCK_ENTERPRISE_AUTH,
} from "../mocks/mock-auth";
import { IPortal, IUser } from "@esri/arcgis-rest-portal";

const MOCK_HUB_BASIC_PORTAL = {
  name: "DC R&D Center",
  id: "BRXFAKE",
  urlKey: "fake-org",
  portalProperties: {
    hub: {
      enabled: false,
    },
  },
} as unknown as IPortal;

const MOCK_HUB_PREMIUM_PORTAL = {
  name: "DC R&D Center",
  id: "BRXFAKE",
  urlKey: "fake-org",
  portalProperties: {
    hub: {
      enabled: true,
    },
  },
} as unknown as IPortal;

describe("getAddContentConfig:", () => {
  let premiumUserCtxMgr: ArcGISContextManager;
  let basicUserCtxMgr: ArcGISContextManager;
  let noCreateUserCtxMgr: ArcGISContextManager;
  beforeEach(async () => {
    premiumUserCtxMgr = await ArcGISContextManager.create({
      authentication: MOCK_AUTH_QA,
      currentUser: {
        username: "casey",
        orgId: "BRXFAKE",
        privileges: [
          "portal:user:createItem",
          "portal:user:shareToGroup",
          "portal:user:createGroup",
        ],
        groups: [
          {
            id: "group1",
            isViewOnly: false,
            userMembership: {
              memberType: "admin",
            },
          } as unknown as IGroup,
          {
            id: "group2",
            isViewOnly: false,
            userMembership: {
              memberType: "member",
            },
          } as unknown as IGroup,
          {
            id: "group3",
            isViewOnly: true,
            userMembership: {
              memberType: "member",
            },
          } as unknown as IGroup,
        ],
      } as unknown as IUser,
      portal: {
        name: "DC R&D Center",
        id: "BRXFAKE",
        urlKey: "fake-org",
        portalProperties: {
          hub: {
            enabled: true,
          },
        },
      } as unknown as IPortal,
      portalUrl: "https://org.mapsqa.arcgis.com",
      properties: {
        alphaOrgs: ["BRXFAKE"],
      },
    });
    basicUserCtxMgr = await ArcGISContextManager.create({
      authentication: MOCK_AUTH,
      currentUser: {
        username: "luke",
        orgId: "BRXFAKE",
        privileges: ["portal:user:createItem"],
        groups: [
          {
            id: "group1",
            isViewOnly: false,
            userMembership: {
              memberType: "member",
            },
          } as unknown as IGroup,
          {
            id: "nomembershipGroup",
            isViewOnly: false,
          } as unknown as IGroup,
        ],
      } as unknown as IUser,
      portal: MOCK_HUB_BASIC_PORTAL,
      portalUrl: "https://org.maps.arcgis.com",
    });
    noCreateUserCtxMgr = await ArcGISContextManager.create({
      authentication: MOCK_ENTERPRISE_AUTH,
      currentUser: {
        username: "darth",
        orgId: "BRXFAKE",
        privileges: [],
        groups: [
          {
            id: "group1",
            isViewOnly: false,
            userMembership: {
              memberType: "member",
            },
          } as unknown as IGroup,
        ],
      } as unknown as IUser,
      portal: MOCK_HUB_BASIC_PORTAL,
      portalUrl: "https://my.enterprise.com",
    });
  });

  describe("no query or catalog:", () => {
    it("returns default create config", () => {
      const chk = getAddContentConfig(premiumUserCtxMgr.context);

      expect(chk).toBeDefined();
      expect(chk.state).toBe("enabled");
      expect(chk.create).toBeDefined();
      expect(chk.upload).toBeNull();
      expect(chk.existing).toBeDefined();
      expect(chk.create?.types.length).toBeGreaterThan(0);
      [
        "Discussion",
        "Event",
        "Hub Project",
        "Hub Initiative",
        "Hub Page",
        "Hub Site Application",
      ].forEach((t) => {
        expect(chk.create?.types).toContain(t);
      });
    });
    it("default disabled if user cant create", () => {
      const chk = getAddContentConfig(noCreateUserCtxMgr.context);

      // console.log(JSON.stringify(chk, null, 2));
      expect(chk).toBeDefined();
      expect(chk.state).toBe("disabled");
      expect(chk.reason).toBe("no-permission");
      expect(chk.create).toBeNull();
      expect(chk.upload).toBeNull();
      expect(chk.existing).toBeNull();
    });
  });

  describe("for query:", () => {
    describe("targetEntity=item:", () => {
      it("default config limited to item types", () => {
        const query: IQuery = {
          targetEntity: "item",
          filters: [
            {
              operation: "AND",
              predicates: [
                {
                  group: ["group1", "group2", "group3"],
                },
              ],
            },
          ],
        };

        const chk = getAddContentConfig(premiumUserCtxMgr.context, query);
        expect(chk).toBeDefined();
        expect(chk.create).toBeDefined();
        expect(chk.upload).toBeNull();
        expect(chk.existing).toBeDefined();
        [
          "Discussion",
          "Hub Project",
          "Hub Initiative",
          "Hub Page",
          "Hub Site Application",
        ].forEach((t) => {
          expect(chk.create?.types).toContain(t);
        });
      });
      it("returns content config for a query", () => {
        const query: IQuery = {
          targetEntity: "item",
          filters: [
            {
              operation: "AND",
              predicates: [
                {
                  group: ["group1", "group2", "group3"],
                },
              ],
            },
            {
              operation: "AND",
              predicates: [
                {
                  type: "Hub Project",
                },
                {
                  type: "$document",
                },
              ],
            },
          ],
        };

        const chk = getAddContentConfig(premiumUserCtxMgr.context, query);
        // console.log(JSON.stringify(chk, null, 2));
        expect(chk).toBeDefined();
        expect(chk.create).toBeDefined();
        expect(chk.upload).toBeNull();
        expect(chk.existing).toBeDefined();

        if (chk.create) {
          const create = chk.create;
          expect(create.types).toEqual(["Hub Project"]);
          expect(Array.isArray(create.groups?.owner)).toBeTruthy();
          expect(Array.isArray(create.groups?.admin)).toBeTruthy();
          expect(Array.isArray(create.groups?.member)).toBeTruthy();
          expect(create.groups?.admin).toContain("group1");
          expect(create.groups?.member).toContain("group2");
          expect(create.groups?.owner).toEqual([]);
        } else {
          fail("missing .create");
        }

        if (chk.existing) {
          const existing = chk.existing;
          expect(existing.types).toEqual(["Hub Project", "$document"]);

          // each of the queries should have the negated group predicates
          // and the type predicates

          const qry = existing.query;
          expect(qry.targetEntity).toEqual(query.targetEntity);
          expect(hasNegatedGroupPredicate(qry, "group1")).toBe(true);
          expect(hasNegatedGroupPredicate(qry, "group2")).toBe(true);
          expect(hasNegatedGroupPredicate(qry, "group3")).toBe(true);

          expect(hasTypePredicate(qry, "Hub Project")).toBe(true);
          expect(hasTypePredicate(qry, "$document")).toBe(true);
        } else {
          fail("missing .existing");
        }
      });
      it("empty response if user not in groups", async () => {
        const ctxMgr = await ArcGISContextManager.create({
          authentication: MOCK_AUTH,
          currentUser: {
            username: "luke",
            orgId: "BRXFAKE",
            privileges: ["portal:user:createItem"],
            groups: [
              {
                id: "group1",
                isViewOnly: false,
                userMembership: {
                  memberType: "member",
                },
              } as unknown as IGroup,
            ],
          } as unknown as IUser,
          portal: MOCK_HUB_BASIC_PORTAL,
          portalUrl: "https://org.maps.arcgis.com",
        });

        const query: IQuery = {
          targetEntity: "item",
          filters: [
            {
              operation: "AND",
              predicates: [
                {
                  group: ["group2"],
                },
              ],
            },
            {
              operation: "AND",
              predicates: [
                {
                  type: "$dashboard",
                },
              ],
            },
          ],
        };

        const chk = getAddContentConfig(ctxMgr.context, query);
        expect(chk).toBeDefined();
        // everything should be empty
        expect(chk.create).toBeNull();
        expect(chk.existing).toBeNull();
        expect(chk.state).toBe("disabled");
        expect(chk.reason).toBe("not-in-groups");
      });
      it("empty response if user cant share", async () => {
        const ctxMgr = await ArcGISContextManager.create({
          authentication: MOCK_AUTH,
          currentUser: {
            username: "luke",
            orgId: "BRXFAKE",
            privileges: ["portal:user:createItem"],
            groups: [
              {
                id: "group2",
                isViewOnly: false,
                userMembership: {
                  memberType: "member",
                },
              } as unknown as IGroup,
              {
                id: "nomembershipGroup",
                isViewOnly: false,
              } as unknown as IGroup,
            ],
          } as unknown as IUser,
          portal: MOCK_HUB_BASIC_PORTAL,
          portalUrl: "https://org.maps.arcgis.com",
        });

        const query: IQuery = {
          targetEntity: "item",
          filters: [
            {
              operation: "AND",
              predicates: [
                {
                  group: ["group2"],
                },
              ],
            },
            {
              operation: "AND",
              predicates: [
                {
                  type: "Layer Package",
                },
                {
                  type: "$dashboard",
                },
              ],
            },
          ],
        };

        const chk = getAddContentConfig(ctxMgr.context, query);
        expect(chk).toBeDefined();
        // everything should be empty
        expect(chk.create).toBeNull();
        expect(chk.existing).toBeNull();
        expect(chk.state).toBe("disabled");
        expect(chk.reason).toBe("no-permission");
      });
      it("empty response for group without membership", async () => {
        const ctxMgr = await ArcGISContextManager.create({
          authentication: MOCK_AUTH,
          currentUser: {
            username: "luke",
            orgId: "BRXFAKE",
            privileges: ["portal:user:createItem"],
            groups: [
              {
                id: "group2",
                isViewOnly: false,
              } as unknown as IGroup,
            ],
          } as unknown as IUser,
          portal: MOCK_HUB_BASIC_PORTAL,
          portalUrl: "https://org.maps.arcgis.com",
        });

        const query: IQuery = {
          targetEntity: "item",
          filters: [
            {
              operation: "AND",
              predicates: [
                {
                  group: ["group2"],
                },
              ],
            },
            {
              operation: "AND",
              predicates: [
                {
                  type: "Layer Package",
                },
                {
                  type: "$dashboard",
                },
              ],
            },
          ],
        };

        const chk = getAddContentConfig(ctxMgr.context, query);
        expect(chk).toBeDefined();
        expect(chk.create).toBeNull();
        expect(chk.existing).toBeNull();
        expect(chk.state).toBe("disabled");
        expect(chk.reason).toBe("not-in-groups");
      });
      it("empty response for user without groups", async () => {
        const ctxMgr = await ArcGISContextManager.create({
          authentication: MOCK_AUTH,
          currentUser: {
            username: "luke",
            orgId: "BRXFAKE",
            privileges: ["portal:user:createItem", "portal:user:shareToGroup"],
          } as unknown as IUser,
          portal: MOCK_HUB_BASIC_PORTAL,
          portalUrl: "https://org.maps.arcgis.com",
        });

        const query: IQuery = {
          targetEntity: "item",
          filters: [
            {
              operation: "AND",
              predicates: [
                {
                  group: ["group2"],
                },
              ],
            },
            {
              operation: "AND",
              predicates: [
                {
                  type: "Layer Package",
                },
                {
                  type: "$dashboard",
                },
              ],
            },
          ],
        };

        const chk = getAddContentConfig(ctxMgr.context, query);
        expect(chk).toBeDefined();
        expect(chk.create).toBeNull();
        expect(chk.existing).toBeNull();
        expect(chk.state).toBe("disabled");
        expect(chk.reason).toBe("not-in-groups");
      });
      describe("default responses:", () => {
        it("default Hub Basic response for query ", async () => {
          const ctxMgr = await ArcGISContextManager.create({
            authentication: MOCK_AUTH,
            currentUser: {
              username: "luke",
              orgId: "BRXFAKE",
              privileges: [
                "portal:user:createItem",
                "portal:user:shareToGroup",
              ],
              groups: [
                {
                  id: "group2",
                  isViewOnly: false,
                  userMembership: {
                    memberType: "owner",
                  },
                } as unknown as IGroup,
              ],
            } as unknown as IUser,
            portal: MOCK_HUB_BASIC_PORTAL,
            portalUrl: "https://org.maps.arcgis.com",
          });

          const query: IQuery = {
            targetEntity: "item",
            filters: [
              {
                operation: "AND",
                predicates: [
                  {
                    group: ["group2"],
                  },
                ],
              },
              {
                operation: "AND",
                predicates: [
                  {
                    type: "Layer Package",
                  },
                ],
              },
            ],
          };

          const chk = getAddContentConfig(ctxMgr.context, query);
          expect(chk).toBeDefined();
          expect(chk.create).toBeNull();
          expect(chk.existing?.types).toEqual(["Layer Package"]);
          expect(chk.existing?.groups?.owner).toEqual(["group2"]);
        });
        it("default response for query without group", async () => {
          const ctxMgr = await ArcGISContextManager.create({
            authentication: MOCK_AUTH,
            currentUser: {
              username: "luke",
              orgId: "BRXFAKE",
              privileges: [
                "portal:user:createItem",
                "portal:user:shareToGroup",
              ],
              groups: [
                {
                  id: "group2",
                  isViewOnly: false,
                  userMembership: {
                    memberType: "owner",
                  },
                } as unknown as IGroup,
              ],
            } as unknown as IUser,
            portal: MOCK_HUB_BASIC_PORTAL,
            portalUrl: "https://org.maps.arcgis.com",
          });

          const query: IQuery = {
            targetEntity: "item",
            filters: [
              {
                operation: "AND",
                predicates: [
                  {
                    type: "Hub Site Application",
                  },
                ],
              },
            ],
          };

          const chk = getAddContentConfig(ctxMgr.context, query);
          expect(chk).toBeDefined();
          expect(chk.state).toBe("enabled");
          expect(chk.create).toBeDefined();
          expect(chk.existing).toBeNull();
          expect(chk.create?.types).toEqual(["Hub Site Application"]);
          expect(chk.create?.groups?.owner).toEqual(["group2"]);
        });
        it("default Hub Premium response for query without types", async () => {
          const ctxMgr = await ArcGISContextManager.create({
            authentication: MOCK_AUTH_QA,
            currentUser: {
              username: "luke",
              orgId: "BRXFAKE",
              privileges: [
                "portal:user:createItem",
                "portal:user:shareToGroup",
              ],
              groups: [
                {
                  id: "group2",
                  isViewOnly: false,
                  userMembership: {
                    memberType: "owner",
                  },
                } as unknown as IGroup,
              ],
            } as unknown as IUser,
            portal: MOCK_HUB_PREMIUM_PORTAL,
            portalUrl: "https://org.maps.arcgis.com",
          });

          const query: IQuery = {
            targetEntity: "item",
            filters: [
              {
                operation: "AND",
                predicates: [
                  {
                    group: ["group2"],
                  },
                ],
              },
              {
                operation: "AND",
                predicates: [
                  {
                    tag: "Production",
                  },
                ],
              },
            ],
          };

          const chk = getAddContentConfig(ctxMgr.context, query);
          expect(chk).toBeDefined();
          expect(chk.create?.types.length).toEqual(5);
          expect(chk.create?.types).toContain("Hub Site Application");
          expect(chk.create?.types).toContain("Hub Page");
          expect(chk.create?.types).toContain("Hub Project");
          expect(chk.create?.types).toContain("Hub Initiative");
          expect(chk.create?.types).toContain("Discussion");
          expect(chk.existing?.types.length).toEqual(5);
          expect(chk.existing?.types).toContain("Hub Site Application");
          expect(chk.existing?.types).toContain("Hub Page");
          expect(chk.existing?.types).toContain("Hub Project");
          expect(chk.existing?.types).toContain("Hub Initiative");
          expect(chk.existing?.types).toContain("Discussion");
        });
        it("default Enterprise response for query without types", async () => {
          const ctxMgr = await ArcGISContextManager.create({
            authentication: MOCK_ENTERPRISE_AUTH,
            currentUser: {
              username: "luke",
              orgId: "BRXFAKE",
              privileges: [
                "portal:user:createItem",
                "portal:user:shareToGroup",
              ],
              groups: [
                {
                  id: "group2",
                  isViewOnly: false,
                  userMembership: {
                    memberType: "owner",
                  },
                } as unknown as IGroup,
              ],
            } as unknown as IUser,
            portal: MOCK_HUB_BASIC_PORTAL,
            portalUrl: "https://org.maps.arcgis.com",
          });

          const query: IQuery = {
            targetEntity: "item",
            filters: [
              {
                operation: "AND",
                predicates: [
                  {
                    group: ["group2"],
                  },
                ],
              },
              {
                operation: "AND",
                predicates: [
                  {
                    tag: "Production",
                  },
                ],
              },
            ],
          };

          const chk = getAddContentConfig(ctxMgr.context, query);
          expect(chk).toBeDefined();
          expect(chk.create?.types.length).toEqual(2);
          expect(chk.create?.types).toEqual(["Site Page", "Site Application"]);
          expect(chk.existing?.types.length).toEqual(2);
          expect(chk.existing?.types).toEqual([
            "Site Page",
            "Site Application",
          ]);
        });
      });
    });

    describe("targetEntity=event:", () => {
      it("default config limited to event", () => {
        const query: IQuery = {
          targetEntity: "event",
          filters: [
            {
              operation: "AND",
              predicates: [
                {
                  group: ["group1", "group2", "group3"],
                },
              ],
            },
          ],
        };

        const chk = getAddContentConfig(premiumUserCtxMgr.context, query);
        expect(chk).toBeDefined();
        expect(chk.create).toBeDefined();
        expect(chk.upload).toBeNull();
        expect(chk.existing).toBeDefined();
        ["Event"].forEach((t) => {
          expect(chk.create?.types).toContain(t);
        });
      });
      it("user with permission to create", () => {
        const query: IQuery = {
          targetEntity: "event",
          filters: [
            {
              operation: "AND",
              predicates: [
                {
                  group: ["group1"],
                },
              ],
            },
          ],
        };
        const chk = getAddContentConfig(premiumUserCtxMgr.context, query);
        // console.log(JSON.stringify(chk, null, 2));
        expect(chk).toBeDefined();
        expect(chk.state).toBe("enabled");
        expect(chk.create).toBeDefined();
        expect(chk.upload).toBeNull();
        expect(chk.existing).toBeDefined();
        if (chk.create) {
          const create = chk.create;
          expect(create.types).toEqual(["Event"]);
          expect(Array.isArray(create.groups?.owner)).toBeTruthy();
          expect(Array.isArray(create.groups?.admin)).toBeTruthy();
          expect(Array.isArray(create.groups?.member)).toBeTruthy();
          expect(create.groups?.admin).toContain("group1");
          expect(create.groups?.member).toEqual([]);
          expect(create.groups?.owner).toEqual([]);
        } else {
          fail("missing .create");
        }

        if (chk.existing) {
          const existing = chk.existing;
          expect(existing.types).toEqual(["Event"]);

          // each of the queries should have the negated group predicates
          // and the type predicates

          const qry = existing.query;
          expect(qry.targetEntity).toEqual(query.targetEntity);
          expect(hasNegatedGroupPredicate(qry, "group1")).toBe(
            true,
            `Query: existing should have negated group1`
          );
          expect(qry.targetEntity).toBe("event");
        } else {
          fail("missing .existing");
        }
      });
      it("user without permission to create", () => {
        const query: IQuery = {
          targetEntity: "event",
          filters: [
            {
              operation: "AND",
              predicates: [
                {
                  group: ["group1"],
                },
              ],
            },
          ],
        };
        const chk = getAddContentConfig(basicUserCtxMgr.context, query);
        // console.log(JSON.stringify(chk, null, 2));
        expect(chk).toBeDefined();

        expect(chk.state).toBe("enabled");
        expect(chk.create).toBeNull();
        expect(chk.upload).toBeNull();
        expect(chk.existing).toBeDefined();
        if (chk.existing) {
          const existing = chk.existing;
          // expect(existing.targetEntity).toEqual("event");
          expect(existing.types).toEqual(["Event"]);
          expect(existing.groups?.admin).toEqual([]);
          expect(existing.groups?.member).toEqual(["group1"]);
          expect(existing.groups?.owner).toEqual([]);
        } else {
          fail("missing .create");
        }
      });
      it("returns empty response if not in groups", () => {
        const query: IQuery = {
          targetEntity: "event",
          filters: [
            {
              operation: "AND",
              predicates: [
                {
                  group: ["group11"],
                },
              ],
            },
          ],
        };
        const chk = getAddContentConfig(basicUserCtxMgr.context, query);
        // console.log(JSON.stringify(chk, null, 2));
        expect(chk).toBeDefined();

        expect(chk.state).toBe("disabled");
        expect(chk.reason).toBe("not-in-groups");
        expect(chk.create).toBeNull();
        expect(chk.upload).toBeNull();
        expect(chk.existing).toBeNull();
      });
    });

    describe("targetEntity=group:", () => {
      it("user can create group", () => {
        const query: IQuery = {
          targetEntity: "group",
          filters: [],
        };
        const chk = getAddContentConfig(premiumUserCtxMgr.context, query);
        expect(chk).toBeDefined();
        expect(chk.state).toBe("enabled");
        expect(chk.create).toBeDefined();
        expect(chk.upload).toBeNull();
        expect(chk.existing).toBeNull();
      });
      it("user can not create group", () => {
        const query: IQuery = {
          targetEntity: "group",
          filters: [],
        };
        const chk = getAddContentConfig(noCreateUserCtxMgr.context, query);
        expect(chk).toBeDefined();
        expect(chk.state).toBe("disabled");
        expect(chk.reason).toBe("no-permission");
        expect(chk.create).toBeDefined();
        expect(chk.upload).toBeNull();
        expect(chk.existing).toBeNull();
      });
      it("user has too many groups", () => {
        spyOn(CheckPermissionModule, "checkPermission").and.returnValue({
          access: false,
          response: "assertion-failed",
        });
        const query: IQuery = {
          targetEntity: "group",
          filters: [],
        };
        const chk = getAddContentConfig(premiumUserCtxMgr.context, query);
        expect(chk).toBeDefined();
        expect(chk.state).toBe("disabled");
        expect(chk.reason).toBe("too-many-groups");
      });
    });

    describe("unsupported targetEntity ", () => {
      it("returns empty response", () => {
        const query: IQuery = {
          targetEntity: "user",
          filters: [
            {
              operation: "AND",
              predicates: [
                {
                  group: ["group1"],
                },
              ],
            },
          ],
        };
        const chk = getAddContentConfig(premiumUserCtxMgr.context, query);
        expect(chk).toBeDefined();
        expect(chk.state).toBe("disabled");
        expect(chk.reason).toBe("unsupported-target-entity");
        expect(chk.create).toBeNull();
        expect(chk.upload).toBeNull();
        expect(chk.existing).toBeNull();
      });
    });
  });

  describe("for catalog:", () => {
    it("returns catalog groups with default types", () => {
      const catalog: IHubCatalog = {
        title: "DC R&D Center",
        schemaVersion: 1,
        scopes: {
          item: {
            targetEntity: "item",
            filters: [
              { predicates: [{ group: ["group1", "group2", "group3"] }] },
            ],
          },
          event: {
            targetEntity: "event",
            filters: [{ predicates: [{ group: "group1" }] }],
          },
        },
        collections: [
          {
            key: "collection1",
            label: "Collection 1",
            targetEntity: "item",
            scope: {
              targetEntity: "item",
              filters: [{ predicates: [{ type: "Hub Project" }] }],
            },
          },
        ],
      };

      const chk = getAddContentConfig(premiumUserCtxMgr.context, catalog);
      expect(chk).toBeDefined();
      // console.log(JSON.stringify(chk, null, 2));
      expect(chk.state).toBe("enabled");
      expect(chk.create).toBeDefined();
      expect(chk.upload).toBeNull();
      expect(chk.existing).toBeNull();
      [
        "Hub Project",
        "Hub Initiative",
        "Discussion",
        "Hub Site Application",
        "Hub Page",
        "Event",
      ].forEach((t) => {
        expect(chk.create?.types).toContain(t);
      });
      expect(chk.create?.groups?.admin).toContain("group1");
      expect(chk.create?.groups?.member).toContain("group2");
      expect(chk.create?.groups?.owner).toEqual([]);
    });
    it("returns empty response if not in the groups", () => {
      const catalog: IHubCatalog = {
        title: "DC R&D Center",
        schemaVersion: 1,
        scopes: {
          item: {
            targetEntity: "item",
            filters: [
              { predicates: [{ group: ["group11", "group21", "group31"] }] },
            ],
          },
          event: {
            targetEntity: "event",
            filters: [{ predicates: [{ group: "group11" }] }],
          },
        },
        collections: [
          {
            key: "collection1",
            label: "Collection 1",
            targetEntity: "item",
            scope: {
              targetEntity: "item",
              filters: [{ predicates: [{ type: "Hub Project" }] }],
            },
          },
        ],
      };

      const chk = getAddContentConfig(premiumUserCtxMgr.context, catalog);
      expect(chk).toBeDefined();
      // console.log(JSON.stringify(chk, null, 2));
      expect(chk.state).toBe("disabled");
      expect(chk.reason).toBe("not-in-groups");
      expect(chk.upload).toBeNull();
      expect(chk.create).toBeNull();
      expect(chk.existing).toBeNull();
    });
    it("returns empty response if cant create", () => {
      const catalog: IHubCatalog = {
        title: "DC R&D Center",
        schemaVersion: 1,
        scopes: {
          item: {
            targetEntity: "item",
            filters: [
              { predicates: [{ group: ["group1", "group2", "group3"] }] },
            ],
          },
          event: {
            targetEntity: "event",
            filters: [{ predicates: [{ group: "group1" }] }],
          },
        },
        collections: [
          {
            key: "collection1",
            label: "Collection 1",
            targetEntity: "item",
            scope: {
              targetEntity: "item",
              filters: [{ predicates: [{ type: "Hub Project" }] }],
            },
          },
        ],
      };

      const chk = getAddContentConfig(noCreateUserCtxMgr.context, catalog);
      expect(chk).toBeDefined();
      // console.log(JSON.stringify(chk, null, 2));
      expect(chk.state).toBe("disabled");
      expect(chk.reason).toBe("no-permission");
      expect(chk.upload).toBeNull();
      expect(chk.create).toBeNull();
      expect(chk.existing).toBeNull();
    });
  });
  describe("for invalid object:", () => {
    it("returns empty config", () => {
      const chk = getAddContentConfig(premiumUserCtxMgr.context, {
        other: "object",
      } as unknown as IQuery);
      expect(chk).toBeDefined();
      expect(chk.state).toBe("disabled");
      expect(chk.reason).toBe("invalid-object");
    });
  });
});

function hasTypePredicate(query: IQuery, type: string): boolean {
  const vals = getPredicateValues("type", query);

  return vals.includes(type);
}

function hasNegatedGroupPredicate(query: IQuery, group: string): boolean {
  const vals = getPredicateValues("group", query, ["not"]);

  return vals.includes(group);
}
