import {
  describe,
  it,
  expect,
  beforeEach,
} from "vitest";
import { IPortal, IUser } from "@esri/arcgis-rest-portal";
import { ArcGISContextManager } from "../../../src/ArcGISContextManager";
import { checkEntityPolicy } from "../../../src/permissions/_internal/checkEntityPolicy";
import { MOCK_AUTH, createMockContext } from "../../mocks/mock-auth";
import { IEntityPermissionPolicy } from "../../../src/permissions/types/IEntityPermissionPolicy";
import { IArcGISContext } from "../../../src/types/IArcGISContext";

describe("checkEntityPolicy:", () => {
  let authdCtxMgr: ArcGISContextManager;

  beforeEach(async () => {
    // When we pass in all this information, the context
    // manager will not try to fetch anything, so no need
    // to mock those calls
    authdCtxMgr = {
      context: createMockContext({
        authentication: MOCK_AUTH,
        currentUser: {
          username: "casey",
          orgId: "BRXFAKE",
          privileges: ["portal:user:createItem"],
          groups: [
            {
              id: "group1",
              userMembership: { memberType: "admin" },
            },
            {
              id: "group2",
              userMembership: { memberType: "member" },
            },
            {
              id: "group3",
              userMembership: { memberType: "owner" },
            },
          ],
        } as unknown as IUser,
        portalSelf: {
          name: "DC R&D Center",
          id: "BRXFAKE",
          urlKey: "fake-org",
          properties: {
            hub: {
              enabled: false,
            },
          },
        } as unknown as IPortal,
        portalUrl: "https://org.maps.arcgis.com",
      }),
    } as unknown as ArcGISContextManager;
  });
  describe("user checks:", () => {
    it("grants if user matches", () => {
      const policy: IEntityPermissionPolicy = {
        permission: "hub:site:edit",
        collaborationType: "user",
        collaborationId: "casey",
      };
      const chk = checkEntityPolicy(policy, authdCtxMgr.context);
      expect(chk.response).toBe("granted");
    });

    it("denies if user does not match", () => {
      const policy: IEntityPermissionPolicy = {
        permission: "hub:site:edit",
        collaborationType: "user",
        collaborationId: "luke",
      };
      const chk = checkEntityPolicy(policy, authdCtxMgr.context);
      expect(chk.response).toBe("not-granted");
    });
  });

  describe("group checks:", () => {
    it("grants if user in group", () => {
      const policy: IEntityPermissionPolicy = {
        permission: "hub:site:edit",
        collaborationType: "group",
        collaborationId: "group1",
      };
      const chk = checkEntityPolicy(policy, authdCtxMgr.context);
      expect(chk.response).toBe("granted");
    });
    it("denies if user not in group", () => {
      const policy: IEntityPermissionPolicy = {
        permission: "hub:site:edit",
        collaborationType: "group",
        collaborationId: "group4",
      };
      const chk = checkEntityPolicy(policy, authdCtxMgr.context);
      expect(chk.response).toBe("not-group-member");
    });
  });

  describe("group-admin checks:", () => {
    it("grants if user is admin in group", () => {
      const policy: IEntityPermissionPolicy = {
        permission: "hub:site:edit",
        collaborationType: "group-admin",
        collaborationId: "group1",
      };
      const chk = checkEntityPolicy(policy, authdCtxMgr.context);
      expect(chk.response).toBe("granted");
    });
    it("grants if user is admin in group", () => {
      const policy: IEntityPermissionPolicy = {
        permission: "hub:site:edit",
        collaborationType: "group-admin",
        collaborationId: "group3",
      };
      const chk = checkEntityPolicy(policy, authdCtxMgr.context);
      expect(chk.response).toBe("granted");
    });
    it("denies if user is just member in group", () => {
      const policy: IEntityPermissionPolicy = {
        permission: "hub:site:edit",
        collaborationType: "group-admin",
        collaborationId: "group2",
      };
      const chk = checkEntityPolicy(policy, authdCtxMgr.context);
      expect(chk.response).toBe("not-group-admin");
    });
    it("denies if user not in group", () => {
      const policy: IEntityPermissionPolicy = {
        permission: "hub:site:edit",
        collaborationType: "group-admin",
        collaborationId: "group4",
      };
      const chk = checkEntityPolicy(policy, authdCtxMgr.context);
      expect(chk.response).toBe("not-group-admin");
    });
    it("denies if user does not have groups", () => {
      const policy: IEntityPermissionPolicy = {
        permission: "hub:site:edit",
        collaborationType: "group-admin",
        collaborationId: "group3",
      };
      const ctx = authdCtxMgr.context;
      delete ctx.currentUser.groups;
      const chk = checkEntityPolicy(policy, authdCtxMgr.context);
      expect(chk.response).toBe("not-group-admin");
    });
  });

  describe("org checks:", () => {
    it("grants if user in org", () => {
      const policy: IEntityPermissionPolicy = {
        permission: "hub:site:edit",
        collaborationType: "org",
        collaborationId: "BRXFAKE",
      };
      const chk = checkEntityPolicy(policy, authdCtxMgr.context);
      expect(chk.response).toBe("granted");
    });
    it("denies if user not in org", () => {
      const policy: IEntityPermissionPolicy = {
        permission: "hub:site:edit",
        collaborationType: "org",
        collaborationId: "OTHERORG",
      };
      const chk = checkEntityPolicy(policy, authdCtxMgr.context);
      expect(chk.response).toBe("not-org-member");
    });
  });
  describe("authenticated and anao checks", () => {
    it("if type anonymous always grant", () => {
      const policy: IEntityPermissionPolicy = {
        permission: "hub:site:edit",
        collaborationType: "anonymous",
        collaborationId: "not-used",
      };
      const chk = checkEntityPolicy(policy, authdCtxMgr.context);
      expect(chk.response).toBe("granted");
    });
    it("if type authenticated grant if authenticated", () => {
      const policy: IEntityPermissionPolicy = {
        permission: "hub:site:edit",
        collaborationType: "authenticated",
        collaborationId: "not-used",
      };
      const chk = checkEntityPolicy(policy, authdCtxMgr.context);
      expect(chk.response).toBe("granted");
    });
    it("if type authenticated reject if not authenticated", () => {
      const policy: IEntityPermissionPolicy = {
        permission: "hub:site:edit",
        collaborationType: "authenticated",
        collaborationId: "not-used",
      };
      const ctx = {
        isAuthenticated: false,
      } as unknown as IArcGISContext;
      const chk = checkEntityPolicy(policy, ctx);
      expect(chk.response).toBe("not-authenticated");
    });
  });
});
