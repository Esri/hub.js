import { IGroup } from "@esri/arcgis-rest-types";
import {
  ArcGISContextManager,
  getProp,
  getQueryContentConfig,
  IQuery,
  getPredicateValues,
} from "../../src";
import { MOCK_AUTH, MOCK_AUTH_QA } from "../mocks/mock-auth";
import { IPortal, IUser } from "@esri/arcgis-rest-portal";

const MOCK_PORTAL = {
  name: "DC R&D Center",
  id: "BRXFAKE",
  urlKey: "fake-org",
  portalProperties: {
    hub: {
      enabled: false,
    },
  },
} as unknown as IPortal;

describe("getQueryContentConfig:", () => {
  let licensedUserCtxMgr: ArcGISContextManager;
  let limitedUserCtxMgr: ArcGISContextManager;
  beforeEach(async () => {
    licensedUserCtxMgr = await ArcGISContextManager.create({
      authentication: MOCK_AUTH_QA,
      currentUser: {
        username: "casey",
        orgId: "BRXFAKE",
        privileges: ["portal:user:createItem", "portal:user:shareToGroup"],
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
    limitedUserCtxMgr = await ArcGISContextManager.create({
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
      portal: MOCK_PORTAL,
      portalUrl: "https://org.maps.arcgis.com",
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
              type: "document",
            },
          ],
        },
      ],
    };

    const chk = getQueryContentConfig(query, licensedUserCtxMgr.context);
    // console.log(JSON.stringify(chk, null, 2));
    expect(chk).toBeDefined();
    expect(chk.create).toBeDefined();
    expect(chk.upload).not.toBeDefined();
    expect(chk.existing).toBeDefined();

    if (chk.create) {
      const create = chk.create;
      expect(create.types).toEqual(["Hub Project"]);
      expect(Array.isArray(create.groups.owner)).toBeTruthy();
      expect(Array.isArray(create.groups.admin)).toBeTruthy();
      expect(Array.isArray(create.groups.member)).toBeTruthy();
      expect(create.groups.admin).toContain("group1");
      expect(create.groups.member).toContain("group2");
      expect(create.groups.owner).toEqual([]);
    } else {
      fail("missing .create");
    }

    if (chk.existing) {
      const existing = chk.existing;
      expect(existing.types).toEqual(["Hub Project", "document"]);

      // each of the queries should have the negated group predicates
      // and the type predicates
      ["mine", "myOrg", "world"].forEach((q) => {
        const qry = getProp(existing, q) as IQuery;
        expect(qry.targetEntity).toEqual(query.targetEntity);
        expect(hasNegatedGroupPredicate(qry, "group1")).toBe(
          true,
          `Query: ${q} should have negated group1`
        );
        expect(hasNegatedGroupPredicate(qry, "group2")).toBe(true);
        expect(hasNegatedGroupPredicate(qry, "group3")).toBe(true);

        expect(hasTypePredicate(qry, "Hub Project")).toBe(true);
        expect(hasTypePredicate(qry, "document")).toBe(true);
      });
      // specific checks for the mine query
      const mine = getProp(existing, "mine") as IQuery;
      expect(getPredicateValues("owner", mine).includes("casey")).toBe(true);
      const myOrg = getProp(existing, "myOrg") as IQuery;
      expect(getPredicateValues("orgid", myOrg).includes("BRXFAKE")).toBe(true);
      const world = getProp(existing, "world") as IQuery;
      expect(getPredicateValues("owner", world).includes("casey")).toBe(false);
      expect(getPredicateValues("orgid", world).includes("BRXFAKE")).toBe(
        false
      );
    } else {
      fail("missing .existing");
    }
  });

  describe("targetEntity=event:", () => {
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
      const chk = getQueryContentConfig(query, licensedUserCtxMgr.context);
      // console.log(JSON.stringify(chk, null, 2));
      expect(chk).toBeDefined();
      expect(chk.create).toBeDefined();
      expect(chk.upload).not.toBeDefined();
      expect(chk.existing).toBeDefined();
      if (chk.create) {
        const create = chk.create;
        expect(create.types).toEqual(["Event"]);
        expect(Array.isArray(create.groups.owner)).toBeTruthy();
        expect(Array.isArray(create.groups.admin)).toBeTruthy();
        expect(Array.isArray(create.groups.member)).toBeTruthy();
        expect(create.groups.admin).toContain("group1");
        expect(create.groups.member).toEqual([]);
        expect(create.groups.owner).toEqual([]);
      } else {
        fail("missing .create");
      }

      if (chk.existing) {
        const existing = chk.existing;
        expect(existing.types).toEqual(["Event"]);

        // each of the queries should have the negated group predicates
        // and the type predicates
        ["mine", "myOrg", "world"].forEach((q) => {
          const qry = getProp(existing, q) as IQuery;
          expect(qry.targetEntity).toEqual(query.targetEntity);
          expect(hasNegatedGroupPredicate(qry, "group1")).toBe(
            true,
            `Query: ${q} should have negated group1`
          );
          expect(qry.targetEntity).toBe("event");
        });
        // specific checks for the mine query
        const mine = getProp(existing, "mine") as IQuery;
        expect(getPredicateValues("owner", mine).includes("casey")).toBe(true);
        const myOrg = getProp(existing, "myOrg") as IQuery;
        expect(getPredicateValues("orgid", myOrg).includes("BRXFAKE")).toBe(
          true
        );
        const world = getProp(existing, "world") as IQuery;
        expect(getPredicateValues("owner", world).includes("casey")).toBe(
          false
        );
        expect(getPredicateValues("orgid", world).includes("BRXFAKE")).toBe(
          false
        );
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
      const chk = getQueryContentConfig(query, limitedUserCtxMgr.context);
      // console.log(JSON.stringify(chk, null, 2));
      expect(chk).toBeDefined();
      expect(chk.create).toBeDefined();
      expect(chk.upload).not.toBeDefined();
      expect(chk.existing).toBeDefined();
      if (chk.create) {
        const create = chk.create;
        expect(create.types).toEqual([]);
        expect(Array.isArray(create.groups.owner)).toBeTruthy();
        expect(Array.isArray(create.groups.admin)).toBeTruthy();
        expect(Array.isArray(create.groups.member)).toBeTruthy();
        expect(create.groups.admin).toEqual([]);
        expect(create.groups.member).toEqual([]);
        expect(create.groups.owner).toEqual([]);
      } else {
        fail("missing .create");
      }
    });
  });

  describe("corner cases:", () => {
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
        portal: MOCK_PORTAL,
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

      const chk = getQueryContentConfig(query, ctxMgr.context);
      expect(chk).toBeDefined();
      // everything should be empty
      expect(chk.create?.types).toEqual([]);
      expect(chk.existing?.types).toEqual([]);
      expect(chk.existing?.mine).toBeNull();
      expect(chk.existing?.myOrg).toBeNull();
      expect(chk.existing?.world).toBeNull();
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
        portal: MOCK_PORTAL,
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

      const chk = getQueryContentConfig(query, ctxMgr.context);
      expect(chk).toBeDefined();
      // everything should be empty
      expect(chk.create?.types).toEqual([]);
      expect(chk.existing?.types).toEqual([]);
      expect(chk.existing?.mine).toBeNull();
      expect(chk.existing?.myOrg).toBeNull();
      expect(chk.existing?.world).toBeNull();
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
        portal: MOCK_PORTAL,
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

      const chk = getQueryContentConfig(query, ctxMgr.context);
      expect(chk).toBeDefined();
      expect(chk.create?.types).toEqual([]);
      expect(chk.existing?.types).toEqual([]);
      expect(chk.existing?.mine).toBeNull();
      expect(chk.existing?.myOrg).toBeNull();
      expect(chk.existing?.world).toBeNull();
    });
    it("empty response for user without groups", async () => {
      const ctxMgr = await ArcGISContextManager.create({
        authentication: MOCK_AUTH,
        currentUser: {
          username: "luke",
          orgId: "BRXFAKE",
          privileges: ["portal:user:createItem"],
        } as unknown as IUser,
        portal: MOCK_PORTAL,
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

      const chk = getQueryContentConfig(query, ctxMgr.context);
      expect(chk).toBeDefined();
      expect(chk.create?.types).toEqual([]);
      expect(chk.existing?.types).toEqual([]);
      expect(chk.existing?.mine).toBeNull();
      expect(chk.existing?.myOrg).toBeNull();
      expect(chk.existing?.world).toBeNull();
    });
    it("empty response for type without config", async () => {
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
                memberType: "owner",
              },
            } as unknown as IGroup,
          ],
        } as unknown as IUser,
        portal: MOCK_PORTAL,
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

      const chk = getQueryContentConfig(query, ctxMgr.context);
      expect(chk).toBeDefined();
      expect(chk.create?.types).toEqual([]);
      expect(chk.existing?.types).toEqual([]);
      expect(chk.existing?.mine).toBeNull();
      expect(chk.existing?.myOrg).toBeNull();
      expect(chk.existing?.world).toBeNull();
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
