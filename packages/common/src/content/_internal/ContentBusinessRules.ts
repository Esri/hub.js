import { IFeatureFlags, IPermissionPolicy } from "../../permissions";

/**
 * Default features for a Content item. Intentionally empty to prevent overriding and adding features
 */
export const ContentDefaultFeatures: IFeatureFlags = {
  // Intentally empty as this prevents overriding and adding features
};

/**
 * Content Permission Policies
 * These define the requirements any user must meet to perform related actions
 * @private
 */
export const ContentPermissions = [
  "hub:content:create",
  "hub:content:delete",
  "hub:content:edit",
  "hub:content:view",
  "hub:content:canChangeAccess",
  "hub:content:workspace",
  "hub:content:workspace:overview",
  "hub:content:workspace:dashboard",
  "hub:content:workspace:details",
  "hub:content:workspace:discussion",
  "hub:content:workspace:settings",
  "hub:content:workspace:settings:schedule",
  "hub:content:workspace:collaborators",
  "hub:content:manage",
  "hub:content:canRecordDownloadErrors",
  "hub:content:downloads:displayErrors",
  "temp:hub:content:downloads:unifiedList",
] as const;

/**
 * Content permission policies
 * No need to specify license for permissions that are available to all licenses
 * @private
 */
export const ContentPermissionPolicies: IPermissionPolicy[] = [
  {
    permission: "hub:content",
    services: ["portal"],
  },
  {
    permission: "hub:content:create",
    services: ["portal"],
    authenticated: true,
    privileges: ["portal:user:createItem"],
  },
  {
    permission: "hub:content:view",
    services: ["portal"],
    authenticated: false,
  },
  {
    permission: "hub:content:edit",
    authenticated: true,
    services: ["portal"],
    entityEdit: true,
  },
  {
    permission: "hub:content:delete",
    authenticated: true,
    services: ["portal"],
    entityEdit: true,
  },
  {
    permission: "hub:content:canChangeAccess",
    dependencies: ["hub:content"],
    authenticated: true,
    assertions: [
      {
        property: "context:currentUser.privileges",
        type: "contains-some",
        value: [
          "portal:admin:shareToPublic",
          "portal:admin:shareToOrg",
          "portal:user:shareToPublic",
          "portal:user:shareToOrg",
        ],
      },
      {
        property: "entity:itemControl",
        type: "eq",
        value: "admin",
      },
    ],
  },
  {
    permission: "hub:content:workspace",
    dependencies: ["hub:feature:workspace"],
  },
  {
    permission: "hub:content:workspace:overview",
    availability: ["alpha"],
    dependencies: ["hub:content:workspace", "hub:content:view"],
  },
  {
    permission: "hub:content:workspace:dashboard",
    dependencies: ["hub:content:workspace", "hub:content:view"],
  },
  {
    permission: "hub:content:workspace:details",
    dependencies: ["hub:content:workspace", "hub:content:edit"],
  },
  {
    permission: "hub:content:workspace:discussion",
    dependencies: ["hub:content:workspace", "hub:content:edit"],
  },
  {
    permission: "hub:content:workspace:settings",
    dependencies: ["hub:content:workspace", "hub:content:edit"],
  },
  {
    // can view = (alpha org + devext environment) || (permission is passed via query param)
    permission: "hub:content:workspace:settings:schedule",
    availability: ["alpha"],
    environments: ["devext"],
  },
  {
    permission: "hub:content:workspace:collaborators",
    dependencies: ["hub:content:workspace", "hub:content:edit"],
  },
  {
    permission: "hub:content:manage",
    dependencies: ["hub:content:edit"],
  },
  {
    permission: "hub:content:canRecordDownloadErrors",
    environments: ["qaext", "devext"],
  },
  {
    permission: "hub:content:downloads:displayErrors",
    availability: ["alpha"],
    environments: ["qaext", "devext"],
  },
  {
    permission: "temp:hub:content:downloads:unifiedList",
    availability: ["flag"],
    environments: ["qaext", "devext"],
  },
];
