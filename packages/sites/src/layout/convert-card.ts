import { cloneObject } from '@esri/hub-common';

import { convertEventListCard } from "./convert-event-list-card";
import { convertFollowCard } from "./convert-follow-card";
import { convertItemGalleryCard } from "./convert-item-gallery-card";
import { convertImageCard } from "./convert-image-card";
import { convertJumbotronCard } from "./convert-jumbotron-card";
import { ICard, ITemplatizedCard } from "./types";

/**
 * Convert a card to a templatized version of itself
 */
export const convertCard = function convertCard (card: ICard) : ITemplatizedCard {
  const clone = cloneObject(card) as ICard;
  switch (clone.component.name) {
    case 'event-list-card':
      return convertEventListCard(clone);
    case 'follow-initiative-card':
      return convertFollowCard(clone);
    case 'items/gallery-card':
      return convertItemGalleryCard(clone);
    case 'image-card':
      return convertImageCard(clone);
    case 'jumbotron-card':
      return convertJumbotronCard(clone);
    default:
      return { card: clone, assets: [] };
  }
};
