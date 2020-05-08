import { convertCard } from "./convert-card";

import { IRow, ITemplatizedRow } from "./types";

export const convertRow = function convertRow (row : IRow) : ITemplatizedRow {
  // if the section has a background image, and it has a url, we should
  // add that to the asset hash so it can be downloaded and added to the template item
  // and also cook some unique asset name so we can inject a placeholder
  return row.cards.reduce(convertToTemplatizedCard, { assets: [], cards: [] });
};

function convertToTemplatizedCard (acc: any, card: any) {
  const result = convertCard(card);

  acc.assets = acc.assets.concat(result.assets);
  acc.cards.push(result.card);

  return acc;
}