import { getProp } from "@esri/hub-common";

import { ICard } from "./types";

function getPaths(componentName: string) {
  switch (componentName) {
    case "webmap-card":
      return ["component.settings.webmap"];
    case "items/gallery-card":
      return ["component.settings.ids"];
    default:
      return [];
  }
}

/**
 * Find all the paths dependencies for the given card
 *
 * @param {ICard} card
 */
export function getCardDependencies(card: ICard): string[] {
  const componentName = getProp(card, "component.name");

  const paths = getPaths(componentName);

  return paths.reduce(collectAndFlattenPropertyValues(card), []);
}

function collectAndFlattenPropertyValues(card: ICard) {
  return (acc: string[], path: string) => {
    const propertyValue = getProp(card, path);

    if (!propertyValue) {
      return acc;
    }

    if (Array.isArray(propertyValue)) {
      return acc.concat(propertyValue);
    } else {
      return acc.concat([propertyValue]);
    }
  };
}
