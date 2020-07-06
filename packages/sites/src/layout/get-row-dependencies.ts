import { getCardDependencies } from "./get-card-dependencies";

import { IRow } from "./types";

/**
 * Find all the cards for the given row
 *
 * @param {IRow} row
 */
export function getRowDependencies(row: IRow): string[] {
  return row.cards.reduce((deps, card) => {
    const cardDeps = getCardDependencies(card);
    if (cardDeps.length) {
      deps = deps.concat(cardDeps);
    }
    return deps;
  }, []);
}
