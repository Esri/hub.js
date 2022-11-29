import { IPortal, IUser } from "@esri/arcgis-rest-portal";
import { IEntityPermissionPolicy } from "../../../src";
import { ArcGISContextManager } from "../../../src/ArcGISContextManager";
import { checkEntityPolicy } from "../../../src/permissions/_internal/checkEntityPolicy";
import { MOCK_AUTH } from "../../mocks/mock-auth";

describe("checkEntityPolicy:", () => {
  let authdCtxMgr: ArcGISContextManager;

  beforeEach(async () => {
    // When we pass in all this information, the context
    // manager will not try to fetch anything, so no need
    // to mock those calls
    authdCtxMgr = await ArcGISContextManager.create({
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
        ],
      } as unknown as IUser,
      portal: {
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
    });
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
        collaborationId: "group3",
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
        collaborationId: "group3",
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
});
