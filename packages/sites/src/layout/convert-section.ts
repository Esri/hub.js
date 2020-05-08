import { cloneObject, getProp } from '@esri/hub-common';

import { convertRow } from "./convert-row";
import { extractAssets } from "./extract-assets";

import { ISection } from "./types";

/**
 * Convert a section, collecting assets along the way...
 */
export const convertSection = function convertSection (section : ISection) {
  const clone = cloneObject(section);
  // if the section has a background image, and it has a url, we should
  // add that to the asset hash so it can be downloaded and added to the template item
  // and also cook some unique asset name so we can inject a placeholder
  const rowResult = section.rows.reduce((acc, row) => {
    const result = convertRow(row);
    // concat in the assets...
    acc.assets = acc.assets.concat(result.assets);
    acc.rows.push({ cards: result.cards });
    return acc;
  }, { assets: [], rows: [] });

  clone.rows = rowResult.rows;
  let result = {
    section: clone,
    assets: rowResult.assets
  };
  // check for assets...
  if (getProp(clone, 'style.background.fileSrc')) {
    const sectionAssets = extractAssets(clone.style.background);
    result.assets = result.assets.concat(sectionAssets);
  }
  // return the section and assets...
  return result;
};
