/**
 * Hash of orgs with custom max group limits
 */
export const limitsHash: Record<string, number> = {
  default: 512,
  mJaJSax0KPHoCNB6: 700, // pgegisportal
  q5DTBtIqgaEcBe1j: 700,
  z6hI6KRjKHvhNO0r: 700,
  Xj56SBi2udA78cC9: 700, // qa-pre-a-hub
  "7ldwmV3MFwjrElY8": 700,
};

/**
 * Return the max number of groups a user can be part of
 * @param orgId
 * @returns
 */
export function getOrgGroupLimit(orgId: string): number {
  return limitsHash[orgId] || limitsHash.default;
}
