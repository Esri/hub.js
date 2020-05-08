import { getProp } from "@esri/hub-common";

import { ISection, ISettings, IEntry } from "./types";

export function _getImageCropIdsFromLayout (layout: Object) : string[] {
  let imgAssets = [] as IEntry[] | ISettings[];
  let headerLogo = getProp(layout, 'header.component.settings.logo');
  if (headerLogo && headerLogo.cropId) {
    imgAssets.push(headerLogo);
  }
  let cardNames = ['image-card', 'jumbotron-card'];
  let sections = getProp(layout, 'sections') || [];
  let result = sections.reduce((assets : IEntry[], section: ISection ) => {
    // retain crop info if image background on section
    if (getProp(section, 'style.background.cropSrc')) {
      assets.push(section.style.background);
    }
    // yank out any jumbotron or image card settings
    section.rows.forEach(row => {
      row.cards.filter(card => cardNames.includes(card.component.name)).forEach(card => {
        assets.push(card.component.settings);
      });
    });
    return assets;
  }, imgAssets)
  .reduce((acc: Array<String>, entry: IEntry) => {
    if (entry.cropId) {
      acc.push(entry.cropId);
    }
    return acc;
  }, []);
  return result;
}
