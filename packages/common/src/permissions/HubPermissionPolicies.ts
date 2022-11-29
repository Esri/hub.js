import { ProjectPermissionPolicies } from "../projects/_internal/ProjectPermissionPolicies";
import { SitesPermissionPolicies } from "../sites/_internal/SitesPermissionPolicies";

import { IPermissionPolicy, Permission } from "./types";

/**
 * All the permission policies for the Hub
 */
export const HubPermissionsPolicies: IPermissionPolicy[] = [
  ...SitesPermissionPolicies,
  ...ProjectPermissionPolicies,
];

/**
 * Get the policies defined for a specific permission
 * @param permission
 * @returns
 */
export function getPermissionPolicy(permission: Permission): IPermissionPolicy {
  return HubPermissionsPolicies.find((p) => p.permission === permission);
}
