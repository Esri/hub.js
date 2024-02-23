import { InitiativePermissionPolicies } from "../initiatives/_internal/InitiativeBusinessRules";
import { ProjectPermissionPolicies } from "../projects/_internal/ProjectBusinessRules";
import { SitesPermissionPolicies } from "../sites/_internal/SiteBusinessRules";
import { DiscussionPermissionPolicies } from "../discussions/_internal/DiscussionBusinessRules";
import { ContentPermissionPolicies } from "../content/_internal/ContentBusinessRules";

import { IPermissionPolicy, Permission } from "./types";
import { GroupPermissionPolicies } from "../groups/_internal/GroupBusinessRules";
import { PagePermissionPolicies } from "../pages/_internal/PageBusinessRules";
import { PlatformPermissionPolicies } from "./PlatformPermissionPolicies";
import { InitiativeTemplatePermissionPolicies } from "../initiative-templates/_internal/InitiativeTemplateBusinessRules";
import { TemplatePermissionPolicies } from "../templates/_internal/TemplateBusinessRules";
import { FeedbackPermissionPolicies } from "../feedback/_internal/FeedbackBusinessRules";

// Examples of possible Permission Policies
// const DiscussionPermissionPolicies: IPermissionPolicy[] = [
//   {
//     permission: "discussions:channel:create",
//     authenticated: true,
//     services: ["discussions"],
//     licenses: ["hub-basic", "hub-premium"],
//   },
//   {
//     permission: "discussions:channel:createprivate",
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
//     services: ["discussions"],
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
//     services: ["discussions"],
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

// DEPRECATED!
// NO LONGER USED IN OPENDATA-UI DO NOT ADD MORE TO THIS LIST
const TempPermissionPolicies: IPermissionPolicy[] = [
  {
    permission: "temp:workspace:released", // replace with hub:features:workspace
    availability: ["alpha"],
    environments: ["devext", "qaext"],
  },
];

/**
 * Highlevel Permission definitions for the Hub System as a whole
 * Typically other permissions depend on these so a whole set of features
 * can be enabled / disabled by changing a single permission
 * MAKE SURE to add the permission string to the SystemPermissions array
 * in Permissions.ts
 */
const SystemPermissionPolicies: IPermissionPolicy[] = [
  {
    permission: "hub:feature:privacy",
    // alpha does not do what we want here, it says "grant if the _logged in user_ is in an alpha org"
    // but what we really want is "grant if the _current site_ is in an alpha org" which we can't do
    // availability: ["alpha"],
    // so the fallback is to deny this permission in all cases except when the feature flag is passed (?pe=hub:feature:privacy)
    // but we can't do that either
    // so we will just enable it only in devext since we don't use that env
    environments: ["devext"],
  },
  {
    permission: "hub:feature:workspace",
    availability: ["alpha"],
    environments: ["devext", "qaext"],
  },
  {
    // This is an experimental extension of the gallery to include `map layout`
    // Similar to `hub:feature:privacy`, we want to deny permission unless explicity enabled with (?pe=hub:feature:gallery:map)
    permission: "hub:feature:gallery:map",
    environments: ["devext"],
  },
  {
    // Enables access to the user preferences section of the user profile
    // This will likely be removed when we swap the user profile to use workspace
    permission: "hub:feature:user:preferences",
    // gated to alpha and qa/dev for now, but will be accessible on PROD when
    // we pass `?pe=hub:feature:user:preferences` in the URL
    availability: ["alpha"],
    environments: ["devext", "qaext"],
  },
  {
    // When enabled, the new follow card will be loaded
    // instead of the old follow initiative card.
    // To enable it, we need to pass the feature flag
    // (?pe=hub:card:follow) into the URL
    permission: "hub:card:follow",
    environments: ["qaext"],
    availability: ["flag"],
    licenses: ["hub-premium"],
  },
  {
    // When enabled, the edit & manage links will take the user to umbrella
    permission: "hub:feature:workspace:umbrella",
    availability: ["alpha"],
    environments: ["qaext"],
  },
  {
    // when enabled keyboard shortcuts will be available
    permission: "hub:feature:keyboardshortcuts",
    availability: ["alpha"],
    environments: ["devext", "qaext"],
  },
  {
    // Enables the history feature
    permission: "hub:feature:history",
    availability: ["alpha"],
    environments: ["devext", "qaext"],
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
  ...GroupPermissionPolicies,
  ...PagePermissionPolicies,
  ...TemplatePermissionPolicies,
  ...PlatformPermissionPolicies,
  ...TempPermissionPolicies,
  ...InitiativeTemplatePermissionPolicies,
  ...SystemPermissionPolicies,
  ...FeedbackPermissionPolicies,
];

/**
 * Get the policies defined for a specific permission
 * @param permission
 * @returns
 */
export function getPermissionPolicy(permission: Permission): IPermissionPolicy {
  return HubPermissionsPolicies.find((p) => p.permission === permission);
}
