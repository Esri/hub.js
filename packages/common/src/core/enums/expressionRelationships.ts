/**
 * Possible relationships for an expression
 * BETWEEN -- used to show between two values, i.e. 7 < x < 10
 * IS_EXACTLY -- for exact matching, i.e. two same strings
 */
export enum ExpressionRelationships {
  BETWEEN = "between",
  IS_EXACTLY = "isExactly",

  // deprecated and not currently allowed for new use, only used for migrating older stat cards
  LIKE = "like",
}
