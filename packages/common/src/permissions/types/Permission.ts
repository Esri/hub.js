import { ProjectPermissions } from "../../projects/_internal/ProjectBusinessRules";
import { SitePermissions } from "../../sites/_internal/SiteBusinessRules";
import { InitiativePermissions } from "../../initiatives/_internal/InitiativeBusinessRules";
import { DiscussionPermissions } from "../../discussions/_internal/DiscussionBusinessRules";
import { ContentPermissions } from "../../content/_internal/ContentBusinessRules";
import { GroupPermissions } from "../../groups/_internal/GroupBusinessRules";
import { PagePermissions } from "../../pages/_internal/PageBusinessRules";
import { PlatformPermissions } from "../PlatformPermissionPolicies";
import { InitiativeTemplatePermissions } from "../../initiative-templates/_internal/InitiativeTemplateBusinessRules";
import { TemplatePermissions } from "../../templates/_internal/TemplateBusinessRules";
import { SurveyPermissions } from "../../surveys/_internal/SurveyBusinessRules";
import { EventPermissions } from "../../events/_internal/EventBusinessRules";
import { UserPermissions } from "../../users/_internal/UserBusinessRules";

/**
 * Defines the values for Permissions
 * It's critical that the arrays defined in the modules use `as const`
 * otherwise Permission devolves into just a string type
 */
// this is a temporary mechanism for gating workspaces or parts of workspaces
// to be used until we release workspaces or it can be replaced with our new access control (permission/feature/capability) system
const TempPermissions = ["temp:workspace:released"];

const SystemPermissions = [
  "hub:feature:privacy",
  "hub:feature:workspace",
  "hub:feature:user:preferences",
  "hub:card:follow",
  "hub:feature:workspace:user",
  "hub:feature:workspace:org",
  // DEPRECATED: This permission has been replaced by hub:feature:workspace:org,
  // remove this at the next breaking version
  "hub:feature:workspace:umbrella",
  "hub:feature:keyboardshortcuts",
  "hub:feature:history",
  "hub:feature:catalogs",
  "hub:license:hub-premium",
  "hub:license:hub-basic",
  "hub:license:enterprise-sites",
  "hub:availability:alpha",
  "hub:availability:beta",
  "hub:availability:general",
  "hub:environment:qaext",
  "hub:environment:devext",
  "hub:environment:production",
  "hub:environment:enterprise",
];

const validPermissions = [
  ...SitePermissions,
  ...ProjectPermissions,
  ...InitiativePermissions,
  ...ContentPermissions,
  ...GroupPermissions,
  ...PagePermissions,
  ...PlatformPermissions,
  ...TempPermissions,
  ...DiscussionPermissions,
  ...InitiativeTemplatePermissions,
  ...TemplatePermissions,
  ...SystemPermissions,
  ...SurveyPermissions,
  ...EventPermissions,
  ...UserPermissions,
] as const;

/**
 * Defines the possible values for Permissions
 */
export type Permission =
  | (typeof SitePermissions)[number]
  | (typeof ProjectPermissions)[number]
  | (typeof InitiativePermissions)[number]
  | (typeof ContentPermissions)[number]
  | (typeof GroupPermissions)[number]
  | (typeof PagePermissions)[number]
  | (typeof PlatformPermissions)[number]
  | (typeof TempPermissions)[number]
  | (typeof DiscussionPermissions)[number]
  | (typeof InitiativeTemplatePermissions)[number]
  | (typeof TemplatePermissions)[number]
  | (typeof SystemPermissions)[number]
  | (typeof SurveyPermissions)[number]
  | (typeof EventPermissions)[number]
  | (typeof UserPermissions)[number];

/**
 * Validate a Permission
 * @param permission
 * @returns
 */
export function isPermission(maybePermission: string): boolean {
  return validPermissions.includes(maybePermission as Permission);
}
