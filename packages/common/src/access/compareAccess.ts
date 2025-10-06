import { AccessLevel } from "../core";

/**
 * Simple access comparison.
 * If access1 is more permissive than access2, returns "private" (downgraded); otherwise returns access1 unchanged.
 * Order: private < shared < org < public
 * Currently used to ensure that a Hub Assistant's access level is not more permissive than the site entity.
 * @param access1 Candidate access level to validate.
 * @param access2 Reference access level to compare against.
 * @returns The resulting (possibly downgraded) access level.
 */
export function compareAccess(
  access1: AccessLevel,
  access2: AccessLevel
): AccessLevel {
  const order: AccessLevel[] = ["private", "shared", "org", "public"];
  const rank = (lvl: AccessLevel): number => order.indexOf(lvl);
  return rank(access1) > rank(access2) ? "private" : access1;
}
