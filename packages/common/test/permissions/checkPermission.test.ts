import { IPortal, IUser } from "@esri/arcgis-rest-portal";
import { ArcGISContextManager } from "../../src/ArcGISContextManager";
import {
  checkPermission,
  cloneObject,
  IHubItemEntity,
  IPermissionPolicy,
  IUserHubSettings,
  Permission,
} from "../../src";
import { MOCK_AUTH } from "../mocks/mock-auth";
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
    dependencies: ["hub:gating:workspace:released"],
  },
  {
    // Feature that gates the workspace release
    // when removed, the workspace feature will be available to all users
    permission: "hub:gating:workspace:released",
    availability: ["alpha"],
    environments: ["devext", "qaext", "production"],
  },
  {
    // Present to verify that the gating is opened when
    // the conditions are removed
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
  let gatingOptOutCtxMgr: ArcGISContextManager;
  let gatingOptInCtxMgr: ArcGISContextManager;
  let premiumCtxMgr: ArcGISContextManager;

  beforeEach(async () => {
    spyOn(GetPolicyModule, "getPermissionPolicy").and.callFake(
      getPermissionPolicy
    );
    spyOn(IsPermissionModule, "isPermission").and.callFake(isPermission);

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
    gatingOptOutCtxMgr = await ArcGISContextManager.create({
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
      featureFlags: {},
      userHubSettings: {
        features: {
          // this feature depends on a gating policy, which has no conditions, meaning it's released
          // but setting this to false will opt the user out of the feature. In the future, to remove
          // this opt-out, we will apply a migration that will remove this setting when we
          // remove the ability to opt out
          subscriptions: false,
        } as unknown as IUserHubSettings["features"],
        schemaVersion: 1.1,
        username: "casey",
      },
    });
    gatingOptInCtxMgr = await ArcGISContextManager.create({
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
      featureFlags: {},
      userHubSettings: {
        features: {
          // this feature depends on a gating policy, which has conditions, meaning it's not released
          // but this user has opted in to the feature, which overrides the gating
          workspace: true,
        } as unknown as IUserHubSettings["features"],
        schemaVersion: 1.1,
        username: "casey",
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
      userHubSettings: {
        features: {
          workspace: true,
        } as unknown as IUserHubSettings["features"],
        schemaVersion: 1.1,
        username: "casey",
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

  it("runs system level permission checks that fail", () => {
    const chk = checkPermission("hub:project:create", basicCtxMgr.context);
    expect(chk.access).toBe(false);
    expect(chk.response).toBe("not-licensed");
    expect(chk.checks.length).toBe(4);
  });

  it("gating returns true if no conditions are specified", () => {
    const chk = checkPermission(
      "hub:gating:subscriptions:released",
      basicCtxMgr.context
    );
    expect(chk.access).toBe(true);
    const chk2 = checkPermission(
      "hub:feature:subscriptions",
      basicCtxMgr.context
    );
    expect(chk2.access).toBe(true);
  });
  it("user can opt out ungated feature", () => {
    const chk = checkPermission(
      "hub:feature:subscriptions",
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
      // expect(consoleInfoSpy.calls.argsFor(0)[0]).toContain(
      //   "checkPermission: YODA"
      // );
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
