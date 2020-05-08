import { cloneObject, getProp } from '@esri/hub-common';

import { convertRow } from "./convert-row";
import { extractAssets } from "./extract-assets";

import { ISection, IRow } from "./types";

/**
 * Convert a section, collecting assets along the way...
 */
export const convertSection = function convertSection (section : ISection) {
  // if the section has a background image, and it has a url, we should
  // add that to the asset hash so it can be downloaded and added to the template item
  // and also cook some unique asset name so we can inject a placeholder
  const { rows, assets } = section.rows.reduce(toTemplatizedRows, { assets: [], rows: [] });

  const result = {
    section: cloneObject(section) as ISection,
    assets
  };

  result.section.rows = rows

  if (sectionHasBackgroundFile(section)) {
    result.assets.push(...extractAssets(section.style.background))
  }

  return result;
};

function toTemplatizedRows (acc: any, row: IRow) {
  const { assets, cards } = convertRow(row);

  acc.assets.push(...assets)
  acc.rows.push({ cards });

  return acc;
}

function sectionHasBackgroundFile (clonedSection: ISection) {
  return getProp(clonedSection, 'style.background.fileSrc')
}