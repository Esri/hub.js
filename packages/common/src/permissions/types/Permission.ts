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
import { FeedbackPermissions } from "../../feedback/_internal/FeedbackBusinessRules";
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
  "hub:feature:gallery:map",
  "hub:feature:user:preferences",
  "hub:card:follow",
  "hub:feature:workspace:umbrella",
  "hub:feature:keyboardshortcuts",
  "hub:feature:history",
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
  ...FeedbackPermissions,
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
  | (typeof FeedbackPermissions)[number];

/**
 * Validate a Permission
 * @param permission
 * @returns
 */
export function isPermission(maybePermission: string): boolean {
  return validPermissions.includes(maybePermission as Permission);
}
