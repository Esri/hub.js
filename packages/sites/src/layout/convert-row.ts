import { convertCard } from "./convert-card";

import { IRow } from "./types";

export const convertRow = function convertRow (row : IRow) {
  // if the section has a background image, and it has a url, we should
  // add that to the asset hash so it can be downloaded and added to the template item
  // and also cook some unique asset name so we can inject a placeholder
  return row.cards.reduce((acc, card) => {
    // convert the card...
    let result = convertCard(card);
    // concat in the assets...
    acc.assets = acc.assets.concat(result.assets);
    // and stuff in the converted card...
    acc.cards.push(result.card);
    // return the acc...
    return acc;
  }, { assets: [], cards: [] });
};
