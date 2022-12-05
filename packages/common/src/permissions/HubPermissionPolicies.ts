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
    assertions: [
      {
        property: "context.isAuthenticated",
        assertion: "eq",
        value: true,
      },
      {
        property: "context.license",
        assertion: "included-in",
        value: ["hub-basic", "hub-premium"],
      },
      {
        property: "group.typekeywords",
        assertion: "not-contains",
        value: "cannotDiscuss",
      },
      {
        property: "user.groupIds",
        assertion: "contains",
        value: "group.id",
      },
    ],
  },
  {
    permission: "discussions:channel:create",
    subsystems: ["discussions"],
    assertions: [
      {
        property: "context.isAuthenticated",
        assertion: "eq",
        value: true,
      },
      {
        property: "context.license",
        assertion: "included-in",
        value: ["hub-basic", "hub-premium"],
      },
      {
        property: "typeKeywords",
        assertion: "not-contains",
        value: "cannotDiscuss",
      },
    ],
  },
  {
    permission: "discussions:post:create",
    subsystems: ["discussions"],
    assertions: [
      {
        property: "context.isAuthenticated",
        assertion: "eq",
        value: true,
      },
      {
        property: "context.license",
        assertion: "included-in",
        value: ["hub-basic", "hub-premium"],
      },
      {
        property: "typeKeywords",
        assertion: "not-contains",
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
