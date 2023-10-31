import { IPortal, IUser } from "@esri/arcgis-rest-portal";
import { ArcGISContextManager } from "../../src/ArcGISContextManager";
import { checkPermission, IHubItemEntity, Permission } from "../../src";
import { MOCK_AUTH } from "../mocks/mock-auth";
import { IPermissionPolicy } from "../../dist/types/permissions/types/IPermissionPolicy";
import * as GetPolicyModule from "../../src/permissions/HubPermissionPolicies";
import * as IsPermissionModule from "../../src/permissions/types/Permission";
// In order to have stable tests over time, we define some policies just
// for the purposes of testing. We then spy on getPermissionPolicy
// and use these test-only structures instead of current businessrules

// NOTE: The `permission` MUST BE VALID

// THIS USES PROJECT PERMISSIONS BUT THE POLICIES ARE JUST FOR TESTING
const TestPermissionPolicies: IPermissionPolicy[] = [
  {
    permission: "hub:feature:workspace",
    availability: ["alpha"],
    environments: ["devext", "qaext"],
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
    // Anyone can view a project
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
  // More permissions that can be used to create more test scenarios
  // {
  //   permission: "hub:project:workspace:settings",
  //   dependencies: ["hub:project:edit"],
  //   entityOwner: true,
  // },
  // {
  //   permission: "hub:project:workspace:collaborators",
  //   dependencies: ["hub:project:edit"],
  // },
  // {
  //   permission: "hub:project:workspace:content",
  //   dependencies: ["hub:project:edit"],
  // },
  // {
  //   permission: "hub:project:workspace:metrics",
  //   dependencies: ["hub:project:edit"],
  // },
];

/**
 * FAKE IMPLEMENTATION SO WE DON'T TIE TESTS TO REAL PERMISSIONS
 * @param permission
 * @returns
 */
function getPermissionPolicy(permission: Permission): IPermissionPolicy {
  return TestPermissionPolicies.find(
    (p) => p.permission === permission
  ) as unknown as IPermissionPolicy;
}

function isPermission(permission: Permission): boolean {
  const permissions = TestPermissionPolicies.map((p) => p.permission);
  // Add one to flex a missing policy condition
  permissions.push("hub:missing:policy");
  return permissions.includes(permission);
}

describe("checkPermission:", () => {
  let basicCtxMgr: ArcGISContextManager;
  let premiumCtxMgr: ArcGISContextManager;
  let consoleInfoSpy: jasmine.Spy;
  let consoleDirSpy: jasmine.Spy;
  beforeEach(async () => {
    // tslint:disable-next-line: no-empty
    consoleInfoSpy = spyOn(console, "info").and.callFake(() => {}); // suppress console output
    // tslint:disable-next-line: no-empty
    consoleDirSpy = spyOn(console, "dir").and.callFake(() => {}); // suppress console output
    spyOn(GetPolicyModule, "getPermissionPolicy").and.callFake(
      getPermissionPolicy
    );
    spyOn(IsPermissionModule, "isPermission").and.callFake(isPermission);
    // unauthdCtxMgr = await ArcGISContextManager.create();
    // When we pass in all this information, the context
    // manager will not try to fetch anything, so no need
    // to mock those calls
    basicCtxMgr = await ArcGISContextManager.create({
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
      featureFlags: {
        // will not grant access b/c license is basic
        "hub:project:workspace:details": true,
      },
    });
    premiumCtxMgr = await ArcGISContextManager.create({
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
      featureFlags: {
        // will override alpha + qa
        "hub:project:workspace:dashboard": true,
        // forces details to be unavailable
        "hub:project:workspace:details": false,
        // force content to be enabled, even if entity turned it off
        "hub:project:content": true,
        // enable hub:project:workspace:hiearchy by enabling hub:feature:workspace
        "hub:feature:workspace": true,
      },
    });
  });
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
    expect(consoleDirSpy).toHaveBeenCalled();
    expect(consoleInfoSpy).toHaveBeenCalled();
    expect(consoleInfoSpy.calls.argsFor(0)[0]).toContain(
      "checkPermission: YAMMER"
    );
  });
  it("fails for missing policy", () => {
    const chk = checkPermission("hub:missing:policy", basicCtxMgr.context);
    expect(chk.access).toBe(false);
    expect(chk.response).toBe("no-policy-exists");
    expect(chk.checks.length).toBe(0);
  });

  it("runs system level permission checks that all pass", () => {
    const chk = checkPermission("hub:project:create", premiumCtxMgr.context);
    expect(chk.access).toBe(true);
    expect(chk.response).toBe("granted");
    expect(chk.checks.length).toBe(4);
    // verify that the service check is run
    expect(chk.checks[0].name).toBe("service portal online");
  });

  it("runs system level permission checks fail", () => {
    const chk = checkPermission("hub:project:create", basicCtxMgr.context);
    expect(chk.access).toBe(false);
    expect(chk.response).toBe("not-licensed");
    expect(chk.checks.length).toBe(4);
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
      expect(consoleInfoSpy.calls.argsFor(0)[0]).toContain(
        "checkPermission: YODA"
      );
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
    // Feature Flags are passed on Context create ^^
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
        "hub:project:workspace:hierarchy2",
        premiumCtxMgr.context
      );

      expect(chk.access).toBe(true);
    });
    it("flags for dependencies do not override child conditions", () => {
      const chk = checkPermission(
        "hub:project:workspace:hierarchy",
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
});
