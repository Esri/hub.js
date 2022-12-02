/**`
 * Human readable response from a policy check
 */

export type PolicyResponse =
  | "granted" // user has access
  | "org-member" // user is member of granted org
  | "not-org-member" // user is not member of granted org
  | "group-member" // user is member of granted org
  | "not-group-member" // user is not member of granted group
  | "not-group-admin" // user is not admin member of granted group
  | "is-user" // user is granted directly
  | "not-owner" // user is not the owner
  | "not-licensed" // user is not licensed
  | "not-licensed-available" // user is not licensed, but could be
  | "not-available" // permission not available in this context
  | "not-granted" // user does not have permission
  | "no-edit-access" // user does not have edit access
  | "invalid-permission" // permission is invalid
  | "privilege-required" // user does not have required privilege
  | "system-offline" // subsystem is offline
  | "system-maintenance" // subsystem is in maintenance mode
  | "entity-required" // entity is required but not passed
  | "not-authenticated" // user is not authenticated
  | "not-alpha-org"; // user is not in an alpha org
