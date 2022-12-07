import { ProjectPermissionPolicies } from "../projects/_internal/ProjectPermissionPolicies";
import { SitesPermissionPolicies } from "../sites/_internal/SitesPermissionPolicies";

import { IPermissionPolicy, Permission } from "./types";

const DiscussionPermissionPolicies: IPermissionPolicy[] = [
  {
    permission: "discussions:channel:create",
    authenticated: true,
    subsystems: ["discussions"],
    licenses: ["hub-basic", "hub-premium"],
  },
  {
    permission: "discussions:channel:createprivate",
    subsystems: ["discussions"],
    authenticated: true,
    licenses: ["hub-basic", "hub-premium"],
    assertions: [
      {
        property: "entity:group.typekeywords",
        assertion: "without",
        value: "cannotDiscuss",
      },
      {
        property: "context:currentUser",
        assertion: "is-group-admin",
        value: "entity:group.id",
      },
    ],
  },
  {
    permission: "discussions:channel:create",
    subsystems: ["discussions"],
    authenticated: true,
    licenses: ["hub-basic", "hub-premium"],
    assertions: [
      {
        property: "entity:typeKeywords",
        assertion: "without",
        value: "cannotDiscuss",
      },
    ],
  },
  {
    permission: "discussions:post:create",
    subsystems: ["discussions"],
    authenticated: true,
    licenses: ["hub-basic", "hub-premium"],
    assertions: [
      {
        property: "entity:typeKeywords",
        assertion: "without",
        value: "cannotDiscuss",
      },
    ],
  },
];

/**
 * All the permission policies for the Hub
 */
export const HubPermissionsPolicies: IPermissionPolicy[] = [
  ...SitesPermissionPolicies,
  ...ProjectPermissionPolicies,
  ...DiscussionPermissionPolicies,
];

/**
 * Get the policies defined for a specific permission
 * @param permission
 * @returns
 */
export function getPermissionPolicy(permission: Permission): IPermissionPolicy {
  return HubPermissionsPolicies.find((p) => p.permission === permission);
}
