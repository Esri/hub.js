import { IPermissionPolicy } from "../../permissions/types";

/**
 * Site permission policies
 * @private
 */
export const SitesPermissionPolicies: IPermissionPolicy[] = [
  {
    permission: "hub:site:create",
    subsystems: ["site"],
    authenticated: true,
    privileges: ["portal:user:createItem"],
    licenses: ["hub-basic", "hub-premium", "enterprise-sites"],
  },
  {
    permission: "hub:site:view",
    subsystems: ["site"],
    authenticated: false,
    licenses: ["hub-basic", "hub-premium", "enterprise-sites"],
  },
  {
    permission: "hub:site:delete",
    subsystems: ["site"],
    authenticated: true,
    licenses: ["hub-basic", "hub-premium", "enterprise-sites"],
    entityOwner: true,
  },
  {
    permission: "hub:site:edit",
    entityEdit: true,
    subsystems: ["site"],
    authenticated: true,
    licenses: ["hub-basic", "hub-premium", "enterprise-sites"],
  },
];
