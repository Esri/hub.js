import { ProjectPermissions } from "../../projects/_internal/ProjectBusinessRules";
import { SitePermissions } from "../../sites/_internal/SiteBusinessRules";
import { InitiativePermissions } from "../../initiatives/_internal/InitiativeBusinessRules";
import { DiscussionPermissions } from "../../discussions/_internal/DiscussionBusinessRules";
import { ContentPermissions } from "../../content/_internal/ContentBusinessRules";
import { GroupPermissions } from "../../groups/_internal/GroupBusinessRules";
import { PagePermissions } from "../../pages/_internal/PageBusinessRules";

/**
 * Defines the values for Permissions
 * It's critical that the arrays defined in the modules use `as const`
 * otherwise Permission devolves into just a string type
 */
const validPermissions = [
  ...SitePermissions,
  ...ProjectPermissions,
  ...InitiativePermissions,
  ...DiscussionPermissions,
  ...ContentPermissions,
  ...GroupPermissions,
  ...PagePermissions,
] as const;

/**
 * Defines the possible values for Permissions
 */
export type Permission = (typeof validPermissions)[number];

/**
 * Validate a Permission
 * @param permission
 * @returns
 */
export function isPermission(maybePermission: string): boolean {
  return validPermissions.includes(maybePermission as Permission);
}
