import { IFeatureFlags, IPermissionPolicy } from "../../permissions/types";

/**
 * Default features for a Template. These are the features
 * that can be enabled / disabled by the entity owner
 */
export const TemplateDefaultFeatures: IFeatureFlags = {};

/**
 * @private
 * Template permission policies
 */
export const TemplatePermissionPolicies: IPermissionPolicy[] = [
  {
    permission: "hub:template",
    services: ["portal"],
  },
  {
    permission: "hub:template:create",
    dependencies: ["hub:template"],
    authenticated: true,
    privileges: ["portal:user:createItem"],
  },
  {
    permission: "hub:template:delete",
    dependencies: ["hub:template"],
    authenticated: true,
    entityDelete: true,
  },
  {
    permission: "hub:template:view",
    dependencies: ["hub:template"],
  },
  {
    permission: "hub:template:view:related",
    dependencies: ["hub:template:view"],
    services: ["hub-search"],
    assertions: [
      {
        property: "entity:access",
        type: "eq",
        value: "public",
      },
    ],
  },
  {
    permission: "hub:template:edit",
    dependencies: ["hub:template"],
    authenticated: true,
    entityEdit: true,
  },
  {
    permission: "hub:template:manage",
    dependencies: ["hub:template:edit"],
  },
  {
    permission: "hub:template:canChangeAccess",
    dependencies: ["hub:template"],
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
    permission: "hub:template:workspace",
    dependencies: ["hub:feature:workspace"],
  },
  {
    permission: "hub:template:workspace:details",
    dependencies: ["hub:template:workspace", "hub:template:manage"],
  },
  {
    permission: "hub:template:workspace:dashboard",
    dependencies: ["hub:template:workspace", "hub:template:manage"],
  },
  {
    permission: "hub:template:workspace:collaborators",
    dependencies: ["hub:template:workspace", "hub:template:manage"],
  },
  {
    permission: "hub:template:workspace:settings",
    dependencies: ["hub:template:workspace", "hub:template:manage"],
  },
];
