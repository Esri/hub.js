/**
 * Hash of orgs with custom max group limits
 */
export const limitsHash: Record<string, number> = {
  default: 512,
  xW49QhDgcgjm4BU0: 700,
  q5DTBtIqgaEcBe1j: 700,
};

/**
 * Return the max number of groups a user can be part of
 * @param orgId
 * @returns
 */
export function getOrgGroupLimit(orgId: string): number {
  return limitsHash[orgId] || limitsHash.default;
}
