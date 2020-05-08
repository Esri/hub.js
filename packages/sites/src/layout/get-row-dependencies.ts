import { getCardDependencies } from "./get-card-dependencies";

import { IRow } from "./types";

export const getRowDependencies = function getRowDependencies (row : IRow) {
  return row.cards.reduce((deps, card) => {
    let cardDeps = getCardDependencies(card);
    if (cardDeps.length) {
      deps = deps.concat(cardDeps);
    }
    return deps;
  }, []);
};
