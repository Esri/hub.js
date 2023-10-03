import { IFeatureFlags, IPermissionPolicy } from "../../permissions/types";

/**
 * Default features for a Template. These are the features
 * that can be enabled / disabled by the entity owner
 */
export const TemplateDefaultFeatures: IFeatureFlags = {};

/**
 * @private
 * Template permissions: these define the requirements
 * any user must meet to perform related actions
 */
export const TemplatePermissions = [
  "hub:template",
  "hub:template:create",
  "hub:template:delete",
  "hub:template:edit",
  "hub:template:manage",
  "hub:template:view",
  "hub:template:workspace:overview",
  "hub:template:workspace:details",
  "hub:template:workspace:collaborators",
  "hub:template:workspace:settings",
] as const;

/**
 * @private
 * Template permission policies
 */
export const TemplatePermissionPolicies: IPermissionPolicy[] = [
  {
    permission: "hub:template",
    availability: ["alpha"], // gate to alpha for now
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
    entityOwner: true,
  },
  {
    permission: "hub:template:view",
    dependencies: ["hub:template"],
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
    permission: "hub:template:workspace:overview",
    dependencies: ["hub:template:view"],
  },
  {
    permission: "hub:template:workspace:details",
    dependencies: ["hub:template:manage"],
  },
  {
    permission: "hub:template:workspace:collaborators",
    dependencies: ["hub:template:manage"],
  },
  {
    permission: "hub:template:workspace:settings",
    dependencies: ["hub:template:manage"],
    entityOwner: true,
  },
];
