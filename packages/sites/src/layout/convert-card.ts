import { cloneObject } from '@esri/hub-common';

import { convertEventListCard } from "./convert-event-list-card";
import { convertFollowCard } from "./convert-follow-card";
import { convertItemGalleryCard } from "./convert-item-gallery-card";
import { convertImageCard } from "./convert-image-card";
import { convertJumbotronCard } from "./convert-jumbotron-card";
import { ICard, ITemplatizedCard } from "./types";

const converters: { [char: string]: Function } = {
  'event-list-card': convertEventListCard,
  'follow-initiative-card': convertFollowCard,
  'items/gallery-card': convertItemGalleryCard,
  'image-card': convertImageCard,
  'jumbotron-card': convertJumbotronCard
}

/**
 * Convert a card to a templatized version of itself
 */
export const convertCard = function convertCard (card: ICard) : ITemplatizedCard {
  const clone = cloneObject(card) as ICard;

  const converter = converters[clone.component.name];

  if (converter) {
    return converter(clone)
  }

  return {
    card: clone, 
    assets: []
  }
};
