import { ICard, ITemplatizedCard } from "./types";

export const convertFollowCard = function convertFollowCard (card: ICard): ITemplatizedCard {
  card.component.settings.initiativeId = '{{initiative.item.id}}';
  return { card, assets: [] };
};
