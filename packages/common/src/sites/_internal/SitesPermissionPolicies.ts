import { IPermissionPolicy } from "../../permissions/types";

/**
 * Site Permissions
 * This feeds into the Permissions type
 */
export const SitePermissions = [
  "hub:site:create",
  "hub:site:delete",
  "hub:site:edit",
  "hub:site:view",
] as const;

/**
 * Site permission policies
 * @private
 */
export const SitesPermissionPolicies: IPermissionPolicy[] = [
  {
    permission: "hub:site:create",
    subsystems: ["sites"],
    authenticated: true,
    privileges: ["portal:user:createItem"],
    licenses: ["hub-basic", "hub-premium", "enterprise-sites"],
  },
  {
    permission: "hub:site:view",
    subsystems: ["sites"],
    authenticated: false,
    licenses: ["hub-basic", "hub-premium", "enterprise-sites"],
  },
  {
    permission: "hub:site:delete",
    subsystems: ["sites"],
    authenticated: true,
    licenses: ["hub-basic", "hub-premium", "enterprise-sites"],
    entityOwner: true,
  },
  {
    permission: "hub:site:edit",
    entityEdit: true,
    subsystems: ["sites"],
    authenticated: true,
    licenses: ["hub-basic", "hub-premium", "enterprise-sites"],
  },
];
