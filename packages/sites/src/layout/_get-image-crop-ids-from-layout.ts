import { getProp } from "@esri/hub-common";

import { ISection, ISettings, IEntry, ICard, IRow } from "./types";

/**
 * Traverse the layout graph, locating any cards that may have image resources
 * returning an array containing the resource information.
 * @param {Object} layout the layout to extract image cropIds from
 */
export function _getImageCropIdsFromLayout (layout: Object) : string[] {
  const imgAssets = [] as IEntry[] | ISettings[];

  const headerLogo = getProp(layout, 'header.component.settings.logo');

  if (headerLogo && headerLogo.cropId) {
    imgAssets.push(headerLogo);
  }

  const sections = getProp(layout, 'sections') || [];

  return sections
    .reduce(collectSectionAssets, imgAssets)
    .filter(hasCropId)
    .map(extractCropId)
}

function collectSectionAssets (assets : IEntry[], section: ISection) {
  const sectionAssets = section.rows
    .reduce(collectCards, [])
    .filter(isImageOrJumbotronCard)
    .map(extractSettingsProperty)

  // retain crop info if section has an image background
  if (getProp(section, 'style.background.cropSrc')) {
    sectionAssets.unshift(section.style.background);
  }

  return assets.concat(sectionAssets);
}

function collectCards (acc: ICard[], row: IRow) {
  return acc.concat(row.cards)
}

function isImageOrJumbotronCard (card: ICard) {
  return ['image-card', 'jumbotron-card'].indexOf(card.component.name) > -1
}

function extractSettingsProperty (card: ICard) {
  return card.component.settings
} 

function hasCropId (entry: IEntry) {
  return !!entry.cropId
}

function extractCropId (entry: IEntry) {
  return entry.cropId
}
