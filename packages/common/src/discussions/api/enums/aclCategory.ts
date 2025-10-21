/**
 * @export
 * @enum {string}
 */
export enum AclCategory {
  ANONYMOUS_USER = "anonymousUser",
  AUTHENTICATED_USER = "authenticatedUser",
  GROUP = "group",
  ORG = "org",
  /** Not API supported */
  USER = "user",
}
