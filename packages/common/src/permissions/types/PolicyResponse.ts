/**`
 * Human readable response from a policy check
 */

export type PolicyResponse =
  | "granted" // user has access
  | "disabled-by-feature-flag" // access denied due to a flag
  | "disabled-by-entity-flag" // access denied due to a flag
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
  | "edit-access" // user has edit access but policy is for non-editors
  | "invalid-permission" // permission is invalid
  | "invalid-capability" // capability is invalid
  | "privilege-required" // user does not have required privilege
  | "service-offline" // service is offline
  | "service-maintenance" // service is in maintenance mode
  | "service-not-available" // service is not available in this environment
  | "entity-required" // entity is required but not passed
  | "not-authenticated" // user is not authenticated
  | "not-alpha-org" // user is not in an alpha org
  | "not-beta-org" // user is not in a beta org
  | "property-missing" // assertion requires property but is missing from entity
  | "property-not-array" // assertion requires array property
  | "property-has-no-length" // assertion requires string or array property
  | "array-contains-invalid-value" // assertion specifies a value not be included
  | "array-missing-required-value" // assertion specifies a value not be included
  | "property-mismatch"
  | "user-not-group-member"
  | "user-not-group-manager"
  | "user-not-group-owner"
  | "assertion-property-not-found"
  | "assertion-failed" // assertion condition was not met
  | "assertion-requires-numeric-values" // assertion requires numeric values
  | "property-match"
  | "feature-disabled" // feature has been disabled for the entity
  | "feature-enabled" // feature has been enabled for the entity
  | "not-in-environment" // user is not in an allowed environment
  | "no-policy-exists" // policy is not defined for this permission
  | "feature-flag-required"; // feature flag is not passed;
