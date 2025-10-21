import { IPortal, IUser } from "@esri/arcgis-rest-portal";
import { MOCK_AUTH } from "../mocks/mock-auth";
import * as GetPolicyModule from "../../src/permissions/HubPermissionPolicies";
import * as IsPermissionModule from "../../src/permissions/isPermission";
import { IPermissionPolicy } from "../../src/permissions/types/IPermissionPolicy";
import { Permission } from "../../src/permissions/types/Permission";
import { IUserHubSettings } from "../../src/utils/IUserHubSettings";
import { checkPermission } from "../../src/permissions/checkPermission";
import { IHubItemEntity } from "../../src/core/types/IHubItemEntity";
import { cloneObject } from "../../src/util";
import { describe, it, expect, beforeEach, vi } from "vitest";

const TestPermissionPolicies: IPermissionPolicy[] = [
  {
    permission: "hub:feature:workspace",
    dependencies: ["hub:gating:workspace:released"],
  },
  {
    permission: "hub:gating:workspace:released",
    availability: ["alpha"],
    environments: ["devext", "qaext", "production"],
  },
  {
    permission: "hub:gating:subscriptions:released",
  },
  {
    permission: "hub:feature:subscriptions",
    dependencies: ["hub:gating:subscriptions:released"],
  },
  {
    permission: "hub:project",
    services: ["portal"],
    licenses: ["hub-premium"],
  },
  {
    permission: "hub:project:create",
    authenticated: true,
    dependencies: ["hub:project"],
    privileges: ["portal:user:createItem"],
  },
  {
    permission: "hub:project:view",
    services: ["portal"],
  },
  {
    permission: "hub:project:edit",
    dependencies: ["hub:project"],
    authenticated: true,
    entityEdit: true,
  },
  {
    permission: "hub:project:events",
    dependencies: ["hub:project:view"],
    entityConfigurable: true,
  },
  {
    permission: "hub:project:content",
    dependencies: ["hub:project:edit"],
    entityConfigurable: true,
  },
  {
    permission: "hub:project:workspace",
    dependencies: ["hub:feature:workspace"],
  },
  {
    permission: "hub:project:workspace:dashboard",
    dependencies: ["hub:project:view"],
    availability: ["alpha"],
    environments: ["devext", "qaext"],
  },
  {
    permission: "hub:project:workspace:details",
    dependencies: ["hub:project:edit"],
    entityConfigurable: true,
  },
  {
    permission: "hub:project:workspace:hierarchy",
    dependencies: ["hub:project:workspace"],
    environments: ["devext"],
  },
  {
    permission: "hub:project:workspace:hierarchy2",
    dependencies: ["hub:project:workspace"],
  },
] as IPermissionPolicy[];

function getPermissionPolicy(permission: Permission): IPermissionPolicy {
  return TestPermissionPolicies.find(
    (p) => p.permission === permission
  ) as unknown as IPermissionPolicy;
}

function isPermission(permission: Permission): boolean {
  const permissions = TestPermissionPolicies.map((p) => p.permission);
  permissions.push("hub:missing:policy" as Permission);
  return permissions.includes(permission);
}

type ContextManagerType = {
  context: any;
};

function createMockContextManager(context: any): ContextManagerType {
  // Ensure tests are running with an authenticated context by default
  if (typeof context.isAuthenticated === "undefined") {
    context.isAuthenticated = true;
  }
  return { context };
}

