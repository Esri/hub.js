import { InitiativePermissionPolicies } from "../initiatives/_internal/InitiativeBusinessRules";
import { ProjectPermissionPolicies } from "../projects/_internal/ProjectBusinessRules";
import { SitesPermissionPolicies } from "../sites/_internal/SiteBusinessRules";
import { DiscussionPermissionPolicies } from "../discussions/_internal/DiscussionBusinessRules";
import { ChannelPermissionPolicies } from "../channels/_internal/ChannelBusinessRules";
import { ContentPermissionPolicies } from "../content/_internal/ContentBusinessRules";

import { IPermissionPolicy, Permission } from "./types";
import { GroupPermissionPolicies } from "../groups/_internal/GroupBusinessRules";
import { PagePermissionPolicies } from "../pages/_internal/PageBusinessRules";
import { PlatformPermissionPolicies } from "./PlatformPermissionPolicies";
import { InitiativeTemplatePermissionPolicies } from "../initiative-templates/_internal/InitiativeTemplateBusinessRules";
import { TemplatePermissionPolicies } from "../templates/_internal/TemplateBusinessRules";
import { SurveyPermissionPolicies } from "../surveys/_internal/SurveyBusinessRules";
import { EventPermissionPolicies } from "../events/_internal/EventBusinessRules";
import { UserPermissionPolicies } from "../users/_internal/UserBusinessRules";

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

/**
 * Highlevel Permission definitions for the Hub System as a whole
 * Typically other permissions depend on these so a whole set of features
 * can be enabled / disabled by changing a single permission
 * MAKE SURE to add the permission string to the SystemPermissions array
 * in Permissions.ts
 */
const SystemPermissionPolicies: IPermissionPolicy[] = [
  {
    permission: "hub:feature:ai-assistant",
    availability: ["alpha"],
    flagValue: false, // default to not enabled; site must opt-in
    entityConfigurable: true,
  },
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
    environments: ["devext", "qaext", "production"],
  },
  {
    // Enables access to the user preferences section of the user profile
    // This will likely be removed when we swap the user profile to use workspace
    permission: "hub:feature:user:preferences",
    // gated to qa/dev for now, but will be accessible on PROD when
    // we pass `?pe=hub:feature:user:preferences` in the URL
    environments: ["devext", "qaext", "production"],
  },
  // These should only be used when needing to gate functionality that is not
  // connected to an entity, for example notices. These should NOT be used
  // in dependencies arrays.
  {
    permission: "hub:environment:qaext",
    environments: ["qaext"],
  },
  {
    permission: "hub:environment:devext",
    environments: ["devext"],
  },
  {
    permission: "hub:environment:production",
    environments: ["production"],
  },
  {
    permission: "hub:environment:enterprise",
    environments: ["enterprise"],
  },
  {
    // When enabled, the new follow card will be loaded
    // instead of the old follow initiative card.
    // To enable it, we need to pass the feature flag
    // (?pe=hub:card:follow) into the URL
    permission: "hub:card:follow",
    environments: ["qaext"],
    availability: ["flag"],
    licenses: ["hub-basic", "hub-premium"],
  },
  {
    // When enabled, the manage links will take the user the org home site
    permission: "hub:feature:workspace:user",
    // NOTE: qaext and devext might seem redundant, given that hub:feature:workspace is alpha
    // but we allow users to "opt-in" which overrides that
    environments: ["qaext", "devext"],
    dependencies: ["hub:feature:workspace"],
  },
  {
    // When enabled, the manage links will take the user the org home site
    permission: "hub:feature:workspace:org",
    availability: ["alpha"],
    environments: ["devext", "qaext"],
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
  {
    // Enables the new entity view to render on a view route
    // To enable it, we need to pass the feature flag
    // (?pe=hub:feature:newentityview) into the URL
    permission: "hub:feature:newentityview",
    environments: ["qaext"],
    availability: ["flag"],
  },
  {
    // Enables catalog configuration and viewing
    permission: "hub:feature:catalogs",
    environments: ["qaext"],
    availability: ["alpha"],
  },
  /**
   * Gates advanced editing (e.g. adding new collections, adding
   * additional scope filters, appearance settings, etc.) in
   * the catalog configuration experince.
   *
   * TODO: Remove the site entity assertion once all catalog
   * configuration features are supported by sites
   */
  {
    permission: "hub:feature:catalogs:edit:advanced",
    entityEdit: true,
    licenses: ["hub-premium"],
    assertions: [
      {
        property: "entity:type",
        type: "neq",
        value: "Hub Site Application",
      },
    ],
  },
  {
    // Enable inline-workspace for Entity Views
    // limited to devext alpha so we have to pass as a flag to enable
    permission: "hub:feature:inline-workspace",
    environments: ["devext"],
    availability: ["alpha"],
  },
  {
    // Enable site getting pages from it's catalog
    // instead of those linked in the site's data
    permission: "hub:feature:pagescatalog",
    environments: ["qaext"],
    availability: ["alpha"],
  },
  // NOTE: only use this permission if necessary. Use the licenses check on a permission to check license when able instead of a separate permission.
  // checks if using hub-premium
  {
    permission: "hub:license:hub-premium",
    licenses: ["hub-premium"],
  },
  // NOTE: only use this permission if necessary. Use the licenses check on a permission to check license when able instead of a separate permission.
  // checks if using hub-basic
  {
    permission: "hub:license:hub-basic",
    licenses: ["hub-basic"],
  },
  // NOTE: only use this permission if necessary. Use the licenses check on a permission to check license when able instead of a separate permission.
  // checks if using enterprise-sites
  {
    permission: "hub:license:enterprise-sites",
    licenses: ["enterprise-sites"],
  },
  // NOTE: only use this permission if necessary. Use the availability check on a permission to check availability when able instead of a separate permission.
  // checks if in alpha
  {
    permission: "hub:availability:alpha",
    availability: ["alpha"],
  },
  // NOTE: only use this permission if necessary. Use the availability check on a permission to check availability when able instead of a separate permission.
  // checks if in beta
  {
    permission: "hub:availability:beta",
    availability: ["beta"],
  },
  // NOTE: only use this permission if necessary. Use the availability check on a permission to check availability when able instead of a separate permission.
  // checks if in general
  {
    permission: "hub:availability:general",
    availability: ["general"],
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
  ...ChannelPermissionPolicies,
  ...ContentPermissionPolicies,
  ...GroupPermissionPolicies,
  ...PagePermissionPolicies,
  ...TemplatePermissionPolicies,
  ...PlatformPermissionPolicies,
  ...InitiativeTemplatePermissionPolicies,
  ...SystemPermissionPolicies,
  ...SurveyPermissionPolicies,
  ...EventPermissionPolicies,
  ...UserPermissionPolicies,
];

/**
 * Get the policies defined for a specific permission
 * @param permission
 * @returns
 */
export function getPermissionPolicy(permission: Permission): IPermissionPolicy {
  return HubPermissionsPolicies.find((p) => p.permission === permission);
}
