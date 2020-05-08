import { getProp } from '@esri/hub-common';

import { ICard } from "./types";

export const getCardDependencies = function getCardDependencies (card : ICard) {
  let paths : string[] = [];
  const componentName = getProp(card, 'component.name');
  switch (componentName) {
    // case 'chart-card':
    //   paths = ['component.settings.itemId'];
    //   break;
    // case 'summary-statistic-card':
    //   paths = ['component.settings.itemId'];
    //   break;
    case 'webmap-card':
      paths = ['component.settings.webmap'];
      break;
    case 'items/gallery-card':
      paths = ['component.settings.ids'];
      break;
  }
  let deps = paths.reduce((a, p) => {
    let v = getProp(card, p);
    if (v) {
      if (Array.isArray(v)) {
        a = a.concat(v);
      } else {
        a.push(v);
      }
    }
    return a;
  }, []);
  return deps;
};