describe("checkPermission:", () => {
  let basicCtxMgr: ContextManagerType;
  let gatingOptOutCtxMgr: ContextManagerType;
  let gatingOptInCtxMgr: ContextManagerType;
  let premiumCtxMgr: ContextManagerType;

  beforeEach(() => {
    vi.spyOn(GetPolicyModule, "getPermissionPolicy").mockImplementation(
      getPermissionPolicy
    );
    // isPermission is typed to a union of Permission strings; cast to any to satisfy vi.spyOn typing
    vi.spyOn(IsPermissionModule, "isPermission").mockImplementation(
      isPermission as any
    );

    basicCtxMgr = createMockContextManager({
      authentication: MOCK_AUTH,
      currentUser: {
        username: "casey",
        privileges: ["portal:user:createItem"],
      } as unknown as IUser,
      portal: {
        name: "DC R&D Center",
        id: "BRXFAKE",
        urlKey: "fake-org",
        portalProperties: {
          hub: {
            enabled: false,
          },
        },
      } as unknown as IPortal,
      portalUrl: "https://org.maps.arcgis.com",
      serviceStatus: { portal: "online" },
      hubLicense: "hub-basic",
      featureFlags: {
        "hub:project:workspace:details": true,
      },
    });
    gatingOptOutCtxMgr = createMockContextManager({
      authentication: MOCK_AUTH,
      currentUser: {
        username: "casey",
        privileges: ["portal:user:createItem"],
      } as unknown as IUser,
      portal: {
        name: "DC R&D Center",
        id: "BRXFAKE",
        urlKey: "fake-org",
        portalProperties: {
          hub: {
            enabled: false,
          },
        },
      } as unknown as IPortal,
      portalUrl: "https://org.maps.arcgis.com",
      serviceStatus: { portal: "online" },
      hubLicense: "hub-basic",
      featureFlags: {},
      userHubSettings: {
        features: {
          subscriptions: false,
        } as unknown as IUserHubSettings["features"],
        schemaVersion: 1.1,
        username: "casey",
      },
    });
    gatingOptInCtxMgr = createMockContextManager({
      authentication: MOCK_AUTH,
      currentUser: {
        username: "casey",
        privileges: ["portal:user:createItem"],
      } as unknown as IUser,
      portal: {
        name: "DC R&D Center",
        id: "BRXFAKE",
        urlKey: "fake-org",
        portalProperties: {
          hub: {
            enabled: false,
          },
        },
      } as unknown as IPortal,
      portalUrl: "https://org.maps.arcgis.com",
      serviceStatus: { portal: "online" },
      hubLicense: "hub-basic",
      featureFlags: {},
      userHubSettings: {
        features: {
          workspace: true,
        } as unknown as IUserHubSettings["features"],
        schemaVersion: 1.1,
        username: "casey",
      },
    });
    premiumCtxMgr = createMockContextManager({
      authentication: MOCK_AUTH,
      currentUser: {
        username: "casey",
        privileges: ["portal:user:createItem"],
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
      portalUrl: "https://org.maps.arcgis.com",
      serviceStatus: { portal: "online" },
      hubLicense: "hub-premium",
      featureFlags: {
        "hub:project:workspace:dashboard": true,
        "hub:project:workspace:details": false,
        "hub:project:content": true,
        "hub:feature:workspace": true,
      },
      userHubSettings: {
        features: {
          workspace: true,
        } as unknown as IUserHubSettings["features"],
        schemaVersion: 1.1,
        username: "casey",
      },
    });
  });
  // ...existing code...
  it("returns invalid permission if its invalid", () => {
    const chk = checkPermission(
      "foo:site:create" as Permission,
      basicCtxMgr.context,
      {
        label: "YAMMER",
      }
    );
    expect(chk.access).toBe(false);
    expect(chk.response).toBe("invalid-permission");
    expect(chk.checks.length).toBe(0);
  });
  it("fails for missing policy", () => {
    const chk = checkPermission(
      "hub:missing:policy" as Permission,
      basicCtxMgr.context
    );
    expect(chk.access).toBe(false);
    expect(chk.response).toBe("no-policy-exists");
    expect(chk.checks.length).toBe(0);
  });

  it("runs system level permission checks that all pass", () => {
    const chk = checkPermission("hub:project:create", premiumCtxMgr.context);
    expect(chk.access).toBe(true);
    expect(chk.response).toBe("granted");
    expect(chk.checks.length).toBe(4);
    expect(chk.checks[0].name).toBe("service portal online");
  });

  it("runs system level permission checks that fail", () => {
    const chk = checkPermission("hub:project:create", basicCtxMgr.context);
    expect(chk.access).toBe(false);
    expect(chk.response).toBe("not-licensed");
    expect(chk.checks.length).toBe(4);
  });

  it("gating returns true if no conditions are specified", () => {
    const chk = checkPermission(
      "hub:gating:subscriptions:released" as Permission,
      basicCtxMgr.context
    );
    expect(chk.access).toBe(true);
    const chk2 = checkPermission(
      "hub:feature:subscriptions" as Permission,
      basicCtxMgr.context
    );
    expect(chk2.access).toBe(true);
  });
  it("user can opt out ungated feature", () => {
    const chk = checkPermission(
      "hub:feature:subscriptions" as Permission,
      gatingOptOutCtxMgr.context
    );
    expect(chk.access).toBe(false);
  });
  it("user can opt into gated feature", () => {
    const chk = checkPermission(
      "hub:feature:workspace",
      gatingOptInCtxMgr.context
    );
    expect(chk.access).toBe(true);
  });

  describe("entity permissions: ", () => {
    it("runs entity level permission checks passing", () => {
      const entity = {
        canEdit: true,
        permissions: [
          {
            permission: "hub:project:edit",
            collaborationType: "user",
            collaborationId: "casey",
          },
        ],
      } as unknown as IHubItemEntity;
      const chk = checkPermission(
        "hub:project:edit",
        premiumCtxMgr.context,
        entity
      );
      expect(chk.access).toBe(true);
      expect(chk.response).toBe("granted");
      expect(chk.checks.length).toBe(5);
    });
    it("runs entity level checks on entity without permissions", () => {
      const entity = {
        canEdit: true,
      } as unknown as IHubItemEntity;
      const chk = checkPermission("hub:project:edit", premiumCtxMgr.context, {
        entity,
        label: "VADER",
      });
      expect(chk.access).toBe(true);
      expect(chk.response).toBe("granted");
      expect(chk.checks.length).toBe(4);
    });
    it("runs entity level permission checks failing", () => {
      const entity = {
        canEdit: true,
        permissions: [
          {
            permission: "hub:project:edit",
            collaborationType: "user",
            collaborationId: "john",
          },
        ],
      } as unknown as IHubItemEntity;
      const chk = checkPermission("hub:project:edit", premiumCtxMgr.context, {
        entity,
        label: "YODA",
      });
      expect(chk.access).toBe(false);
      expect(chk.response).toBe("not-granted");
      expect(chk.checks.length).toBe(5);
    });
  });

  describe("entity flags:", () => {
    it("non-configurable permission is ignored", () => {
      const entity = {
        canEdit: true,
        features: {
          "hub:project": true,
        },
      } as unknown as IHubItemEntity;
      const chk = checkPermission("hub:project", basicCtxMgr.context, entity);
      expect(chk.access).toBe(false);
      expect(chk.response).toBe("not-licensed");
      expect(chk.checks.length).toBe(2);
    });
    it("disabled denies access", () => {
      const entity = {
        canEdit: true,
        features: {
          "hub:project:events": false,
        },
      } as unknown as IHubItemEntity;
      const chk = checkPermission(
        "hub:project:events",
        premiumCtxMgr.context,
        entity
      );
      expect(chk.access).toBe(false);
      expect(chk.response).toBe("disabled-by-entity-flag");
      expect(chk.checks.length).toBe(1);
    });
    it("enabled entity flag runs all checks", () => {
      const entity = {
        canEdit: true,
        features: {
          "hub:project:events": true,
        },
      } as unknown as IHubItemEntity;

      const chk = checkPermission(
        "hub:project:events",
        premiumCtxMgr.context,
        entity
      );
      expect(chk.access).toBe(true);
      expect(chk.response).toBe("granted");
      expect(chk.checks.length).toBe(1);
    });
  });
  describe("feature flags:", () => {
    it("enabled feature flag overrides availability and env", () => {
      const chk = checkPermission(
        "hub:project:workspace:dashboard",
        premiumCtxMgr.context
      );

      expect(chk.access).toBe(true);
    });
    it("enabled feature flag does not override license", () => {
      const chk = checkPermission(
        "hub:project:workspace:details",
        basicCtxMgr.context
      );
      expect(chk.access).toBe(false);
      expect(chk.checks.length).toBe(4);
    });
    it("enabled feature flag does not override license with entity", () => {
      const entity = {
        canEdit: true,
      } as unknown as IHubItemEntity;
      const chk = checkPermission(
        "hub:project:workspace:details",
        basicCtxMgr.context,
        entity
      );

      expect(chk.access).toBe(false);
    });
    it("disabled feature flag denies access", () => {
      const chk = checkPermission(
        "hub:project:workspace:details",
        premiumCtxMgr.context
      );

      expect(chk.access).toBe(false);
    });
    it("permission dependencies respect flags", () => {
      const chk = checkPermission(
        "hub:project:workspace:hierarchy2" as Permission,
        premiumCtxMgr.context
      );
      expect(chk.access).toBe(true);
    });
    it("flags for dependencies do not override child conditions", () => {
      const chk = checkPermission(
        "hub:project:workspace:hierarchy" as Permission,
        premiumCtxMgr.context
      );

      expect(chk.access).toBe(false);
    });
    describe("override entity flags:", () => {
      it("ff enables feature disabled by entity", () => {
        const entity = {
          canEdit: true,
          features: {
            "hub:project:content": false,
          },
        } as unknown as IHubItemEntity;

        const chk = checkPermission(
          "hub:project:content",
          premiumCtxMgr.context,
          entity
        );
        expect(chk.access).toBe(true);
        expect(chk.response).toBe("granted");
        expect(chk.checks.length).toBe(4);
      });
    });
  });
  describe("user preferences", () => {
    it("enabled user feature flag overrides availability and env", () => {
      const localCtx = cloneObject(premiumCtxMgr.context);
      localCtx.userHubSettings = {
        schemaVersion: 1,
        features: {
          workspace: true,
          otherProp: true,
        } as unknown as IUserHubSettings["features"],
      };
      const chk = checkPermission("hub:feature:workspace", localCtx);

      expect(chk.access).toBe(true);
    });
    it("tolerates context without userHubSettings", () => {
      const localCtx = cloneObject(premiumCtxMgr.context);
      delete localCtx.userHubSettings;
      const chk = checkPermission("hub:feature:workspace", localCtx);
      expect(chk.access).toBe(false);
    });
  });
});
