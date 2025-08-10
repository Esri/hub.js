import { ProjectPermissions } from "../../projects/_internal/ProjectBusinessRules";
import { SitePermissions } from "../../sites/_internal/SiteBusinessRules";
import { InitiativePermissions } from "../../initiatives/_internal/InitiativeBusinessRules";
import { DiscussionPermissions } from "../../discussions/_internal/DiscussionBusinessRules";
import { ChannelPermissions } from "../../channels/_internal/ChannelBusinessRules";
import { ContentPermissions } from "../../content/_internal/ContentBusinessRules";
import { GroupPermissions } from "../../groups/_internal/GroupBusinessRules";
import { PagePermissions } from "../../pages/_internal/PageBusinessRules";
import { PlatformPermissions } from "../PlatformPermissionPolicies";
import { InitiativeTemplatePermissions } from "../../initiative-templates/_internal/InitiativeTemplateBusinessRules";
import { TemplatePermissions } from "../../templates/_internal/TemplateBusinessRules";
import { EventPermissions } from "../../events/_internal/EventBusinessRules";
import { UserPermissions } from "../../users/_internal/UserBusinessRules";

/**
 * Defines the values for Permissions
 * It's critical that the arrays defined in the modules use `as const`
 * otherwise Permission devolves into just a string type
 */

const SystemPermissions = [
  "hub:feature:ai-assistant",
  "hub:platform:ai-assistant",
  "hub:feature:privacy",
  "hub:feature:workspace",
  "hub:feature:user:preferences",
  "hub:card:follow",
  "hub:feature:workspace:user",
  "hub:feature:workspace:org",
  "hub:feature:keyboardshortcuts",
  "hub:feature:newentityview",
  "hub:feature:history",
  "hub:feature:catalogs", // DEPRECATED - TODO: remove at next major version
  /** remove once sites support all catalog configuration features */
  "hub:feature:catalogs:edit:advanced",
  "hub:feature:catalogs:edit:appearance",
  "hub:feature:inline-workspace",
  "hub:feature:pagescatalog",
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
  ...DiscussionPermissions,
  ...InitiativeTemplatePermissions,
  ...TemplatePermissions,
  ...SystemPermissions,
  ...EventPermissions,
  ...UserPermissions,
  ...ChannelPermissions,
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
  | (typeof DiscussionPermissions)[number]
  | (typeof InitiativeTemplatePermissions)[number]
  | (typeof TemplatePermissions)[number]
  | (typeof SystemPermissions)[number]
  | (typeof EventPermissions)[number]
  | (typeof UserPermissions)[number]
  | (typeof ChannelPermissions)[number];

/**
 * Validate a Permission
 * @param permission
 * @returns
 */
export function isPermission(maybePermission: string): boolean {
  return validPermissions.includes(maybePermission);
}
