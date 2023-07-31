import { InitiativePermissionPolicies } from "../initiatives/_internal/InitiativeBusinessRules";
import { ProjectPermissionPolicies } from "../projects/_internal/ProjectBusinessRules";
import { SitesPermissionPolicies } from "../sites/_internal/SiteBusinessRules";
import { DiscussionPermissionPolicies } from "../discussions/_internal/DiscussionBusinessRules";
import { ContentPermissionPolicies } from "../content/_internal/ContentBusinessRules";
import { IPermissionPolicy, Permission } from "./types";
import { PagePermissionPolicies } from "../pages/_internal/PageBusinessRules";

// Examples of possible Permission Policies
// const DiscussionPermissionPolicies: IPermissionPolicy[] = [
//   {
//     permission: "discussions:channel:create",
//     authenticated: true,
//     subsystems: ["discussions"],
//     licenses: ["hub-basic", "hub-premium"],
//   },
//   {
//     permission: "discussions:channel:createprivate",
//     subsystems: ["discussions"],
//     authenticated: true,
//     licenses: ["hub-basic", "hub-premium"],
//     assertions: [
//       {
//         property: "entity:group.typekeywords",
//         assertion: "without",
//         value: "cannotDiscuss",
//       },
//       {
//         property: "context:currentUser",
//         assertion: "is-group-admin",
//         value: "entity:group.id",
//       },
//     ],
//   },
//   {
//     permission: "discussions:channel:create",
//     subsystems: ["discussions"],
//     authenticated: true,
//     licenses: ["hub-basic", "hub-premium"],
//     assertions: [
//       {
//         property: "entity:typeKeywords",
//         assertion: "without",
//         value: "cannotDiscuss",
//       },
//     ],
//   },
//   {
//     permission: "discussions:post:create",
//     subsystems: ["discussions"],
//     authenticated: true,
//     licenses: ["hub-basic", "hub-premium"],
//     assertions: [
//       {
//         property: "entity:typeKeywords",
//         assertion: "without",
//         value: "cannotDiscuss",
//       },
//     ],
//   },
// ];

const EnvironmentPermissionPolicies: IPermissionPolicy[] = [
  {
    // maybe we don't need features at all since they will map to environments - maybe we just need environment - but i think having features allows us to pass in overrides more easily
    permission: "hub:workspaces:view",
    subsystems: [],
    features: ["workspaces"],
    // authenticated: true,
    // licenses: ["hub-basic", "hub-premium"],
    // alpha: true,
  },
];

/**
 * All the permission policies for the Hub
 */
export const HubPermissionsPolicies: IPermissionPolicy[] = [
  ...SitesPermissionPolicies,
  ...ProjectPermissionPolicies,
  ...InitiativePermissionPolicies,
  ...DiscussionPermissionPolicies,
  ...ContentPermissionPolicies,
  ...PagePermissionPolicies,
  ...EnvironmentPermissionPolicies,
];

/**
 * Get the policies defined for a specific permission
 * @param permission
 * @returns
 */
export function getPermissionPolicy(permission: Permission): IPermissionPolicy {
  return HubPermissionsPolicies.find((p) => p.permission === permission);
}
